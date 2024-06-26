import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL; 

export const getVaccine = async () => {
  const { data } = await axios.get(`${BASE_URL}/vaccine/find-all`);
  return data;
};

export const deleteVaccine = async (id) => {
  const { data } = await axios.delete(
    `${BASE_URL}/vaccine/delete/${id}`
  );
  return data;
};

export const createVaccine = async (vaccine) => {
  const { data } = await axios.post(
    `${BASE_URL}/vaccine/save`,
    vaccine
  );
  return data;
};

export const updateVaccineFunction = async (vaccine) => {
  const { data } = await axios.put(
    `${BASE_URL}/vaccine/update/${vaccine.vaccineId}`,
    vaccine
  );
  return data;
};


export const getVaccineBetweenTwoDates = async (startDate, endDate) => {
  const { data } = await axios.get(
    `${BASE_URL}/vaccine/expiring/${startDate}/${endDate}`
  );
  return data;
};

export const getVaccineBeforeDate = async (endDate) => {
  const { data } = await axios.get(
    `${BASE_URL}/vaccine/expiring-before/${endDate}`
  );
  return data;
};

export const getVaccineAfterDate = async (startDate) => {
  const { data } = await axios.get(
    `${BASE_URL}/vaccine/expiring-after/${startDate}`
  );
  return data;
};

export const getVaccineByAnimal = async (name) => {
  const { data } = await axios.get(`${BASE_URL}/vaccine/animal-name/${name}`);
  return data;
};

export const getVaccineBetweenTwoDatesWithAnimal = async (
  startDate,
  endDate,
  name
) => {
  const { data } = await axios.get(
    `${BASE_URL}/vaccine/expiring/${name}/${startDate}/${endDate}`
  );
  return data;
};


export const getVaccineBeforeDateWithAnimal = async (endDate, name) => {
  const { data } = await axios.get(
    `${BASE_URL}/vaccine/expiring-before/${name}/${endDate}`
  );
  return data;
};


export const getVaccineAfterDateWithAnimal = async (startDate, name) => {
  const { data } = await axios.get(
    `${BASE_URL}/vaccine/expiring-after/${name}/${startDate}`
  );
  return data;
};
