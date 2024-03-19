import axios from "axios";


export const getAppointments = async () => {
  const { data } = await axios.get("http://localhost:8080/appointment/find-all");
  return data;
};

export const deleteAppointment = async (id) => {
  const { data } = await axios.delete(
    `http://localhost:8080/appointment/delete/${id}`
  );
  return data;
};

export const createAppointment = async (appointment) => {
  const { data } = await axios.post(
    `http://localhost:8080/appointment/save`,
    appointment
  );
  return data;
};

export const updateAppointmentFunction = async (appointment) => {
  const { data } = await axios.put(
    `http://localhost:8080/appointment/update/${appointment.appointmentId}`,
    appointment
  );
  return data;
};

