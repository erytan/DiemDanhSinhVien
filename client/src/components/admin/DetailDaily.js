import React, { useState, useEffect } from "react";
import { apiGetOneSubject } from "../../apis/subject"; // Ensure the path is correct
import postingPhoto from "./er/img/undraw_posting_photo.svg";
import './er/css/Detaildaily.css';

const DetailDaily = ({ selectSession, selectedDate }) => {
  const [sessionsWithSubjects, setSessionsWithSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        if (!selectSession || selectSession.length === 0) {
          setSessionsWithSubjects([]);
          setLoading(false);
          return;
        }

        // Extract unique subject IDs from selectSession
        const subjectIds = [...new Set(selectSession.map(session => session.subject))];

        // Fetch details for each subject
        const subjectResponses = await Promise.all(
          subjectIds.map(id => apiGetOneSubject(id).catch(error => ({ error })))
        );

        // Create a map of subject ID to subject data for easy lookup
        const subjectMap = subjectResponses.reduce((acc, response) => {
          if (response.error) {
            console.error("Error fetching subject:", response.error);
            return acc;
          }
          const subject = response.data;
          if (subject && subject.id_subject) {
            acc[subject.id_subject] = subject;
          }
          return acc;
        }, {});

        const formatTime = (timeString) => {
          const [hour, minute] = timeString.split(":");
          let formattedHour = parseInt(hour, 10);
          const suffix = formattedHour >= 12 ? "PM" : "AM";
          formattedHour = formattedHour % 12 || 12;
          return `${formattedHour}:${minute} ${suffix}`;
        };

        // Group sessions by subject
        const sessionsGroupedBySubject = selectSession.reduce((acc, session) => {
          const subject = subjectMap[session.subject];
          if (subject) {
            if (!acc[subject.id_subject]) {
              acc[subject.id_subject] = {
                subjectname: subject.subjectname,
                sessions: []
              };
            }
            acc[subject.id_subject].sessions.push({
              startTime: formatTime(session.startTime),
              endTime: formatTime(session.endTime),
              location: `Phòng ${session.location}`
            });
          }
          return acc;
        }, {});

        // Convert grouped data into an array
        const combinedSessions = Object.values(sessionsGroupedBySubject);

        setSessionsWithSubjects(combinedSessions);
      } catch (error) {
        console.error("Error fetching subject details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [selectSession]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Daily Detail {formatDate(selectedDate)}</h6>
      </div>
      <div className="card-body">
        <div className="text-center">
          <img
            className="img-fluid px-3 px-sm-4 mt-3 mb-4"
            style={{ width: "25rem" }}
            src={postingPhoto}
            alt="Illustration"
          />
        </div>
        <div>
          <h6 className="mt-3">Thông tin chi tiết:</h6>
          {loading ? (
            <p>Đang tải thông tin môn học...</p>
          ) : (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Tên Môn Học</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {sessionsWithSubjects.length > 0 ? (
                  sessionsWithSubjects.map((subject, index) => (
                    <React.Fragment key={index}>
                      {subject.sessions.map((session, i) => (
                        <tr key={i}>
                          {i === 0 ? (
                            <td rowSpan={subject.sessions.length}>
                              {subject.subjectname}
                            </td>
                          ) : null}
                          <td>{session.startTime}</td>
                          <td>{session.endTime}</td>
                          <td>{session.location}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Không có thông tin phiên học</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDaily;
