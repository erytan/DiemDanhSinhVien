import React from "react";
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet"; // Import Helmet từ react-helmet
import { Login, Home, Public } from "./pages/public";
import { Admin } from "./pages/private";
import path from "./ultils/path";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
        </Route>
        <Route path={path.ADMIN} element={<Admin />}>
        
        </Route>
      </Routes>
    </div>
  );
}

export default App;
