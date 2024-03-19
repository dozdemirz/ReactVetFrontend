// App.jsx

import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // BrowserRouter ve Router'a gerek yok

import AnimalManagement from "./components/Animal/animal";
import VaccineManagement from "./components/Vaccine/vaccine";
import DoctorManagement from "./components/Doctor/doctor";
import CustomerManagement from "./components/Customer/customer";
import AppointmentManagement from "./components/Appointment/appointment";
import ReportManagement from "./components/Report/report";
import HomePage from "./components/HomePage/homepage";
import Header from "./components/Header/header";

const App = () => {
  const [menu, setMenu] = useState("aşı");

  const handleMenuChange = (selectedMenu) => {
    setMenu(selectedMenu);
  };
  const menuItems = document.querySelectorAll(".header .menuItem");

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    });
  });

  return (
    <div className="app">
      <Header onMenuChange={handleMenuChange} />
      <main className="mainContent">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/vaccine" element={<VaccineManagement />} />
          <Route path="/report" element={<ReportManagement />} />
          <Route path="/appointment" element={<AppointmentManagement />} />
          <Route path="/customer" element={<CustomerManagement />} />
          <Route path="/doctor" element={<DoctorManagement />} />
          <Route path="/animal" element={<AnimalManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
