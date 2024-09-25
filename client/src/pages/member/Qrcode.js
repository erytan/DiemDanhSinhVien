import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import { getCurrent } from "../../store/user/asyncAction";

const Qrcode = () => {
  const [qrCodeData, setQrCodeData] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.current); // Giả sử state.user.current chứa thông tin người dùng hiện tại

  useEffect(() => {
    // Dispatch action để lấy thông tin người dùng hiện tại
    dispatch(getCurrent());
  }, [dispatch]);

  useEffect(() => {
    const generateQRCode = async () => {
      if (currentUser) {
        try {
          const data = `${currentUser.mssv}-${currentUser.firstname} ${currentUser.lastname}`; // Dữ liệu để mã hóa trong mã QR
          const qrCodeURL = await QRCode.toDataURL(data);
          setQrCodeData(qrCodeURL);
        } catch (error) {
          console.error("Failed to generate QR code", error);
        }
      }
    };

    generateQRCode();
  }, [currentUser]);

  return (
    <div>
      <h2>QR Code</h2>
      {qrCodeData ? <img src={qrCodeData} alt="QR Code" /> : <p>Loading...</p>}
    </div>
  );
};

export default Qrcode;
