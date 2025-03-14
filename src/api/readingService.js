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
    getReadings() {
        const response = apiClient.get("")
        return response
    },
    getReadingsByParameter(customer, start, end, kindOfMeter) {
        return apiClient.get("?" +
        customer == null ? "customer=" + customer : "" +
        start == null ? "start=" + start : "" +
        end == null ? "end=" + end : "" +
        kindOfMeter == null ? "kindOfMeter=" + kindOfMeter : "");
    },
    createReading(reading) {
        const payload = {
            reading: {
                customer: reading.customer,
                dateOfReading: reading.dateOfReading,
                meterId: reading.meterId,
                substitute: reading.substitute,
                meterCount: reading.meterCount,
                kindOfMeter: reading.kindOfMeter,
                comment: reading.comment || null
            }
        };
        return apiClient.post("/", payload);
    },
    updateReading(uuid, reading) {
        const payload = {
            reading: {
                uuid: uuid,
                customer: reading.customer,
                dateOfReading: reading.dateOfReading,
                meterId: reading.meterId,
                substitute: reading.substitute,
                meterCount: reading.meterCount,
                kindOfMeter: reading.kindOfMeter,
                comment: reading.comment || null
            }
        };
        return apiClient.put("/", payload);
    },
    deleteReading(uuid) {
        return apiClient.delete(`/${uuid}`);
    },
};