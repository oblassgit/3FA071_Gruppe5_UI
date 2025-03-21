import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/rest/customers", // Adjust baseURL to your backend
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/csv, application/xml"
    },
});

export default {
    async getAllCustomers() {
        try {
            const response = await apiClient.get("");
            console.log('Response:', response); // Debug log
            return response;
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request
            });
            throw error;
        }
    },
    async getCustomersByParam(params = new URLSearchParams()) {
        try {
            return await apiClient.get(`?${params.toString()}`);
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
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
    exportCustomer(fileType) {
        return apiClient.get(`/export/${fileType}`);
    }
};