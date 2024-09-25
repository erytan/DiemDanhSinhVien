import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Home, Public } from "./pages/public";
import { User, Qrcode, ScannerQr, ResetPassword } from "./pages/member";
import path from "./ultils/path";
import "./css/index.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div>
      <Routes>
        {/* public */}
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        {/* user */}
        <Route path={path.USER} element={<User />}>
          <Route path={path.QRCODE} element={<Qrcode />} />
          <Route path={path.SCANERQR} element={<ScannerQr />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
