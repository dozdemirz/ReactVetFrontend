import axios from "axios";

export const getCustomers = async () => {
    const { data } = await axios.get("http://localhost:8080/customer/find-all");
    return data;
}

export const deleteCustomer = async (id) => {
    const {data} = await axios.delete(
        `http://localhost:8080/customer/delete/${id}`);
    return data;
}

export const createCustomer = async (customer) => {
    const {data} = await axios.post(
        `http://localhost:8080/customer/save`, customer
    );
    return data;
}

export const getCustomerById = async (id) => {
    const { data } = await axios.get(`http://localhost:8080/customer/${id}`);
    return data;
  };

  export const updateCustomerFunction = async (customer) => {
  const { data } = await axios.put(
    `http://localhost:8080/customer/update/${customer.customerId}`,
    customer
  );
  return data;
};