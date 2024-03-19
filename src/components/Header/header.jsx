import React, { useState, useEffect } from "react";
import "../../App.css";
import { Link } from "react-router-dom";

const Header = ({ onMenuChange }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleMenuChange = (selectedMenu) => {
    console.log("Selected menu:", selectedMenu);
    onMenuChange(selectedMenu);
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`header ${scrolled ? "scrolled" : ""}`}>
      <Link to="/homepage" className="logo-link">
        <img className="logo" src="../../assets/vet.png" alt="Homepage" />
      </Link>
      <div className="menu">
        <Link
          to="/vaccine"
          className={"menuItem"}
          onClick={() => handleMenuChange("vaccine")}
        >
          Vaccine
        </Link>
        <Link
          to="/report"
          className={"menuItem"}
          onClick={() => handleMenuChange("report")}
        >
          Report
        </Link>
        <Link
          to="/appointment"
          className={"menuItem"}
          onClick={() => handleMenuChange("appointment")}
        >
          Appointment
        </Link>
      </div>
      <div className="popupToggle" onClick={togglePopup}>
        +
      </div>
      {popupVisible && (
        <div className="popup">
          <Link
            to="/customer"
            className="popupItem"
            onClick={() => handleMenuChange("customer")}
          >
            Customer
          </Link>
          <Link
            to="/animal"
            className="popupItem"
            onClick={() => handleMenuChange("animal")}
          >
            Animal
          </Link>
          <Link
            to="/doctor"
            className="popupItem"
            onClick={() => handleMenuChange("doctor")}
          >
            Doctor
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
