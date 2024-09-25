import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const Qrcode = () => {
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const data = 'Hello, this is a QR code'; // Dữ liệu để mã hóa trong mã QR
        const qrCodeURL = await QRCode.toDataURL(data);
        setQrCodeData(qrCodeURL);
      } catch (error) {
        console.error('Failed to generate QR code', error);
      }
    };

    generateQRCode();
  }, []);

  return (
    <div>
      <h2>QR Code</h2>
      {qrCodeData ? <img src={qrCodeData} alt="QR Code" /> : <p>Loading...</p>}
    </div>
  );
};

export default Qrcode;
