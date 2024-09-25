import React from "react";
import { Route, Routes } from "react-router-dom";
import { Admin, HomeAdmin, CreateSubject } from "./pages/private";
import path from "./ultils/path";
import "./components/admin/er/css/index.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/admin/er/vendor/datatables/dataTables.bootstrap4.min.css";
import "./components/admin/er/vendor/datatables/jquery.dataTables.min.js";
import "./components/admin/er/js/datatables-demo.js"
function AppAdmin() {
  return (
    <div id="page-top">
      <Routes>
        <Route path={path.ADMIN} element={<Admin />}>
          <Route path={path.HOMEADMIN} element={<HomeAdmin />} />
          <Route path={path.SUBJECT} element={<CreateSubject />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppAdmin;
