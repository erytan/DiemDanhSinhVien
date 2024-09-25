import React, { useState, useRef } from "react";
import QrScanner from "qr-scanner";
import { Modal, Button, Row, Col } from "react-bootstrap";
import path from "../../ultils/path";
import "./css/popupscan.css";

const Tesst = () => {
  const [show, setShow] = useState(false);
  const [mssvList, setMssvList] = useState([]);
  const [lastScannedMssv, setLastScannedMssv] = useState(null);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    // Stop QR Scanner when modal is closed
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
  };

  const handleShow = () => {
    setShow(true);
    // Initialize QR Scanner when modal is shown
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(videoRef.current, handleScan, {
        onDecodeError: handleError,
      });
      qrScannerRef.current.start();
    }
  };

  const handleScan = (result) => {
    if (result) {
      const parts = result.data.split("-");
      if (parts.length > 0) {
        const mssv = parts[0];
        console.log("Scanned MSSV:", mssv);
        if (mssv !== lastScannedMssv) {
          setLastScannedMssv(mssv);
          setMssvList(prevList => [...prevList, mssv]); // Add new MSSV to the list
        }
      }
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
  };

  return (
    <div>
      {/* Navigation link to a page with QR Code */}
      <a href={`/user/${path.QRCODE}`}>QR</a>
      <br />
      {/* Button to launch the modal */}
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      {/* Modal displaying video and scan result */}
      <Modal
        className="custom-modal" // Add a custom class for styling
        show={show}
        onHide={handleClose}
        onShow={handleShow}
      >
        <Modal.Header closeButton>
          <Modal.Title>QR Code Scanner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              {/* Video element to display camera feed */}
              <video ref={videoRef} style={{ width: "100%" }} autoPlay playsInline />
            </Col>
            <Col md={6}>
              {/* Display all scanned MSSVs */}
              {mssvList.length > 0 ? (
                <div>
                  <h5>Scanned Information:</h5>
                  {mssvList.map((mssv, index) => (
                    <p key={index}>MSSV {index + 1}: {mssv}</p>
                  ))}
                  {/* Add more information as needed */}
                </div>
              ) : (
                <p>Scan QR code to see information</p>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {/* Button to close the modal */}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* Button to save changes (example) */}
          <Button variant="primary" onClick={handleClose}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tesst;
