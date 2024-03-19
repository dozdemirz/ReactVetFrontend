import React from "react";
import "./homepage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="welcome-title">Welcome to PetWell Clinic</h1>
        <p className="description">
          Providing compassionate care and comprehensive services for your furry
          family members.
        </p>
      </div>
      <div className="image-container">
        <img src="./vet.png" alt="Clinic" className="clinic-image" />
      </div>
    </div>
  );
};

export default HomePage;
