import React, { useState, useEffect } from "react";
import "./doctor.css";
import {
  getDoctors,
  deleteDoctor,
  createDoctor,
  updateDoctorFunction,
} from "../../API/doctor";
import {
  updateAvailableDateFunction,
  deleteAvailableDate,
  getAvailableDatesByDoctorId,
  createAvailableDate,
} from "../../API/available-date";
import Modal from "../Modal";
import AvailableDate from "./available-date";

const DoctorManagement = () => {
  const [doctor, setDoctor] = useState([]);
  const [reload, setReload] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvailableDateEditModalOpen, setIsAvailableDateEditModalOpen] =
    useState(false);
  const [isDoctorEditModalOpen, setIsDoctorEditModalOpen] = useState(false);
  const [isDoctorAddModalOpen, setIsDoctorAddModalOpen] = useState(false);
  const [selectedDoctorAvailableDates, setSelectedDoctorAvailableDates] =
    useState([]);
  const [newDoctor, setNewDoctor] = useState({
    doctorName: "",
    doctorMail: "",
    doctorAddress: "",
    doctorCity: "",
    doctorPhone: "",
  });
  const [error, setError] = useState(null); // Hata durumu
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal popup gösterme durumu

  useEffect(() => {
    getDoctors().then((data) => {
      setDoctor(data);
    });
    fetchDoctors();
    console.log(doctor);
    setReload(false);
  }, [reload]);

  useEffect(() => {
    const results = doctor.filter((item) => {
      return (
        item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctorMail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctorAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctorCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctorPhone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setSearchResults(results);
  }, [searchTerm, doctor]);

  const handleDelete = (id) => {
    console.log(id);
    deleteDoctor(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
  };

  const handleNewDoctor = (event) => {
    setNewDoctor({
      ...newDoctor,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.id);
  };

  const handleCreate = () => {
    createDoctor(newDoctor)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setNewDoctor({
      doctorName: "",
      doctorMail: "",
      doctorAddress: "",
      doctorCity: "",
      doctorPhone: "",
    });
    setIsDoctorAddModalOpen(false);
  };

  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  const fetchDoctors = async () => {
    try {
      const doctorsData = await getDoctors();
      setDoctor(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctorId(doctorId);
    fetchAvailableDatesForSelectedDoctor(doctorId);
  };
  const fetchAvailableDatesForSelectedDoctor = async (doctorId) => {
    try {
      const availableDates = await getAvailableDatesByDoctorId(doctorId);
      setSelectedDoctorAvailableDates(availableDates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  const [newAvailableDate, setNewAvailableDate] = useState({
    availableDate: "",
    doctor: {
      doctorId: "",
    },
  });
  const [updateAvailableDate, setUpdateAvailableDate] = useState({
    availableDate: "",
    doctor: {
      doctorId: "",
    },
  });

  const handleCreateAvailableDate = () => {
    createAvailableDate(newAvailableDate)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setNewAvailableDate({
      availableDate: "",
      doctor: {
        doctorId: "",
      },
    });
  };

  const handleDeleteAvailableDate = (id) => {
    deleteAvailableDate(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };

  const handleNewAvailableDate = (event) => {
    setNewAvailableDate({
      ...newAvailableDate,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateBtn = (doctor) => {
    setUpdateDoctor({
      doctorId: doctor.doctorId,
      doctorName: doctor.doctorName,
      doctorMail: doctor.doctorMail,
      doctorAddress: doctor.doctorAddress,
      doctorCity: doctor.doctorCity,
      doctorPhone: doctor.doctorPhone,
    });
    setIsDoctorEditModalOpen(true);
  };

  const handleUpdateChange = (event) => {
    setUpdateDoctor({
      ...updateDoctor,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateDoctorFunction(updateDoctor)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateDoctor({
      doctorName: "",
      doctorMail: "",
      doctorAddress: "",
      doctorCity: "",
      doctorPhone: "",
    });
    setIsDoctorEditModalOpen(false);
  };
  const [updateDoctor, setUpdateDoctor] = useState({
    doctorName: "",
    doctorMail: "",
    doctorAddress: "",
    doctorCity: "",
    doctorPhone: "",
  });

  const handleAvailableDateUpdateBtn = (availableDate) => {
    setUpdateAvailableDate({
      availableDateId: availableDate.availableDateId,
      availableDate: availableDate.availableDate,
      doctor: {
        doctorId: availableDate.doctor.doctorId,
      },
    });
    setIsAvailableDateEditModalOpen(true);
  };

  const handleUpdateAvailableDate = () => {
    updateAvailableDateFunction(updateAvailableDate)
      .then(() => {
        setReload(true);
        handleDoctorSelect(selectedDoctorId);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateAvailableDate({
      availableDate: "",
      doctor: {
        doctorId: "",
      },
    });
    setIsAvailableDateEditModalOpen(false);
  };

  const handleUpdateAvailableDateDoctorChange = (event) => {
    setUpdateAvailableDate({
      ...updateAvailableDate,
      doctor: {
        doctorId: event.target.value,
      },
    });
  };

  const handleUpdateAvailableDateChange = (event) => {
    setUpdateAvailableDate({
      ...updateAvailableDate,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddBtn = (event) => {
    setIsDoctorAddModalOpen(true);
  };

  return (
    <div className="doctorManagement">
      {showModal && ( // Modal popup gösterme durumu
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseError}>
              &times;
            </span>
            <p>{error}</p>
          </div>
        </div>
      )}
      {isModalOpen && (
        <Modal handleCloseModal={handleCloseModal}>
          <AvailableDate />
        </Modal>
      )}
      <h2>Doctor Management</h2>
      <div className="doctor-grid">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="doctor-add">
          <button
            className="update-button add-button"
            onClick={handleOpenModal}
          >
            Add Date
          </button>
        </div>
        <div className="doctor-add">
          <button className="update-button add-button" onClick={handleAddBtn}>
            Add Doctor
          </button>
        </div>
      </div>

      <div className="doctorList overflow">
        <h3>Doctor List</h3>
        {searchResults.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>City</th>
                <th>Phone</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.doctorMail}</td>
                  <td>{doctor.doctorAddress}</td>
                  <td>{doctor.doctorCity}</td>
                  <td>{doctor.doctorPhone}</td>
                  <td>
                    <button
                      className="show-dates-button"
                      onClick={() => handleDoctorSelect(doctor.doctorId)}
                    >
                      Show Dates
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(doctor.doctorId)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleUpdateBtn(doctor)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found.</p>
        )}
      </div>

      <table className="available-date-list-table list-table">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Doctor's Available Days</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {selectedDoctorAvailableDates.map((date, index) => (
            <tr key={index}>
              <td>{date.doctor.doctorName}</td>
              <td>{date.availableDate}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() =>
                    handleDeleteAvailableDate(date.availableDateId)
                  }
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  id="update-date-div"
                  className="update-button"
                  onClick={() => handleAvailableDateUpdateBtn(date)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="update">
        {isDoctorEditModalOpen && (
          <Modal handleCloseModal={() => setIsDoctorEditModalOpen(false)}>
            <div className="update-doctor">
              <h3>Update Doctor</h3>

              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={updateDoctor.doctorName}
                onChange={handleUpdateChange}
                required
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="doctorMail"
                name="doctorMail"
                value={updateDoctor.doctorMail}
                onChange={handleUpdateChange}
                required
              />

              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="doctorAddress"
                name="doctorAddress"
                value={updateDoctor.doctorAddress}
                onChange={handleUpdateChange}
                required
              />

              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="doctorCity"
                name="doctorCity"
                value={updateDoctor.doctorCity}
                onChange={handleUpdateChange}
                required
              />

              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="doctorPhone"
                name="doctorPhone"
                value={updateDoctor.doctorPhone}
                onChange={handleUpdateChange}
                required
              />

              <button
                className="update-button"
                onClick={handleUpdate}
                type="submit"
              >
                Update
              </button>
            </div>
          </Modal>
        )}

        {isAvailableDateEditModalOpen && (
          <Modal
            handleCloseModal={() => setIsAvailableDateEditModalOpen(false)}
          >
            <div className="update-date">
              <h3>Update Available Date</h3>
              <input
                type="date"
                placeholder="availableDate"
                name="availableDate"
                value={updateAvailableDate.availableDate}
                onChange={handleUpdateAvailableDateChange}
              />

              <select
                name="doctorId"
                value={updateAvailableDate.doctor.doctorId}
                onChange={handleUpdateAvailableDateDoctorChange}
              >
                {doctor.map((doctor) => (
                  <option
                    key={doctor.doctorId}
                    value={doctor.doctorId}
                    disabled
                  >
                    {doctor.doctorName}
                  </option>
                ))}
              </select>

              <button
                className="update-button"
                onClick={handleUpdateAvailableDate}
              >
                Update
              </button>
            </div>
          </Modal>
        )}
      </div>
      {isDoctorAddModalOpen && (
        <Modal handleCloseModal={() => setIsDoctorAddModalOpen(false)}>
          <div className="doctorAdd">
            <h3>Add Doctor</h3>

            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              value={newDoctor.doctorName}
              onChange={handleNewDoctor}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="doctorMail"
              name="doctorMail"
              value={newDoctor.doctorMail}
              onChange={handleNewDoctor}
              required
            />

            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="doctorAddress"
              name="doctorAddress"
              value={newDoctor.doctorAddress}
              onChange={handleNewDoctor}
              required
            />

            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="doctorCity"
              name="doctorCity"
              value={newDoctor.doctorCity}
              onChange={handleNewDoctor}
              required
            />

            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="doctorPhone"
              name="doctorPhone"
              value={newDoctor.doctorPhone}
              onChange={handleNewDoctor}
              required
            />

            <button onClick={handleCreate} type="submit">
              Add
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorManagement;
