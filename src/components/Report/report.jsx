import React, { useState, useEffect } from "react";
import "./report.css"; // Raporlarla ilgili CSS dosyası
import {
  getReports,
  deleteReport,
  createReport,
  updateReportFunction,
} from "../../API/report"; // Rapor işlemleri için API çağrıları
import { getAppointments } from "../../API/appointment";
import Modal from "../Modal";

const ReportManagement = () => {
  const [report, setReports] = useState([]); // Rapor listesi
  const [appointment, setAppointment] = useState([]);
  const [newReport, setNewReport] = useState({
    reportTitle: "",
    reportDiagnosis: "",
    reportPrice: "",
    appointment: {
      appointmentId: "",
    }, // Appointment'a ait id
  });
  const [updateReport, setUpdateReport] = useState({
    reportTitle: "",
    reportDiagnosis: "",
    reportPrice: "",
    appointment: {
      appointmentId: "",
    },
  });
  const [error, setError] = useState(null); // Hata durumu
  const [showModal, setShowModal] = useState(false); // Modal popup gösterme durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportEditModalOpen, setIsReportEditModalOpen] = useState(false);
  const [isReportAddModalOpen, setIsReportAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Metin filtreleme terimi
  const [reload, setReload] = useState(true);

  useEffect(() => {
    Promise.all([getReports(), getAppointments()])
      .then(([reportData, appointmentData]) => {
        setReports(reportData);
        setAppointment(appointmentData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setReload(false);
  }, [reload]);

  const handleDelete = (id) => {
    // Rapor silme işlemi
    deleteReport(id)
      .then(() => {
        // Silme başarılıysa rapor listesini güncelle
        setReports((prevReports) =>
          prevReports.filter((report) => report.reportId !== id)
        );
      })
      .catch((error) => {
        setError(error); // Hata durumunda hatayı ayarla
        setShowModal(true); // Modal popup'u göster
        console.error("Error deleting report:", error);
      });
  };

  const handleNewReport = (event) => {
    const { name, value } = event.target;
    if (name === "appointmentId") {
      setNewReport((prevReport) => ({
        ...prevReport,
        appointment: {
          appointmentId: value,
        },
      }));
    } else {
      setNewReport((prevReport) => ({
        ...prevReport,
        [name]: value,
      }));
    }
  };

  const handleUpdateBtn = (report) => {
    setUpdateReport({
      reportId: report.reportId,
      reportTitle: report.reportTitle,
      reportDiagnosis: report.reportDiagnosis,
      reportPrice: report.reportPrice,
      appointment: {
        appointmentId: report.appointment.appointmentId,
      },
    });
    setIsReportEditModalOpen(true);
  };

  const handleUpdateAppointmentChange = (event) => {
    setUpdateReport({
      ...updateReport,
      appointment: {
        appointmentId: event.target.value,
      },
    });
  };
  const handleUpdateChange = (event) => {
    setUpdateReport({
      ...updateReport,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateReportFunction(updateReport)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setUpdateReport({
      reportTitle: "",
      reportDiagnosis: "",
      reportPrice: "",
      appointment: {
        appointmentId: "",
      },
    });
    setIsReportEditModalOpen(false);
  };

  const handleCreate = () => {
    createReport(newReport)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setNewReport({
      reportTitle: "",
      reportDiagnosis: "",
      reportPrice: "",
      appointment: {
        appointmentId: "",
      },
    });
    setIsReportAddModalOpen(false);
  };

  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Metin filtreleme terimini güncelle
  };

  const filteredReports = report.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ); // Metin filtreleme terimine göre raporları filtrele

  const selectedAppointmentDate =
    updateReport.appointment.appointmentId &&
    report.find(
      (item) =>
        item.appointment.appointmentId ===
        updateReport.appointment.appointmentId
    )?.appointment.appointmentDate;

  const unassignedAppointments = appointment.filter(
    (appointment) =>
      !report.some(
        (report) =>
          report.appointment.appointmentId === appointment.appointmentId
      )
  );

  const handleAddBtn = (event) => {
    setIsReportAddModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="report-management">
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
      <h2>Report Management</h2>
      <div className="report-grid">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="add-report">
          <button className="update-button add-button" onClick={handleAddBtn}>
            Add Report
          </button>
        </div>
      </div>
      <div className="reportList overflow">
        <h3>Report List</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Diagnosis</th>
              <th>Price</th>
              <th>Appointment Date</th>
              <th>Doctor Name</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.reportId}>
                <td>{report.reportTitle}</td>
                <td>{report.reportDiagnosis}</td>
                <td>{report.reportPrice}</td>
                <td>{report.appointment.appointmentDate}</td>
                <td>{report.appointment.doctor.doctorName}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(report.reportId)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleUpdateBtn(report)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isReportEditModalOpen && (
        <Modal handleCloseModal={() => setIsReportEditModalOpen(false)}>
          <div className="update-report">
            <h3>Update Report</h3>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="reportTitle"
                value={updateReport.reportTitle}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="diagnosis">Diagnosis:</label>
              <input
                type="text"
                id="diagnosis"
                name="reportDiagnosis"
                value={updateReport.reportDiagnosis}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="reportPrice"
                value={updateReport.reportPrice}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="appointmentId">Appointment:</label>
              <select
                name="appointmentId"
                value={updateReport.appointment.appointmentId}
                onChange={handleUpdateAppointmentChange}
              >
                <option value="" disabled>
                  Select Appointment
                </option>
                <option value="">{selectedAppointmentDate}</option>
                {unassignedAppointments.map((appointment) => (
                  <option
                    key={appointment.appointmentId}
                    value={appointment.appointmentId}
                  >
                    {appointment.appointmentDate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                className="update-button"
                onClick={handleUpdate}
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isReportAddModalOpen && (
        <Modal handleCloseModal={() => setIsReportAddModalOpen(false)}>
          <div className="reportAddContainer">
            <h3>Add New Report</h3>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="reportTitle"
                value={newReport.reportTitle}
                onChange={handleNewReport}
                required
              />
            </div>
            <div>
              <label htmlFor="diagnosis">Diagnosis:</label>
              <input
                type="text"
                id="diagnosis"
                name="reportDiagnosis"
                value={newReport.reportDiagnosis}
                onChange={handleNewReport}
                required
              />
            </div>
            <div>
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="reportPrice"
                value={newReport.reportPrice}
                onChange={handleNewReport}
                required
              />
            </div>
            <div>
              <label htmlFor="appointmentId">Appointment:</label>
              <select
                name="appointmentId"
                value={newReport.appointment.appointmentId}
                onChange={handleNewReport}
              >
                <option value="" disabled>
                  Select Appointment
                </option>
                {unassignedAppointments.map((appointment) => (
                  <option
                    key={appointment.appointmentId}
                    value={appointment.appointmentId}
                  >
                    {appointment.appointmentDate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button onClick={handleCreate} type="submit">
                Add
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportManagement;
