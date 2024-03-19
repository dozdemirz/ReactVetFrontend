import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL; 

export const createAvailableDate = async (availableDate) => {
  const { data } = await axios.post(
    `${BASE_URL}/available-date/save`,
    availableDate
  );
  return data;
};

export const getAvailableDatesByDoctorId = async (doctorId) => {
  const { data } = await axios.get(
    `${BASE_URL}/available-date/${doctorId}`
  );
  return data;
};

export const deleteAvailableDate = async (id) => {
  const { data } = await axios.delete(
    `${BASE_URL}/available-date/delete/${id}`
  );
  return data;
};

export const updateAvailableDateFunction = async (availableDate) => {
  const { data } = await axios.put(
    `${BASE_URL}/available-date/update/${availableDate.availableDateId}`,
    availableDate
  );
  return data;
};
