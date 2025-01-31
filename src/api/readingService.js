import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/rest/readings", // Adjust baseURL to your backend
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    getReading(uuid) {
        return apiClient.get(`/${uuid}`);
    },
    getReadingsByParameter(customer, start, end, kindOfMeter) {
        return apiClient.get("?" +
        customer == null ? "customer=" + customer : "" +
        start == null ? "start=" + start : "" +
        end == null ? "end=" + end : "" +
        kindOfMeter == null ? "kindOfMeter=" + kindOfMeter : "");
    },
    createReading(reading) {
        return apiClient.post("/", reading);
    },
    updateReading(reading) {
        return apiClient.put("/", reading);
    },
    deleteReading(uuid) {
        return apiClient.delete(`/${uuid}`);
    },
};