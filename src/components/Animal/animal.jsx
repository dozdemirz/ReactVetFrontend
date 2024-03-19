import React, { useState, useEffect } from "react";
import "./animal.css";
import { getCustomers } from "../../API/customer";
import {
  getAnimals,
  deleteAnimal,
  createAnimal,
  updateAnimalFunction,
} from "../../API/animal";
import Modal from "../Modal";

const AnimalManagement = () => {
  const [animal, setAnimal] = useState([]);
  const [reload, setReload] = useState(true);
  const [customer, setCustomer] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimalEditModalOpen, setIsAnimalEditModalOpen] = useState(false);
  const [isAnimalAddModalOpen, setIsAnimalAddModalOpen] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    animalName: "",
    animalBreed: "",
    animalColor: "",
    birthDate: "",
    animalGender: "",
    animalSpecies: "",
    customer: {
      customerId: "",
    },
  });
  const [error, setError] = useState(null); // Hata durumu
  const [showModal, setShowModal] = useState(false); // Modal popup gösterme durumu
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    Promise.all([getAnimals(), getCustomers()])
      .then(([animalsData, customersData]) => {
        setAnimal(animalsData);
        setCustomer(customersData);
      })
      .catch((error) => {
        setError(error.response.data); // Hata durumunda hatayı ayarla
        setShowModal(true); // Modal popup'u göster
        console.error("Error fetching data:", error);
      });
    setReload(false);
  }, [reload]);

  const [updateAnimal, setUpdateAnimal] = useState({
    animalName: "",
    animalBreed: "",
    animalColor: "",
    birthDate: "",
    animalGender: "",
    animalSpecies: "",
    customer: {
      customerId: "",
    },
  });

  const handleDelete = (id) => {
    deleteAnimal(id)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error); // Hata durumunda hatayı ayarla
        setShowModal(true); // Modal popup'u göster
        console.error("Error deleting animal:", error);
      });
  };

  const handleNewAnimal = (event) => {
    const { name, value } = event.target;
    if (name === "customerId") {
      setNewAnimal((prevAnimal) => ({
        ...prevAnimal,
        customer: {
          customerId: value,
        },
      }));
    } else {
      setNewAnimal((prevAnimal) => ({
        ...prevAnimal,
        [name]: value,
      }));
    }
  };

  const handleCreate = () => {
    createAnimal(newAnimal)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setNewAnimal({
      animalName: "",
      animalBreed: "",
      animalColor: "",
      birthDate: "",
      animalGender: "",
      animalSpecies: "",
      customer: {
        customerId: "",
      },
    });
    setIsAnimalAddModalOpen(false);
  };

  const handleCloseError = () => {
    setError(null); // Hata mesajını kapat
    setShowModal(false); // Modal popup'u kapat
  };

  const handleUpdateBtn = (animal) => {
    setUpdateAnimal({
      animalId: animal.animalId,
      animalName: animal.animalName,
      animalBreed: animal.breed,
      animalColor: animal.color,
      birthDate: animal.birthDate,
      animalGender: animal.gender,
      animalSpecies: animal.species,
      customer: {
        customerId: animal.customer.customerId,
      },
    });
    setIsAnimalEditModalOpen(true);
  };

  const handleUpdateCustomerChange = (event) => {
    setUpdateAnimal({
      ...updateAnimal,
      customer: {
        customerId: event.target.value,
      },
    });
  };

  const handleUpdate = () => {
    updateAnimalFunction(updateAnimal)
      .then(() => {
        setReload(true);
      })
      .catch((error) => {
        setError(error.response.data); // Backendden gelen hatayı al
        setShowModal(true); // Modal popup'u göster
      });
    setUpdateAnimal({
      animalName: "",
      animalBreed: "",
      animalColor: "",
      birthDate: "",
      animalGender: "",
      animalSpecies: "",
      customer: {
        customerId: "",
      },
    });
    setIsAnimalEditModalOpen(false);
  };

  const handleUpdateChange = (event) => {
    setUpdateAnimal({
      ...updateAnimal,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddBtn = (event) => {
    setIsAnimalAddModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="animal-manage">
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
      <h2>Animal Management</h2>
      <div className="animal-grid">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search animal or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="animal-add">
          <button className="update-button add-button" onClick={handleAddBtn}>
            Add Animal
          </button>
        </div>
      </div>
      <div className="animalList overflow">
        <h3>Animal List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Gender</th>
              <th>Color</th>
              <th>Birth Date</th>
              <th>Owner</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {animal
              .filter(
                (item) =>
                  item.animalName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  item.customer.customerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((filteredAnimal) => (
                <tr key={filteredAnimal.animalId}>
                  <td>{filteredAnimal.animalName}</td>
                  <td>{filteredAnimal.species}</td>
                  <td>{filteredAnimal.breed}</td>
                  <td>{filteredAnimal.gender}</td>
                  <td>{filteredAnimal.color}</td>
                  <td>{filteredAnimal.birthDate}</td>
                  <td>{filteredAnimal.customer.customerName}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(filteredAnimal.animalId)}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateBtn(filteredAnimal)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isAnimalEditModalOpen && (
        <Modal handleCloseModal={() => setIsAnimalEditModalOpen(false)}>
          <div className="update-animal">
            <h3>Update Animal</h3>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="animalName"
                value={updateAnimal.animalName}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="species">Species:</label>
              <input
                type="text"
                id="animalSpecies"
                name="animalSpecies"
                value={updateAnimal.animalSpecies}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="breed">Breed:</label>
              <input
                type="text"
                id="animalBreed"
                name="animalBreed"
                value={updateAnimal.animalBreed}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select
                id="animalGender"
                name="animalGender"
                value={updateAnimal.animalGender}
                onChange={handleUpdateChange}
                required
              >
                <option value="">Select</option>
                <option typeof="text" value="Male">
                  Male
                </option>
                <option typeof="text" value="Female">
                  Female
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="color">Color:</label>
              <input
                type="text"
                id="color"
                name="animalColor"
                value={updateAnimal.animalColor}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="birthDate">Birth Date:</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={updateAnimal.birthDate}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="owner">Owner:</label>
              <select
                id="owner"
                name="customerId"
                value={updateAnimal.customer.customerId}
                onChange={handleUpdateCustomerChange}
                required
              >
                <option value="">Select Owner</option>
                {customer.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.customerName}
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

      {isAnimalAddModalOpen && (
        <Modal handleCloseModal={() => setIsAnimalAddModalOpen(false)}>
          <div className="animalAddContainer">
            <h3>Add New Animal</h3>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="animalName"
                value={newAnimal.animalName}
                onChange={handleNewAnimal}
                required
              />
            </div>
            <div>
              <label htmlFor="species">Species:</label>
              <input
                type="text"
                id="animalSpecies"
                name="animalSpecies"
                value={newAnimal.animalSpecies}
                onChange={handleNewAnimal}
                required
              />
            </div>
            <div>
              <label htmlFor="breed">Breed:</label>
              <input
                type="text"
                id="animalBreed"
                name="animalBreed"
                value={newAnimal.animalBreed}
                onChange={handleNewAnimal}
                required
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select
                id="animalGender"
                name="animalGender"
                value={newAnimal.animalGender}
                onChange={handleNewAnimal}
                required
              >
                <option value="">Select</option>
                <option typeof="text" value="Male">
                  Male
                </option>
                <option typeof="text" value="Female">
                  Female
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="color">Color:</label>
              <input
                type="text"
                id="color"
                name="animalColor"
                value={newAnimal.animalColor}
                onChange={handleNewAnimal}
                required
              />
            </div>
            <div>
              <label htmlFor="birthDate">Birth Date:</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={newAnimal.birthDate}
                onChange={handleNewAnimal}
                required
              />
            </div>
            <div>
              <label htmlFor="owner">Owner:</label>
              <select
                id="owner"
                name="customerId"
                value={newAnimal.customer.customerId}
                onChange={handleNewAnimal}
                required
              >
                <option value="">Select Owner</option>
                {customer.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.customerName}
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

export default AnimalManagement;
