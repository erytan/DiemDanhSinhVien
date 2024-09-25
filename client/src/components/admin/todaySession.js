import React, { useEffect, useState } from "react";
import moment from "moment";
import { apiGetSession } from "../../apis/session";
import { apiGetOneSubject } from "../../apis/subject";
import ScannerQr from "./QrScan";
import { Modal, Button } from "react-bootstrap";

const TodaySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await apiGetSession();
        if (response.session) {
          const today = moment().format("YYYY-MM-DD");
          const subjectResponses = await Promise.all(
            response.session.map((session) => apiGetOneSubject(session.subject))
          );

          const subjectCounts = subjectResponses.reduce((acc, response) => {
            const subjectId = response.data.id_subject;
            const countSession = response.data.countSession || 0;
            acc[subjectId] = countSession;
            return acc;
          }, {});

          const sessionsWithUpdatedDates = response.session.map((session) => {
            const sessionDate = moment(session.date);
            const countSession = subjectCounts[session.subject] || 0;
            const updatedDates = Array.from({ length: countSession }, (_, i) =>
              sessionDate
                .clone()
                .add(7 * i, "days")
                .format("YYYY-MM-DD")
            );

            return {
              ...session,
              originalDate: sessionDate.format("YYYY-MM-DD"),
              updatedDates,
            };
          });

          const filteredSessions = sessionsWithUpdatedDates.filter((session) =>
            session.updatedDates.includes(today)
          );

          const sessionsWithSubjectNames = await Promise.all(
            filteredSessions.map(async (session) => {
              try {
                const subjectResponse = await apiGetOneSubject(session.subject);
                session.subjectName = subjectResponse.data.subjectname;
              } catch (error) {
                console.error(
                  `Error fetching subject ${session.subject}:`,
                  error
                );
                session.subjectName = "Unknown Subject";
              }
              return session;
            })
          );

          setSessions(sessionsWithSubjectNames);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleButtonClick = (session) => {
    setSelectedSubject(session); // Lưu thông tin môn học đang chọn
    setShowScanner(true); // Hiển thị scanner
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1rem",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="card shadow h-100 py-2">
          <div className="card-body">
            <div className="text-center">
              <h4
                className="font-weight-bold text-gray-800"
                style={{ fontFamily: "'Playwrite AR', serif" }}
              >
                Your days off!!!
              </h4>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        {sessions.map((session) => (
          <div key={session.id_session} className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-base font-weight-bold text-primary text-uppercase mb-1">
                      {session.subjectName}
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {session.startTime} - {session.endTime}
                    </div>
                    <div className="text-xs text-gray-600">
                      Phòng {session.location}
                    </div>
                  </div>
                  <div className="col-auto">
                    <Button
                      style={{
                        marginBottom: "0.7rem",
                        marginRight: "1rem",
                      }}
                      onClick={() => handleButtonClick(session)} // Sử dụng hàm xử lý khi nhấn nút
                    >
                      Quét QR
                    </Button>
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showScanner} onHide={() => setShowScanner(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Scanner QR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ScannerQr
            selectedSubject={selectedSubject} // Truyền thông tin môn học vào ScannerQr
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScanner(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TodaySessions;
