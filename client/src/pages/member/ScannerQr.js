import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import QrScanner from 'qr-scanner';

const ScannerQr = () => {
  const [mssv, setMssv] = useState('');
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    qrScannerRef.current = new QrScanner(
      videoRef.current,
      result => handleScan(result),
      {
        onDecodeError: error => handleError(error),
      }
    );

    qrScannerRef.current.start();

    return () => {
      qrScannerRef.current.stop();
    };
  }, []);

  const handleScan = (result) => {
    if (result) {
      const parts = result.data.split('-');
      if (parts.length > 0) {
        setMssv(parts[0]);
      }
    }
  };

  const handleError = (error) => {
    console.error('QR Scan Error:', error);
  };

  return (
    <div>
      <h2>Scanner QR</h2>
      <video ref={videoRef} style={{ width: '100%' }} />
      {mssv && <p>MSSV: {mssv}</p>}
    </div>
  );
};

export default ScannerQr;
