import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.slice(1));

  return (
    <nav className="nav-bar">
      <div
        onClick={() => {
          setActiveTab("texas-holdem");
          navigate("/texas-holdem");
        }}
        className={`nav-link ${
          activeTab === "texas-holdem" ? "active-link" : ""
        }`}
      >
        Texas Hold'em
      </div>
      <div
        onClick={() => {
          setActiveTab("omaha");
          navigate("/omaha");
        }}
        className={`nav-link ${activeTab === "omaha" ? "active-link" : ""}`}
      >
        Omaha
      </div>
      <div
        onClick={() => {
          setActiveTab("five-card-omaha");
          navigate("/five-card-omaha");
        }}
        className={`nav-link ${
          activeTab === "five-card-omaha" ? "active-link" : ""
        }`}
      >
        Five Card Omaha
      </div>
    </nav>
  );
}

export default NavBar;
