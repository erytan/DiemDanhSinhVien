import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import "datatables.net";
import {
  apiCreateSubject,
  apiGetSubject,
  apiUpdateSubjectAndSession,
} from "../../apis/subject";
import { apiGetOneSession } from "../../apis/session";
import { toast } from "react-toastify";
import PopUpAddSession from "./PopUpAddSession"; // Đảm bảo đường dẫn đúng
import PopUpDeleteSubject from "./PopupDeleteSubject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCirclePlus,
  faWrench,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import "./er/css/tableDetailSubject.css";

const DataTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectname, setSubjectname] = useState("");
  const [location, setLocation] = useState("");
  const [countSession, setCountSession] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  //session combobox
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSession1, setSelectedSession1] = useState("");
  //update subject
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateModal1, setShowUpdateModal1] = useState(false);
  const [selectedSubjectForUpdate, setSelectedSubjectForUpdate] = useState(
    null
  );
  const [updatedSubjectname, setUpdatedSubjectname] = useState("");
  const [updateCountSession, setUpdateCountSession] = useState("");
  const [updatedLocation, setUpdatedLocation] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedStartTime, setUpdatedStartTime] = useState("");
  const [updatedEndTime, setUpdatedEndTime] = useState("");

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedSession1(""); // Reset selected session
    setStudents([]); // Clear students list
  };

  const handleSessionChange = async (event) => {
    const sessionId = event.target.value;
    setSelectedSession(sessionId); // Cập nhật session đã chọn

    if (!sessionId) {
      // Reset thông tin session nếu không có session được chọn
      setUpdatedDate("");
      setUpdatedStartTime("");
      setUpdatedEndTime("");
      setUpdatedLocation(""); // Reset location
      return;
    }

    try {
      const response = await apiGetOneSession(sessionId);
      if (response && response.data) {
        const { date, startTime, endTime, location } = response.data;

        // Đảm bảo ngày được định dạng đúng cho ô nhập liệu
        const formattedDate = new Date(date).toISOString().slice(0, 16); // Chuyển đổi thành định dạng YYYY-MM-DDTHH:MM

        setUpdatedDate(formattedDate);
        setUpdatedStartTime(startTime);
        setUpdatedEndTime(endTime);
        setUpdatedLocation(location);
      } else {
        toast.error("No session data available.");
      }
    } catch (error) {
      toast.error("Error fetching session details.");
    }
  };
  const handleDeleteSuccess = () => {
    // Refresh the subjects list
    const fetchSubjects = async () => {
      try {
        const response = await apiGetSubject();
        setSubjects(response.data);
      } catch (error) {
        toast.error("Failed to fetch subjects.");
      }
    };

    fetchSubjects();
  };
  const handleSessionChange1 = async (event) => {
    const sessionId = event.target.value;
    setSelectedSession1(sessionId);

    try {
      const response = await apiGetOneSession(sessionId);
      if (response && response.data) {
        const { user } = response.data;

        setStudents(user || []);
      } else {
        toast.error("No session data available.");
      }
    } catch (error) {
      toast.error("Error fetching session details.");
    }
  };
  const handleOpenUpdateModal1 = (subject) => {
    setSelectedSubjectForUpdate(subject);
    setSelectedSession1(""); // Reset selected session

    // Fetch sessions based on the subject
    try {
      const { sessions } = subject; // Get sessions directly from the subject

      // Check if sessions exist and set them to state
      if (sessions && Array.isArray(sessions)) {
        setSessions(sessions);
      } else {
        toast.error("No sessions available for this subject.");
      }
    } catch (error) {
      toast.error("Error fetching sessions.");
    }

    setShowUpdateModal1(true);
  };
  const handleOpenUpdateModal = async (subject) => {
    setSelectedSubjectForUpdate(subject);
    setUpdatedSubjectname(subject.subjectname);
    setUpdateCountSession(subject.countSession);
    setUpdatedLocation(subject.location);
    setUpdatedDate(subject.date);
    setUpdatedStartTime(subject.startTime);
    setUpdatedEndTime(subject.endTime);
    setSelectedSession(""); // Reset selected session

    // Fetch sessions based on the subject ID
    try {
      // Assuming the subject object has a property 'sessions' which is an array of session objects
      const { sessions } = subject; // Get sessions directly from the subject

      // Check if sessions exist and set them to state
      if (sessions && Array.isArray(sessions)) {
        setSessions(sessions);
      } else {
        toast.error("No sessions available for this subject.");
      }
    } catch (error) {
      toast.error("Error fetching sessions.");
    }

    setShowUpdateModal(true);
  };
  const handleBlur = () => setIsFocused(subjectname !== "");
  const handleBlur1 = () => setIsFocused1(location !== "");
  const handleSubject = (event) => setSubjectname(event.target.value);
  const handleLocation = (event) => setLocation(event.target.value);
  const handleCountSession = (event) => setCountSession(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);
  const handleShow = () => setShowModal(true);
  const handleShow1 = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setShowModal1(true);
  };
  const handleShow2 = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setShowModal2(true);
  };
  const handleClose = () =>
    setShowModal(false) || setShowModal1(false) || setShowModal2(false);
  const handleFocus = () => setIsFocused(true);
  const handleFocus1 = () => setIsFocused1(true);

  const fetchData = useCallback(async () => {
    try {
      const responseSubjects = await apiGetSubject();
      setSubjects(responseSubjects.subject);
    } catch (error) {
      toast.error("Error fetching data.");
    }
  }, []);
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    let formattedHour = parseInt(hour, 10);
    const suffix = formattedHour >= 12 ? "PM" : "AM";
    formattedHour = formattedHour % 12 || 12; // Convert hour 0 to 12
    return `${formattedHour}:${minute} ${suffix}`;
  };
  const handleTimeStartChange = (event) => {
    const { value } = event.target;
    const newStartTime = new Date(`1970-01-01T${value}:00`); // Tạo đối tượng Date cho startTime mới

    if (endTime) {
      const newEndTime = new Date(`1970-01-01T${endTime}:00`); // Tạo đối tượng Date cho endTime hiện tại
      // Kiểm tra nếu startTime mới không lớn hơn endTime hiện tại
      if (newStartTime >= newEndTime) {
        toast.error("Start time cannot be greater than or equal to end time.");
        return;
      }
      // Kiểm tra khoảng thời gian giữa startTime và endTime
      if (newEndTime - newStartTime < 5400000) {
        // 1h30p = 5400000 ms
        toast.error(
          "The duration between start time and end time must be at least 1 hour and 30 minutes."
        );
        return;
      }
    }
    setUpdatedStartTime(value);
    setStartTime(value); // Cập nhật giá trị startTime
  };

  const handleTimeEndChange = (event) => {
    const { value } = event.target;
    const newEndTime = new Date(`1970-01-01T${value}:00`); // Tạo đối tượng Date cho endTime mới

    if (startTime) {
      const newStartTime = new Date(`1970-01-01T${startTime}:00`); // Tạo đối tượng Date cho startTime hiện tại
      // Kiểm tra nếu endTime mới không nhỏ hơn startTime hiện tại
      if (newEndTime <= newStartTime) {
        toast.error("End time cannot be less than or equal to start time.");
        return;
      }
      // Kiểm tra khoảng thời gian giữa startTime và endTime
      if (newEndTime - newStartTime < 5400000) {
        // 1h30p = 5400000 ms
        toast.error(
          "The duration between start time and end time must be at least 1 hour and 30 minutes."
        );
        return;
      }
    }
    setUpdatedEndTime(value);
    setEndTime(value); // Cập nhật giá trị endTime
  };
  const handleUpdateSubject = async () => {
    // Validate times
    if (startTime && endTime && startTime > endTime) {
      toast.error("Start time cannot be greater than end time.");

      return;
    }
    try {
      const payload = {
        countSession: updateCountSession,
        subjectname: updatedSubjectname,
        location: updatedLocation,
        date: updatedDate,
        startTime: updatedStartTime,
        endTime: updatedEndTime,
      };

      const response = await apiUpdateSubjectAndSession(
        selectedSubjectForUpdate.id_subject,
        selectedSession, // Include selected session ID here
        payload
      );
      if (response.success) {
        toast.success("Updated successfully.");
        setShowUpdateModal(false);
        fetchData(); // Refresh data after successful update
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("Error updating subject.");
    }
  };

  const handleCreateSubject = useCallback(async () => {
    // Validate times
    if (startTime && endTime && startTime > endTime) {
      toast.error("Start time cannot be greater than end time.");
      return;
    }

    try {
      if (!subjectname || !location || !date || !startTime || !endTime) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const payload = {
        subjectname,
        location,
        date,
        startTime,
        endTime,
        countSession,
      };

      const response = await apiCreateSubject(payload);
      if (response.mes) {
        toast.success("Create successfully.");
        handleClose();
        fetchData(); // Refresh data after successful creation
      } else {
        toast.error("Subject has already been added.");
      }
    } catch (error) {
      toast.error("Error occurred:", error);
    }
  }, [
    subjectname,
    countSession,
    location,
    date,
    startTime,
    endTime,
    fetchData,
  ]);
  useEffect(() => {
    if (selectedSubject && selectedSubject.sessions) {
      setSessions(selectedSubject.sessions);
    }
  }, [selectedSubject]);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(subjects) && subjects.length > 0) {
      // Destroy and reinitialize DataTable
      $("#dataTable").DataTable(); // Reinitialize DataTable

      const fetchSessionDetails = async (sessionId) => {
        try {
          const response = await apiGetOneSession(sessionId);
          if (response && response.data) {
            const { date, startTime, endTime, location } = response.data;
            return { date: new Date(date), startTime, endTime, location };
          } else {
            return { date: "N/A", startTime: "N/A", endTime: "N/A" };
          }
        } catch (error) {
          return { date: "Error", startTime: "Error", endTime: "Error" };
        }
      };

      const fetchAllSessionDetails = async () => {
        const details = {};
        for (const subject of subjects) {
          if (Array.isArray(subject.sessions)) {
            for (const sessionId of subject.sessions) {
              details[sessionId] = await fetchSessionDetails(sessionId);
            }
          } else if (subject.sessions) {
            details[subject.sessions] = await fetchSessionDetails(
              subject.sessions
            );
          }
        }
        setSessionDetails(details);
      };

      fetchAllSessionDetails();
    }
  }, [subjects]); // Ensure 'subjects' is used here

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Tables</h1>
      <p className="mb-4">
        DataTables is a third party plugin that is used to generate the demo
        table below. For more information about DataTables, please visit the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://datatables.net"
        >
          official DataTables documentation
        </a>
        .
      </p>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            DataTables Example
          </h6>
          <div
            className="font-weight-bold text-primary"
            style={{ marginTop: "1rem" }}
          >
            <Button variant="primary" onClick={handleShow}>
              Open Modal
            </Button>

            <Modal show={showModal} onHide={handleClose} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>DataTables Example</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div
                    className="form-group"
                    style={{
                      marginBottom: "1rem",
                      marginTop: "2rem",
                      display: "flex",
                    }}
                  >
                    <label
                      className={`floating-label ${
                        isFocused || subjectname ? "focused" : ""
                      }`}
                      htmlFor="subjectInput"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onChange={handleSubject}
                      value={subjectname}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label className="input-label" htmlFor="dateInput">
                      Date:
                    </label>
                    <input
                      type="date"
                      id="dateInput"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      onChange={handleDateChange}
                      value={date} // Chỉ lấy ngày từ đối tượng Date
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      marginTop: "2rem",
                      marginBottom: "1rem",
                      display: "flex",
                    }}
                  >
                    <label className="input-label" htmlFor="timeStartInput">
                      Time Start:
                    </label>
                    <input
                      type="time"
                      id="timeStartInput"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      onChange={handleTimeStartChange}
                      value={startTime}
                    />
                    <label
                      className="input-label"
                      htmlFor="timeEndInput"
                      style={{ marginLeft: "2rem" }}
                    >
                      Time End:
                    </label>
                    <input
                      type="time"
                      id="timeEndInput"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      onChange={handleTimeEndChange}
                      value={endTime}
                    />
                    <label
                      className="input-label"
                      htmlFor="timeEndInput"
                      style={{ marginLeft: "2rem" }}
                    >
                      Day Class:
                    </label>
                    <input
                      type="text"
                      id="timeEndInput"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                        width: "5rem",
                      }}
                      onChange={handleCountSession}
                      value={countSession}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      marginBottom: "1rem",
                      marginTop: "2rem",
                      display: "flex",
                    }}
                  >
                    <label
                      className={`floating1-label ${
                        isFocused1 || location ? "focused" : ""
                      }`}
                      htmlFor="locationInput"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="locationInput"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      onFocus={handleFocus1}
                      onBlur={handleBlur1}
                      onChange={handleLocation}
                      value={location}
                    />
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleCreateSubject}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            {subjects.length > 0 && (
              <table className="table table-bordered" id="dataTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Session</th>
                    <th>Date</th>
                    <th>Time Start</th>
                    <th>Time End</th>
                    <th>Location</th>
                    <th>Day Class</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.id_subject}</td>
                      <td>{subject.subjectname}</td>
                      <td>
                        {Array.isArray(subject.sessions) ? (
                          subject.sessions.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                              {subject.sessions.map((session, index) => (
                                <li key={index}>{session}</li>
                              ))}
                            </ul>
                          ) : (
                            "No sessions available"
                          )
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>
                        {Array.isArray(subject.sessions) ? (
                          subject.sessions.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                              {subject.sessions.map((sessionId) => (
                                <li key={sessionId}>
                                  {sessionDetails[sessionId]
                                    ? sessionDetails[
                                        sessionId
                                      ].date.toLocaleDateString("vn-VN")
                                    : "Loading..."}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No sessions available"
                          )
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>
                        {Array.isArray(subject.sessions) ? (
                          subject.sessions.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                              {subject.sessions.map((sessionId) => (
                                <li key={sessionId}>
                                  {sessionDetails[sessionId]
                                    ? formatTime(
                                        sessionDetails[sessionId].startTime
                                      )
                                    : "Loading..."}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No sessions available"
                          )
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>
                        {Array.isArray(subject.sessions) ? (
                          subject.sessions.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                              {subject.sessions.map((sessionId) => (
                                <li key={sessionId}>
                                  {sessionDetails[sessionId]
                                    ? formatTime(
                                        sessionDetails[sessionId].endTime
                                      )
                                    : "Loading..."}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No sessions available"
                          )
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>
                        {Array.isArray(subject.sessions) ? (
                          subject.sessions.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                              {subject.sessions.map((sessionId) => (
                                <li key={sessionId}>
                                  {sessionDetails[sessionId] &&
                                  sessionDetails[sessionId].location
                                    ? sessionDetails[sessionId].location
                                    : "Location not available"}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No sessions available"
                          )
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td>{subject.countSession} Day</td>
                      <td>
                        <div>
                          <Button
                            onClick={() => handleShow1(subject.id_subject)}
                          >
                            <FontAwesomeIcon icon={faCirclePlus} />
                          </Button>
                          <PopUpAddSession
                            show={
                              showModal1 &&
                              selectedSubjectId === subject.id_subject
                            }
                            handleClose={handleClose}
                            subjectId={selectedSubjectId}
                            fetchData={fetchData}
                          />
                          {" | "}
                          <Button
                            variant="info"
                            onClick={() => {
                              setSelectedSubject(subject);
                              setShowDetailModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faCircleInfo} />
                          </Button>
                          {" | "}
                          <Button
                            variant="warning"
                            onClick={() => handleOpenUpdateModal(subject)}
                          >
                            <FontAwesomeIcon icon={faWrench} />
                          </Button>
                          {" | "}
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleShow2(subject.id_subject) ||
                              handleOpenUpdateModal1(subject)
                            }
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </Button>
                          <PopUpDeleteSubject
                            show={
                              showModal2 &&
                              selectedSubjectId === subject.id_subject
                            }
                            sessions={sessions}
                            selectedSession={selectedSession}
                            setSelectedSession={setSelectedSession}
                            handleClose={handleClose}
                            subjectId={selectedSubjectId}
                            fetchData={fetchData}
                            onDeleteSuccess={handleDeleteSuccess}
                            subjects={subjects} // Ensure this is passed
                            setSubjects={setSubjects} // Ensure this is passed
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Detail Modal */}
            <Modal
              show={showDetailModal}
              onHide={handleCloseDetailModal}
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>Subject Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedSubject && (
                  <div className="modal-container">
                    <div className="info-container">
                      <p>
                        <strong>Subject ID:</strong>{" "}
                        {selectedSubject.id_subject}
                      </p>
                      <p>
                        <strong>Subject Name:</strong>{" "}
                        {selectedSubject.subjectname}
                      </p>
                      <p>
                        <strong>Number of Sessions:</strong>{" "}
                        {selectedSubject.countSession}
                      </p>
                      <p>
                        <strong>Select Session:</strong>
                        <select
                          className="session-select"
                          id="sessionSelect"
                          value={selectedSession1}
                          onChange={handleSessionChange1}
                        >
                          <option value="">Select Session</option>
                          {sessions.length > 0 ? (
                            sessions.map((session, index) => (
                              <option key={index} value={session.id}>
                                {session}
                              </option>
                            ))
                          ) : (
                            <option value="">No sessions available</option>
                          )}
                        </select>
                      </p>
                    </div>
                    <div className="student-container">
                      {students.length > 0 && (
                        <>
                          <h5>Student List</h5>
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                              <thead>
                                <tr>
                                  <th>First Name</th>
                                  <th>Last Name</th>
                                  <th>Class</th>
                                  <th>Student ID</th>
                                  <th>Attendance Count</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((student, index) => (
                                  <tr key={index}>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.className}</td>
                                    <td>{student.MSSV}</td>
                                    <td>{student.attendanceCount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDetailModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* modal update  */}
            <Modal
              show={showUpdateModal}
              onHide={() => setShowUpdateModal(false)}
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Subject</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="form-group">
                    <label htmlFor="updateSubjectname" className="input-label">
                      Subject Name:{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      id="updateSubjectname"
                      value={updatedSubjectname}
                      onChange={(e) => setUpdatedSubjectname(e.target.value)}
                    />
                  </div>
                  {/* ComboBox For Sessions */}
                  <div className="form-group">
                    <label htmlFor="sessionSelect" className="input-label">
                      Select Session:
                    </label>
                    <select
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        height: "3rem",
                      }}
                      id="sessionSelect"
                      className="form-control"
                      value={selectedSession}
                      onChange={handleSessionChange}
                    >
                      <option value="">Select Session</option>
                      {sessions.length > 0 ? (
                        sessions.map((session, index) => (
                          <option key={index} value={session.id}>
                            {session}{" "}
                            {/* Thay 'name' bằng thuộc tính phù hợp */}
                          </option>
                        ))
                      ) : (
                        <option value="">No sessions available</option>
                      )}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="updateLocation" className="input-label">
                      Location:
                    </label>
                    <input
                      type="text"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      id="updateLocation"
                      className="form-control"
                      value={updatedLocation}
                      onChange={(e) => setUpdatedLocation(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label" htmlFor="dateInput">
                      Date:
                    </label>
                    <input
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      type="datetime-local"
                      id="updateDate"
                      className="form-control"
                      value={updatedDate}
                      onChange={(e) => setUpdatedDate(e.target.value)}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      marginTop: "2rem",
                      marginBottom: "1rem",
                      display: "flex",
                    }}
                  >
                    <label className="input-label" htmlFor="timeStartInput">
                      Time Start:
                    </label>
                    <input
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      type="time"
                      id="updateStartTime"
                      className="form-control form-control-user"
                      onChange={handleTimeStartChange}
                      value={updatedStartTime}
                    />
                    <label
                      className="input-label"
                      htmlFor="timeEndInput"
                      style={{ marginLeft: "2rem" }}
                    >
                      Time End:
                    </label>
                    <input
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                      }}
                      type="time"
                      id="updateEndTime"
                      className="form-control"
                      onChange={handleTimeEndChange}
                      value={updatedEndTime}
                    />
                    <label
                      className="input-label"
                      htmlFor="timeEndInput"
                      style={{ marginLeft: "2rem" }}
                    >
                      Day Class:{" "}
                    </label>
                    <input
                      type="text"
                      id="timeEndInput"
                      className="form-control form-control-user"
                      style={{
                        fontSize: ".8rem",
                        borderRadius: "10rem",
                        padding: "1.5rem 1rem",
                        width: "5rem",
                      }}
                      onChange={(e) => setUpdateCountSession(e.target.value)}
                      value={updateCountSession}
                    />
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleUpdateSubject}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
