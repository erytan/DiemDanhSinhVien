import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiCreateSession } from "../../apis/session"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";

const PopUpAddSession = ({ show, handleClose, subjectId, fetchData }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [id_subject, setIdSubject] = useState("");

  // Cập nhật id_subject khi subjectId thay đổi
  useEffect(() => {
    if (subjectId) {
      setIdSubject(subjectId);
    }
  }, [subjectId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await apiCreateSession({
        date,
        startTime,
        endTime,
        location,
        id_subject,
      });

      if (response.success) {
        toast.success("Create successfully.");
        fetchData(); // Gọi hàm fetchData để làm mới bảng
        handleClose(); // Đóng modal sau khi tạo session thành công
      } else {
        toast.error("Session has already been added.");
      }
    } catch (error) {
      toast.error("Error occurred: " + error.message);
    }
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
    setEndTime(value); // Cập nhật giá trị endTime
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formSubject">
            <Form.Label className="input-label">Subject:</Form.Label>
            <Form.Control
              type="text"
              style={{
                fontSize: ".8rem",
                borderRadius: "10rem",
                padding: "1.5rem 1rem",
              }}
              value={id_subject}
              onChange={(e) => setIdSubject(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label className="input-label">Date:</Form.Label>
            <Form.Control
              type="date"
              style={{
                fontSize: ".8rem",
                borderRadius: "10rem",
                padding: "1.5rem 1rem",
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

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
              style={{
                fontSize: ".8rem",
                borderRadius: "10rem",
                padding: "1.5rem 1rem",
              }}
              type="time"
              id="updateEndTime"
              className="form-control"
              onChange={handleTimeEndChange}
              value={endTime}
            />
          </div>

          <Form.Group controlId="formLocation">
            <Form.Label className="input-label">Location:</Form.Label>
            <Form.Control
              style={{
                fontSize: ".8rem",
                borderRadius: "10rem",
                padding: "1.5rem 1rem",
              }}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Session
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopUpAddSession;
