import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/rest/readings", // Adjust baseURL to your backend
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/csv, application/xml"
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
    getReadingsByParameter(params = new URLSearchParams()) {
        return apiClient.get(`?${params.toString()}`);
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
    exportReading(fileType) {
        return apiClient.get(`/export/${fileType}`);
    }
};