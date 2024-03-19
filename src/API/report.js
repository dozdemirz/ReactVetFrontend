import axios from "axios";


export const getReports = async () => {
  const { data } = await axios.get("http://localhost:8080/report/find-all");
  return data;
};

export const deleteReport = async (id) => {
  const { data } = await axios.delete(
    `http://localhost:8080/report/delete/${id}`
  );
  return data;
};

export const createReport = async (report) => {
  const { data } = await axios.post(
    `http://localhost:8080/report/save`,
    report
  );
  return data;
};


export const updateReportFunction = async (report) => {
  const { data } = await axios.put(
    `http://localhost:8080/report/update/${report.reportId}`,
    report
  );
  return data;
};