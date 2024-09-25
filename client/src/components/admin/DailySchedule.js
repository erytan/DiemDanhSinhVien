import React, { useState, useEffect } from "react";
import { apiGetSessions } from "../../apis/session";
import { apiGetOneSubject } from "../../apis/subject";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../admin/er/css/DailySchedule.css";

const CalendarView = ({ onDateSelect }) => {
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const response = await apiGetSessions();
      const sessionsData = response.session || [];
      const subjectIds = [
        ...new Set(sessionsData.map((session) => session.subject)),
      ];
      const subjectsData = await Promise.all(
        subjectIds.map((id) => apiGetOneSubject(id))
      );
      const subjects = subjectsData.flatMap((response) => response.data || []);
      setSubjects(subjects);
      const repeatedSessions = repeatSessions(sessionsData, subjects);
      setSessions(repeatedSessions);
    } catch (error) {
      console.error("Lỗi khi lấy phiên hoặc môn học:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const today = new Date();
    handleDateChange(today);
  }, [sessions, subjects]);

  const handleDateChange = (newDate) => {
    const dateObj = new Date(newDate);

    if (isNaN(dateObj.getTime())) {
      console.error("Ngày không hợp lệ:", newDate);
      return;
    }

    const formattedDate = formatDateToVietnamTimezone(dateObj);
    setDate(dateObj);
    const sessionsForDate = getSessionsForDate(dateObj);
    setSelectedDate(formattedDate);
    setSelectedSessions(sessionsForDate);
    onDateSelect(formattedDate, sessionsForDate);
  };

  const formatDateToVietnamTimezone = (date) => {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.error("Ngày không hợp lệ:", date);
      return dateObj.toISOString().split("T")[0];
    }

    const vietnamOffset = 7 * 60;
    const utcOffset = dateObj.getTimezoneOffset();
    const vietnamDate = new Date(
      dateObj.getTime() + (vietnamOffset - utcOffset) * 60 * 1000
    );

    return vietnamDate.toISOString().split("T")[0];
  };

  const getSessionsForDate = (date) => {
    const formattedDate = formatDateToVietnamTimezone(date);
    return sessions.filter(
      (session) => formatDateToVietnamTimezone(session.date) === formattedDate
    );
  };

  const getUniqueSubjectNamesForDate = (date) => {
    const sessionsForDate = getSessionsForDate(date);
    const uniqueSubjectIds = [
      ...new Set(sessionsForDate.map((session) => session.subject)),
    ];
    const uniqueSubjectNames = uniqueSubjectIds.map((id) => {
      const subject = subjects.find((sub) => sub.id_subject === id);
      return subject ? subject.subjectname : "Môn học không xác định";
    });
    return uniqueSubjectNames;
  };

  const repeatSessions = (sessions, subjects) => {
    const repeatedSessions = [];
  
    sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const subject = subjects.find((sub) => sub.id_subject === session.subject);
      
      if (subject && subject.countSession) {
        for (let i = 0; i < subject.countSession; i++) {
          const newDate = new Date(sessionDate);
          newDate.setDate(newDate.getDate() + i * 7); // Cộng thêm 7 ngày cho mỗi buổi dạy
          repeatedSessions.push({ ...session, date: newDate });
        }
      } else {
        repeatedSessions.push(session); // Nếu không có số buổi dạy, chỉ thêm phiên gốc
      }
    });
  
    return repeatedSessions;
  };
  

  return (
    <div className="card-body">
      <Calendar
        onChange={handleDateChange}
        value={date}
        onClickDay={handleDateChange}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const formattedDate = formatDateToVietnamTimezone(date);
            const sessionsForDate = getSessionsForDate(date);
            if (sessionsForDate.length > 0) {
              return 'calendar-day-has-sessions'; // Lớp CSS để đánh dấu ngày có môn học
            }
          }
          return null;
        }}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const uniqueSubjectNames = getUniqueSubjectNamesForDate(date);
            if (uniqueSubjectNames.length > 0) {
              return (
                <div className="calendar-day-content">
                  <ul className="session-list">
                    {uniqueSubjectNames.map((name, index) => (
                      <li key={index}>
                        <strong>{name}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          }
          return null;
        }}
      />
    </div>
  );
};

export default CalendarView;
