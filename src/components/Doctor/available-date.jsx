import React, { useState, useEffect } from "react";
import {
  createAvailableDate,
  deleteAvailableDate,
  getAvailableDatesByDoctorId,
} from "../../API/available-date";
import { getDoctors } from "../../API/doctor";
import Modal from "../Modal";
import "./doctor.css";

function AvailableDate() {
  const [doctor, setDoctor] = useState([]);
  const [reload, setReload] = useState(true);
  const [error, setError] = useState(null); // setError durumunu tanımlayın
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  useEffect(() => {
    getDoctors().then((data) => {
      setDoctor(data);
    });
    console.log(doctor);
    setReload(false);
  }, [reload]);

  const [newAvailableDate, setNewAvailableDate] = useState({
    availableDate: "",
    doctor: {
      doctorId: "",
    },
  });

  const handleNewAvailableDate = (event) => {
    const { name, value } = event.target;
    if (name === "doctorId") {
      setNewAvailableDate((prevAvailableDate) => ({
        ...prevAvailableDate,
        doctor: {
          doctorId: value,
        },
      }));
    } else {
      setNewAvailableDate((prevAvailableDate) => ({
        ...prevAvailableDate,
        [name]: value,
      }));
    }
  };

  const handleCreateAvailableDate = () => {
    createAvailableDate(newAvailableDate)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // createAvailableDate başarısız olursa hata ayarlayın
        setShowModal(true); // Varsayılan olarak setShowModal olduğunu varsayarak
      });
    setNewAvailableDate({
      availableDate: "",
      doctor: {
        doctorId: "",
      },
    });
  };

  return (
    <div className="available-date-add-container">
      {showModal && (
        <Modal handleCloseModal={handleCloseError}>
          <p>{error.message}</p>
        </Modal>
      )}
      <h1>Add Available Dates</h1>
      <div className="available-date-new-available-date">
        <input
          type="date"
          placeholder="availableDate"
          name="availableDate" // input'un name özelliğini belirtin
          value={newAvailableDate.availableDate}
          onChange={handleNewAvailableDate} // onChange olayını handleNewAvailableDate fonksiyonuyla bağlayın
        />

        <select
          name="doctorId"
          value={newAvailableDate.doctor.id}
          onChange={handleNewAvailableDate}
        >
          <option value="" disabled>
            Doctor
          </option>
          {doctor.map((doctor) => (
            <option key={doctor.doctorId} value={doctor.doctorId}>
              {doctor.doctorName}
            </option>
          ))}
        </select>

        <button
          className="doctor-add-button"
          onClick={handleCreateAvailableDate}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default AvailableDate;
