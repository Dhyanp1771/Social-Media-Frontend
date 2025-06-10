import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import ActivateAccount from "../pages/ActivateAccount";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Logout from "../pages/Logout";
import ProfilePage from "../pages/ProfilePage";
import Search from "../pages/Search";
import Sidebar from "../pages/SideBar";

function App() {
  return (
    <Router>
      <Sidebar/>
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/activate" element={<ActivateAccount />} />
          <Route path="*" element={<Login />} /> {/* Default route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/find-friends" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
