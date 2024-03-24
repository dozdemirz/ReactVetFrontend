import React, { useState, useEffect } from "react";
import "./customer.css";
import {
  deleteCustomer,
  getCustomers,
  createCustomer,
  updateCustomerFunction,
  getCustomerByName,
} from "../../API/customer";
import Modal from "../Modal";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [reload, setReload] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomerEditModalOpen, setIsCustomerEditModalOpen] = useState(false);
  const [isCustomerAddModalOpen, setIsCustomerAddModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    customerMail: "",
    customerAddress: "",
    customerCity: "",
    customerPhone: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCustomers()
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
    setReload(false);
  }, [reload]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      // Arama terimi boş değilse API isteği gönder
      getCustomerByName(searchTerm)
        .then((data) => {
          setCustomers(data); // Gelen müşteri verilerini güncelle
        })
        .catch((error) => {
          setError(error.response.data);
          setShowModal(true);
          setCustomers([]);
        });
    } else {
      // Arama terimi boşsa, tüm müşterileri getir
      getCustomers()
        .then((data) => {
          setCustomers(data);
        })
        .catch((error) => {
          setError(error.response.data);
          setShowModal(true);
          setCustomers([]);
        });
    }
  }, [searchTerm]); // searchTerm değiştiğinde bu etki tekrar çalışır

  const handleNewCustomer = (event) => {
    setNewCustomer({
      ...newCustomer,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = () => {
    createCustomer(newCustomer)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setNewCustomer({
      customerName: "",
      customerMail: "",
      customerAddress: "",
      customerCity: "",
      customerPhone: "",
    });
    setIsCustomerAddModalOpen(false);
  };

  const handleCloseError = () => {
    setError(null);
    setShowModal(false);
  };

  const [updateCustomer, setUpdateCustomer] = useState({
    customerName: "",
    customerMail: "",
    customerAddress: "",
    customerCity: "",
    customerPhone: "",
  });
  const handleUpdateBtn = (customer) => {
    setUpdateCustomer({
      customerId: customer.customerId,
      customerName: customer.customerName,
      customerMail: customer.customerMail,
      customerAddress: customer.customerAddress,
      customerCity: customer.customerCity,
      customerPhone: customer.customerPhone,
    });
    setIsCustomerEditModalOpen(true);
  };

  const handleUpdateChange = (event) => {
    setUpdateCustomer({
      ...updateCustomer,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = () => {
    updateCustomerFunction(updateCustomer)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateCustomer({
      customerName: "",
      customerMail: "",
      customerAddress: "",
      customerCity: "",
      customerPhone: "",
    });
    setIsCustomerEditModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteCustomer(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data);
        setShowModal(true);
      });
  };

  const handleAddBtn = (event) => {
    setIsCustomerAddModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="customerManagement">
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
      <h2>Customer Management</h2>
      <div className="customer-grid">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="customer-add">
          <button className="update-button add-button" onClick={handleAddBtn}>
            Add Customer
          </button>
        </div>
      </div>
      <div className="customerList overflow">
        <h3>Customer List</h3>
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
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerName}</td>
                <td>{customer.customerMail}</td>
                <td>{customer.customerAddress}</td>
                <td>{customer.customerCity}</td>
                <td>{customer.customerPhone}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(customer.customerId)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleUpdateBtn(customer)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCustomerEditModalOpen && (
        <Modal handleCloseModal={() => setIsCustomerEditModalOpen(false)}>
          <div className="update-customer">
            <h3>Update Customer</h3>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="customerName"
              value={updateCustomer.customerName}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="customerMail"
              value={updateCustomer.customerMail}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="customerAddress"
              value={updateCustomer.customerAddress}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="customerCity"
              value={updateCustomer.customerCity}
              onChange={handleUpdateChange}
              required
            />

            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="customerPhone"
              value={updateCustomer.customerPhone}
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
      {isCustomerAddModalOpen && (
        <Modal handleCloseModal={() => setIsCustomerAddModalOpen(false)}>
          <div className="customerAdd">
            <h3>Add Customer</h3>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="customerName"
              value={newCustomer.customerName}
              onChange={handleNewCustomer}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="customerMail"
              value={newCustomer.customerMail}
              onChange={handleNewCustomer}
              required
            />

            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="customerAddress"
              value={newCustomer.customerAddress}
              onChange={handleNewCustomer}
              required
            />

            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="customerCity"
              value={newCustomer.customerCity}
              onChange={handleNewCustomer}
              required
            />

            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="customerPhone"
              value={newCustomer.customerPhone}
              onChange={handleNewCustomer}
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

export default CustomerManagement;
