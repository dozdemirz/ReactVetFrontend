import React, { useState, useEffect } from "react";
import "./vaccine.css";
import {
  deleteVaccine,
  getVaccine,
  createVaccine,
  updateVaccineFunction,
  getVaccineAfterDate,
  getVaccineBeforeDate,
  getVaccineBetweenTwoDates,
  getVaccineByAnimal,
} from "../../API/vaccine";
import { getAnimals, deleteAnimal, createAnimal } from "../../API/animal";
import { getReports } from "../../API/report";
import Modal from "../Modal";

const VaccineManagement = () => {
  const [vaccine, setVaccine] = useState([]);
  const [reload, setReload] = useState(true);
  const [animal, setAnimal] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVaccineEditModalOpen, setIsVaccineEditModalOpen] = useState(false);
  const [isVaccineAddModalOpen, setIsVaccineAddModalOpen] = useState(false);
  const [report, setReport] = useState([]);
  const [results, setResults] = useState([]);
  const [animalSearchTerm, setAnimalSearchTerm] = useState("");
  const [startSearchTerm, setStartSearchTerm] = useState("");
  const [endSearchTerm, setEndSearchTerm] = useState("");
  const [newVaccine, setNewVaccine] = useState({
    vaccineName: "",
    vaccineCode: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animal: {
      animalId: "",
    },
    report: {
      reportId: "",
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  const [updateVaccine, setUpdateVaccine] = useState({
    vaccineName: "",
    vaccineCode: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animal: {
      animalId: "",
    },
    report: {
      reportId: "",
    },
  });

  useEffect(() => {
    Promise.all([getVaccine(), getAnimals(), getReports()])
      .then(([vaccinesData, animalsData, reportsData]) => {
        setResults(vaccinesData);
        setAnimal(animalsData);
        setReport(reportsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setReload(false);
  }, [reload]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let results = [];
        if (animalSearchTerm.trim() !== "") {
          const byAnimal = await getVaccineByAnimal(animalSearchTerm);
          results = [...results, ...byAnimal];
        }
        if (startSearchTerm.trim() !== "" && endSearchTerm.trim() !== "") {
          const betweenTwoDates = await getVaccineBetweenTwoDates(
            startSearchTerm,
            endSearchTerm
          );
          results = betweenTwoDates;
        } else if (startSearchTerm.trim() !== "") {
          const startDates = await getVaccineAfterDate(startSearchTerm);
          results = startDates;
        } else if (endSearchTerm.trim() !== "") {
          const endDates = await getVaccineBeforeDate(endSearchTerm);
          results = endDates;
        } else if (
          animalSearchTerm.trim() === "" &&
          startSearchTerm.trim() === "" &&
          endSearchTerm.trim() === ""
        ) {
          results = await getVaccine();
          setResults(results);
        }
        setResults(results);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    };
    fetchResults();
  }, [animalSearchTerm, startSearchTerm, endSearchTerm]);

  const handleDelete = (id) => {
    deleteVaccine(id).then(() => {
      setReload(true);
    });
  };

  const handleNewVaccine = (event) => {
    const { name, value } = event.target;
    if (name === "animalId") {
      setNewVaccine((prevVaccine) => ({
        ...prevVaccine,
        animal: {
          animalId: value,
        },
      }));
    } else if (name === "reportId") {
      setNewVaccine((prevVaccine) => ({
        ...prevVaccine,
        report: {
          reportId: value,
        },
      }));
    } else {
      setNewVaccine((prevVaccine) => ({
        ...prevVaccine,
        [name]: value,
      }));
    }
    console.log(newVaccine.animal.animalId);
  };

  const handleCreate = () => {
    createVaccine(newVaccine)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setNewVaccine({
      vaccineName: "",
      vaccineCode: "",
      protectionStartDate: "",
      protectionFinishDate: "",
      animal: {
        animalId: "",
      },
      report: {
        reportId: "",
      },
    });
    setIsVaccineAddModalOpen(false);
  };

  const handleCloseError = () => {
    setError(null);
    setShowModal(false);
  };

  const handleUpdateBtn = (vaccine) => {
    setUpdateVaccine({
      vaccineId: vaccine.vaccineId,
      vaccineName: vaccine.vaccineName,
      vaccineCode: vaccine.vaccineCode,
      protectionStartDate: vaccine.protectionStartDate,
      protectionFinishDate: vaccine.protectionFinishDate,
      animal: {
        animalId: vaccine.animal.animalId,
      },
      report: {
        reportId: vaccine.report.reportId,
      },
    });
    setIsVaccineEditModalOpen(true);
  };
  const handleUpdateAnimalChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      animal: {
        animalId: event.target.value,
      },
    });
  };
  const handleUpdateReportChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      report: {
        reportId: event.target.value,
      },
    });
  };

  const handleUpdateChange = (event) => {
    setUpdateVaccine({
      ...updateVaccine,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateVaccineFunction(updateVaccine)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateVaccine({
      vaccineName: "",
      vaccineCode: "",
      protectionStartDate: "",
      protectionFinishDate: "",
      animal: {
        animalId: "",
      },
      report: {
        reportId: "",
      },
    });
    setIsVaccineEditModalOpen(false);
  };

  const handleAddBtn = (event) => {
    setIsVaccineAddModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="vaccine-manage">
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
      <h2>Vaccine Management</h2>
      <div className="vaccine-grid">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by animal..."
            value={animalSearchTerm}
            onChange={(e) => setAnimalSearchTerm(e.target.value)}
          />
          <input
            type="date"
            placeholder="Start Date"
            value={startSearchTerm}
            onChange={(e) => setStartSearchTerm(e.target.value)}
          />
          <input
            type="date"
            placeholder="End Date"
            value={endSearchTerm}
            onChange={(e) => setEndSearchTerm(e.target.value)}
          />
        </div>
        <div className="vaccine-add">
          <button className="update-button add-button" onClick={handleAddBtn}>
            Add Vaccine
          </button>
        </div>
      </div>

      <div className="vaccineList overflow">
        <h3>Vaccine List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Animal</th>
              <th>Report</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((vaccine) => (
              <tr key={vaccine.vaccineId}>
                <td>{vaccine.vaccineName}</td>
                <td>{vaccine.vaccineCode}</td>
                <td>{vaccine.protectionStartDate}</td>
                <td>{vaccine.protectionFinishDate}</td>
                <td>{vaccine.animal.animalName}</td>
                <td>{vaccine.report.reportTitle}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(vaccine.vaccineId)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleUpdateBtn(vaccine)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isVaccineEditModalOpen && (
        <Modal handleCloseModal={() => setIsVaccineEditModalOpen(false)}>
          <div className="update-vaccine">
            <h3>Update Vaccine</h3>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="vaccineName"
              value={updateVaccine.vaccineName}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              name="vaccineCode"
              value={updateVaccine.vaccineCode}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="protectionStartDate"
              value={updateVaccine.protectionStartDate}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="protectionFinishDate"
              value={updateVaccine.protectionFinishDate}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="pet">Pet:</label>
            <select
              id="animalId"
              name="animalId"
              value={updateVaccine.animal.animalId}
              onChange={handleUpdateAnimalChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {animal.map((animal) => (
                <option key={animal.animalId} value={animal.animalId}>
                  {animal.animalName}
                </option>
              ))}
            </select>

            <label htmlFor="report">Report:</label>
            <select
              id="reportId"
              name="reportId"
              value={updateVaccine.report.reportId}
              onChange={handleUpdateReportChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {report.map((report) => (
                <option key={report.reportId} value={report.reportId}>
                  {report.reportTitle}
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

      {isVaccineAddModalOpen && (
        <Modal handleCloseModal={() => setIsVaccineAddModalOpen(false)}>
          <div className="vaccineAdd">
            <h3>Add New Vaccine</h3>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="vaccineName"
              value={newVaccine.vaccineName}
              onChange={handleNewVaccine}
              required
            />

            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              name="vaccineCode"
              value={newVaccine.vaccineCode}
              onChange={handleNewVaccine}
              required
            />

            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="protectionStartDate"
              value={newVaccine.protectionStartDate}
              onChange={handleNewVaccine}
              required
            />

            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="protectionFinishDate"
              value={newVaccine.protectionFinishDate}
              onChange={handleNewVaccine}
              required
            />

            <label htmlFor="pet">Pet:</label>
            <select
              id="animalId"
              name="animalId"
              value={newVaccine.animal.animalId}
              onChange={handleNewVaccine}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {animal.map((animal) => (
                <option key={animal.animalId} value={animal.animalId}>
                  {animal.animalName}
                </option>
              ))}
            </select>

            <label htmlFor="report">Report:</label>
            <select
              id="reportId"
              name="reportId"
              value={newVaccine.report.reportId}
              onChange={handleNewVaccine}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {report.map((report) => (
                <option key={report.reportId} value={report.reportId}>
                  {report.reportTitle}
                </option>
              ))}
            </select>
            <button className="add-button" onClick={handleCreate} type="submit">
              Add
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VaccineManagement;
