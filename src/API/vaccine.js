import axios from "axios";


export const getVaccine = async () => {
  const { data } = await axios.get("http://localhost:8080/vaccine/find-all");
  return data;
};

export const deleteVaccine = async (id) => {
  const { data } = await axios.delete(
    `http://localhost:8080/vaccine/delete/${id}`
  );
  return data;
};

export const createVaccine = async (vaccine) => {
  const { data } = await axios.post(
    `http://localhost:8080/vaccine/save`,
    vaccine
  );
  return data;
};

export const updateVaccineFunction = async (vaccine) => {
  const { data } = await axios.put(
    `http://localhost:8080/vaccine/update/${vaccine.vaccineId}`,
    vaccine
  );
  return data;
};
