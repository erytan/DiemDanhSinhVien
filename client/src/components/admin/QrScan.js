import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { apiUpdateCountUser } from "../../apis/session";

const ScannerQr = ({ selectedSubject }) => {
  const [scannedData, setScannedData] = useState([]);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    qrScannerRef.current = new QrScanner(
      videoRef.current,
      (result) => handleScan(result),
      {
        onDecodeError: (error) => handleError(error),
      }
    );

    qrScannerRef.current.start();

    return () => {
      qrScannerRef.current.stop();
    };
  }, []);

  const handleScan = async (result) => {
    const parts = result.data.split("-");
    if (parts.length > 0) {
      const mssv = parts[0];
  
      // Tìm user dựa trên MSSV
      const user = selectedSubject.user.find((user) => user.MSSV === mssv);
  
      if (user) {
        // Kiểm tra xem QR đã được quét chưa
        if (user.checkScanQR) {
          alert("Mã QR đã được quét trước đó");
          return;
        }
        setScannedData((prevData) => [
          ...prevData,
          {
            mssv: user.MSSV,
            fullName: `${user.firstName} ${user.lastName}`,
            data: result.data,
          },
        ]);
        user.attendanceCount += 1; // Cập nhật số lần điểm danh
        user.checkScanQR = true; // Đặt checkScanQR thành true
        alert(
          `Quét thành công!\nMSSV: ${user.MSSV}\nTên: ${user.firstName} ${user.lastName}`
        );
  
        try {
          // Gọi API để cập nhật số lần điểm danh và checkScanQR
          await apiUpdateCountUser(
            selectedSubject.id_session,
            user.MSSV,
            user.attendanceCount,
            user.checkScanQR // Gửi checkScanQR lên server
          );
        } catch (error) {
          alert("Không thể cập nhật số lần điểm danh");
        }
      } else {
        alert("Không tìm thấy thông tin sinh viên này");
      }
    }
  };
  

  const resetCheckScanQR = () => {
    selectedSubject.user.forEach(async (user) => {
      user.checkScanQR = false; // Đặt lại checkScanQR về false
      await apiUpdateCountUser(
        selectedSubject.id_session,
        user.MSSV,
        user.attendanceCount,
        user.checkScanQR
      );
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Nếu đến nửa đêm, reset checkScanQR cho tất cả user
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetCheckScanQR();
      }
    }, 60000); // kiểm tra mỗi phút

    return () => clearInterval(interval);
  }, [selectedSubject]);

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        padding: "20px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2>Scanner QR</h2>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "auto",
            border: "1px solid black",
            borderRadius: "8px",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          marginLeft: "20px",
          padding: "20px",
          border: "1px solid black",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h3>Thông tin đã quét</h3>
        {scannedData.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>MSSV</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Tên Sinh Viên</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Dữ Liệu</th>
              </tr>
            </thead>
            <tbody>
              {scannedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.mssv}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.fullName}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ScannerQr;
