import axios from "axios";

const apiClient = axios.create({
    baseUrl: "https://127.0.0.1:8080/rest/customers",

    headers: {
        "Content-Type": "application/json"
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
    deleteCustomer(uuid) {
        return apiClient.delete(`/${uuid}`);
    }
};