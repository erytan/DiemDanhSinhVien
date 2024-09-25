import React, { useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiDeleteSubject } from "../../apis/subject";
import { apiDeleteSession } from "../../apis/session";
import { toast } from "react-toastify";
import $ from "jquery"; // Đảm bảo jQuery đã được import

const PopupDeleteSubject = ({
  show,
  handleClose,
  sessions = [], // Default to an empty array
  selectedSession = "",
  setSelectedSession,
  subjectId,
  onDeleteSuccess,
  fetchData,
  subjects, // Ensure this is passed as a prop or managed as state
  setSubjects, // Ensure this is passed as a prop or managed as state
}) => {
  const handleSelectChange = (e) => {
    setSelectedSession(e.target.value);
  };

  const handleDeleteSubject = async () => {
    if (!subjectId) {
      toast.error("No subject selected to delete.");
      return;
    }

    try {
      const response = await apiDeleteSubject(subjectId);
      if (response.success) {
        toast.success("Subject deleted successfully.");

        // Cập nhật danh sách subjects sau khi xóa thành công
        const updatedSubjects = subjects.filter(
          (subject) => subject.id !== subjectId
        );
        setSubjects(updatedSubjects);

        // Refresh dữ liệu bảng nếu cần
        fetchData();

        handleClose(); // Đóng modal sau khi xóa thành công
      } else {
        toast.error(response.message || "Failed to delete subject.");
      }
    } catch (error) {
      toast.error("Error occurred: " + (error.message || "Unknown error"));
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) {
      toast.error("Please select a session to delete.");
      return;
    }

    try {
      const response = await apiDeleteSession(subjectId, selectedSession);
      if (response.success) {
        toast.success("Session deleted successfully.");

        // Update the sessions list after a successful session deletion
        const updatedSessions = Array.isArray(sessions)
          ? sessions.filter((session) => session !== selectedSession)
          : [];

        // Update subjects with new session list
        const updatedSubjects = subjects.map((subject) => {
          if (subject.id === subjectId) {
            return { ...subject, sessions: updatedSessions };
          }
          return subject;
        });

        setSubjects(updatedSubjects);

        // Call fetchData to ensure the session list is updated
        fetchData();

        // Destroy and reinitialize DataTable
        setTimeout(() => {
          const $dataTable = $("#dataTable");
          if ($dataTable.length) {
            const table = $dataTable.DataTable();
            table.destroy(); // Destroy existing DataTable
            $dataTable.DataTable(); // Reinitialize DataTable
          }
        }, 100); // Delay to ensure DataTable is updated

        setSelectedSession(""); // Reset the selected session
        handleClose();
      } else {
        toast.error(response.message || "Failed to delete session.");
      }
    } catch (error) {
      toast.error("Error occurred: " + (error.message || "Unknown error"));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this subject?</p>
        {Array.isArray(sessions) && sessions.length > 0 ? (
          <Form.Group controlId="sessionSelect">
            <Form.Label>Session</Form.Label>
            <div
              className="form-group"
              style={{
                marginTop: "2rem",
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column", // Ensure the elements are stacked vertically
              }}
            >
              <div
                className="form-group"
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                }}
              >
                <Form.Control
                  style={{
                    fontSize: ".8rem",
                    borderRadius: "10rem",
                    height: "3rem",
                    marginRight: "0.5rem",
                  }}
                  as="select"
                  value={selectedSession}
                  onChange={handleSelectChange}
                >
                  <option value="">Select a session</option>
                  {sessions.map((session, index) => (
                    <option key={index} value={session}>
                      {session}
                    </option>
                  ))}
                </Form.Control>
                <Button
                  variant="danger"
                  onClick={handleDeleteSession}
                  style={{
                    backgroundColor: "#dc3545", // Màu nền đỏ của Bootstrap
                    borderColor: "#dc3545", // Đường viền đỏ của Bootstrap
                    color: "#fff", // Màu chữ trắng
                    fontWeight: "bold", // Chữ đậm
                    padding: "0.5rem 1rem", // Khoảng cách trong nút
                    borderRadius: "0.5rem", // Bo tròn góc
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease", // Hiệu ứng chuyển màu
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#c82333")
                  } // Hiệu ứng hover
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#dc3545")
                  } // Hiệu ứng hover
                >
                  Delete
                </Button>
              </div>
            </div>
          </Form.Group>
        ) : (
          <p>No sessions available to delete.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteSubject}>
          Delete Subject
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupDeleteSubject;
