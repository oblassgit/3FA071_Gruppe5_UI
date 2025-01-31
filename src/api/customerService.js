import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/rest/customers", // Adjust baseURL to your backend
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    getAllCustomers() {
        return apiClient.get("/");
    },
    getCustomer(uuid) {
        return apiClient.get(`/${uuid}`);
    },
    createCustomer(customer) {
        return apiClient.post("/", customer);
    },
    updateCustomer(customer) {
        return apiClient.put("/", customer);
    },
    deleteCustomer(uuid) {
        return apiClient.delete(`/${uuid}`);
    },
};