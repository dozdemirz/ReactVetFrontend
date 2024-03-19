import axios from "axios";


export const getDoctors = async () => {
  const { data } = await axios.get("http://localhost:8080/doctor/find-all");
  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await axios.delete(
    `http://localhost:8080/doctor/delete/${id}`
  );
  return data;
};

export const createDoctor = async (doctor) => {
  const { data } = await axios.post(
    `http://localhost:8080/doctor/save`,
    doctor
  );
  return data;
};


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

export const updateDoctorFunction = async (doctor) => {
  const { data } = await axios.put(
    `http://localhost:8080/doctor/update/${doctor.doctorId}`,
    doctor
  );
  return data;
};