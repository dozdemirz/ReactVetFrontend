import axios from "axios";

export const createAvailableDate = async (availableDate) => {
  const { data } = await axios.post(
    `http://localhost:8080/available-date/save`,
    availableDate
  );
  return data;
};

export const getAvailableDatesByDoctorId = async (doctorId) => {
  const { data } = await axios.get(
    `http://localhost:8080/available-date/${doctorId}`
  );
  return data;
};

export const deleteAvailableDate = async (id) => {
  const { data } = await axios.delete(
    `http://localhost:8080/available-date/delete/${id}`
  );
  return data;
};

export const updateAvailableDateFunction = async (availableDate) => {
  const { data } = await axios.put(
    `http://localhost:8080/available-date/update/${availableDate.availableDateId}`,
    availableDate
  );
  return data;
};
