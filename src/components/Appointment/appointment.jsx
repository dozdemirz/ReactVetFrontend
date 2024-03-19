import React, { useState, useEffect } from "react";
import "./appointment.css";
import {
  createAppointment,
  deleteAppointment,
  updateAppointmentFunction,
  getAppointments,
} from "../../API/appointment";
import { getDoctors, getAvailableDatesByDoctorId } from "../../API/doctor";
import { getAnimals } from "../../API/animal";
import Modal from "../Modal";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [reload, setReload] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointmentEditModalOpen, setIsAppointmentEditModalOpen] =
    useState(false);
  const [isAppointmentAddModalOpen, setIsAppointmentAddModalOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: "",
    animal: {
      animalId: "",
    },
    doctor: {
      doctorId: "",
    },
  });

  const [updateAppointment, setUpdateAppointment] = useState({
    appointmentDate: "",
    animal: {
      animalId: "",
    },
    doctor: {
      doctorId: "",
    },
  });

  useEffect(() => {
    Promise.all([getAppointments(), getAnimals(), getDoctors()])
      .then(([appointmentsData, animalsData, doctorsData]) => {
        setAppointments(appointmentsData);
        setAnimals(animalsData);
        setDoctors(doctorsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setReload(false);
  }, [reload]);

  const handleDelete = (id) => {
    deleteAppointment(id).then(() => {
      setReload(true);
    });
  };

  const handleNewAppointment = (event) => {
    const { name, value } = event.target;
    if (name === "doctorId") {
      setNewAppointment((prevAppointment) => ({
        ...prevAppointment,
        doctor: {
          doctorId: value,
        },
      }));
      const doctorId = value;
      getAvailableDatesByDoctorId(doctorId).then((dates) => {
        setAvailableDates(dates);
      });
    } else if (name === "animalId") {
      setNewAppointment((prevAppointment) => ({
        ...prevAppointment,
        animal: {
          animalId: value,
        },
      }));
    } else {
      setNewAppointment((prevAppointment) => ({
        ...prevAppointment,
        [name]: value,
      }));
    }
  };

  const handleCreate = () => {
    createAppointment(newAppointment)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });

    setNewAppointment({
      appointmentDate: "",
      animal: {
        animalId: "",
      },
      doctor: {
        doctorId: "",
      },
    });
    setIsAppointmentAddModalOpen(false);
  };

  const handleCloseError = () => {
    setError(null);
    setShowModal(false);
  };

  const filterAppointments = (appointment) => {
    const startDateMatch =
      !searchStartDate ||
      new Date(appointment.appointmentDate) >= new Date(searchStartDate);
    const endDateMatch =
      !searchEndDate ||
      new Date(appointment.appointmentDate) <= new Date(searchEndDate);
    const termMatch =
      !searchTerm ||
      appointment.animal.animalName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctor.doctorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return startDateMatch && endDateMatch && termMatch;
  };

  const filteredAppointments = appointments.filter(filterAppointments);

  const handleUpdateBtn = (appointment) => {
    setUpdateAppointment({
      appointmentId: appointment.appointmentId,
      appointmentDate: appointment.appointmentDate,
      animal: {
        animalId: appointment.animal.animalId,
      },
      doctor: {
        doctorId: appointment.doctor.doctorId,
      },
    });
    setIsAppointmentEditModalOpen(true);
  };
  const handleUpdateChange = (event) => {
    setUpdateAppointment({
      ...updateAppointment,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateAppointmentFunction(updateAppointment)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateAppointment({
      appointmentDate: "",
      animal: {
        animalId: "",
      },
      doctor: {
        doctorId: "",
      },
    });
    setIsAppointmentEditModalOpen(false);
  };

  const handleUpdateAnimalChange = (event) => {
    setUpdateAppointment({
      ...updateAppointment,
      animal: {
        animalId: event.target.value,
      },
    });
  };
  const handleUpdateDoctorChange = (event) => {
    setUpdateAppointment({
      ...updateAppointment,
      doctor: {
        doctorId: event.target.value,
      },
    });
  };

  const handleAddBtn = (event) => {
    setIsAppointmentAddModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="appointment-management">
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
      <h2>Appointment Management</h2>
      <div className="appointment-grid">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by animal or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label htmlFor="startDate">Start Date:</label>
          <input
            id="startDate"
            type="date"
            value={searchStartDate}
            onChange={(e) => setSearchStartDate(e.target.value)}
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            id="endDate"
            type="date"
            value={searchEndDate}
            onChange={(e) => setSearchEndDate(e.target.value)}
          />
        </div>
        <div className="appointment-add">
          <button className="update-button" onClick={handleAddBtn}>
            Add Appointment
          </button>
        </div>
      </div>

      <div className="appointmentList overflow">
        <h3>Appointment List</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Pet</th>
              <th>Doctor</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.animal.animalName}</td>
                <td>{appointment.doctor.doctorName}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(appointment.appointmentId)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleUpdateBtn(appointment)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAppointmentEditModalOpen && (
        <Modal handleCloseModal={() => setIsAppointmentEditModalOpen(false)}>
          <div className="update-appointment">
            <h3>Update Appointment</h3>
            <label htmlFor="date">Date:</label>
            <input
              type="datetime-local"
              id="date"
              name="appointmentDate"
              value={updateAppointment.appointmentDate}
              onChange={handleUpdateChange}
              required
            />
            <label htmlFor="doctor">Doctor:</label>
            <select
              name="doctorId"
              value={updateAppointment.doctor.doctorId}
              onChange={handleUpdateDoctorChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.doctorName}
                </option>
              ))}
            </select>

            <label htmlFor="pet">Pet:</label>
            <select
              name="animalId"
              value={updateAppointment.animal.animalId}
              onChange={handleUpdateAnimalChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {animals.map((animal) => (
                <option key={animal.animalId} value={animal.animalId}>
                  {animal.animalName}
                </option>
              ))}
            </select>

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

      <div>
        <h3>Doctor's Available Dates</h3>
        <ul>
          {availableDates !== null &&
            availableDates.map((date, index) => (
              <li key={index}>{date.availableDate} </li>
            ))}
        </ul>
      </div>

      {isAppointmentAddModalOpen && (
        <Modal handleCloseModal={() => setIsAppointmentAddModalOpen(false)}>
          <div className="appointmentAdd">
            <h3>Add Appointment</h3>
            <label htmlFor="date">Date:</label>
            <input
              type="datetime-local"
              id="date"
              name="appointmentDate"
              value={newAppointment.appointmentDate}
              onChange={handleNewAppointment}
              required
            />
            <label htmlFor="doctor">Doctor:</label>
            <select
              name="doctorId"
              value={newAppointment.doctor.doctorId}
              onChange={handleNewAppointment}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.doctorName}
                </option>
              ))}
            </select>

            <label htmlFor="pet">Pet:</label>
            <select
              name="animalId"
              value={newAppointment.animal.animalId}
              onChange={handleNewAppointment}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {animals.map((animal) => (
                <option key={animal.animalId} value={animal.animalId}>
                  {animal.animalName}
                </option>
              ))}
            </select>

            <button onClick={handleCreate} type="submit">
              Add
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AppointmentManagement;
