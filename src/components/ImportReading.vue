<template>
  <div class="readings">
    <h2>Import Reading</h2>
    <input type="file" @change="handleFile" accept=".csv, .xml, .json" />
    <button :disabled="!parsedData.length" @click="saveToDatabase" style="margin-left: 10px;">Save to Database</button>
    <div v-if="parsedData.length">
      <h3>Results:</h3>
      <table>
        <thead>
        <tr>
          <th v-for="(key, index) in Object.keys(parsedData[0])" :key="index">{{ key }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in parsedData" :key="rowIndex">
          <td v-for="(value, key) in row" :key="key">{{ value }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
import axios from 'axios';
import customerService from "@/api/customerService.js";

const url = 'http://127.0.0.1:8080/rest/readings/import';

export default {
  data() {
    return {
      parsedData: [],
      readings: [],
      error: null,
      fileType: null // Track the file type
    };
  },
  methods: {
    isValidDate(dateString) {
      if (!dateString) return false;
      if (dateString === "UNBEKANNT") return false;

      // Versuche das Datum zu parsen
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },

    handleFile(event) {
      this.error = null;
      const file = event.target.files[0];
      if (!file) return;
      const fileExtension = file.name.split('.').pop().toLowerCase();
      this.fileType = fileExtension; // Store the file type

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            if (results.data && results.data.length) {
              // Filter out empty rows
              this.parsedData = results.data.filter(row => Object.values(row).some(val => val !== null && val !== ""));
              console.log('Parsed CSV:', this.parsedData);
              this.fetchCustomerForReading();
            } else {
              this.error = "No valid data found in CSV file";
            }
          },
          error: (error) => {
            this.error = `CSV Parse Error: ${error.message}`;
            console.error('CSV Parse Error:', error.message);
          }
        });
      } else if (fileExtension === 'xml') {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(reader.result, 'text/xml');

            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
              this.error = "XML Parse Error: Invalid XML format";
              return;
            }

            const items = xmlDoc.getElementsByTagName('item');
            if (items.length === 0) {
              this.error = "No 'item' elements found in XML";
              return;
            }

            const parsed = [];
            for (let i = 0; i < items.length; i++) {
              const itemNode = items[i];
              const reading = {};

              for (let j = 0; j < itemNode.children.length; j++) {
                const child = itemNode.children[j];
                reading[child.nodeName] = child.textContent;
              }

              parsed.push(reading);
            }

            this.parsedData = parsed;
            console.log('Parsed XML:', parsed);
            this.fetchCustomerForReading();
          } catch (error) {
            this.error = `XML Parse Error: ${error.message}`;
            console.error('XML Parse Error:', error);
          }
        };
        reader.readAsText(file);
      } else if (fileExtension === 'json') {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const jsonData = JSON.parse(reader.result);
            if (Array.isArray(jsonData)) {
              this.parsedData = jsonData;
            } else if (jsonData && typeof jsonData === 'object') {
              // Handle case where JSON is an object with an array property
              const possibleArrays = Object.values(jsonData).filter(val => Array.isArray(val));
              if (possibleArrays.length > 0) {
                this.parsedData = possibleArrays[0];
              } else {
                // If it's just a single object, wrap it in an array
                this.parsedData = [jsonData];
              }
            }
            console.log('Parsed JSON:', this.parsedData);
            // For JSON files, skip fetchCustomerForReading and directly prepare readings
            this.prepareReadingsFromJson();
          } catch (error) {
            this.error = `JSON Parse Error: ${error.message}`;
            console.error('JSON Parse Error:', error);
          }
        };
        reader.readAsText(file);
      } else {
        this.error = 'Unsupported file type. Please upload a CSV, XML, or JSON file.';
      }
    },

    async fetchCustomerForReading() {
      if (!this.parsedData || this.parsedData.length === 0) {
        this.error = "No data available to process";
        return;
      }

      try {
        this.readings = await Promise.all(
            this.parsedData.map(async (reading) => {
              let customer = null;
              if (reading.customerId) {
                try {
                  const response = await customerService.getCustomer(reading.customerId);
                  customer = response.data.customer;
                } catch (customerError) {
                  console.warn(`Failed to fetch customer with ID ${reading.customerId}:`, customerError);
                }
              }

              // Direkt das Reading-Objekt zurückgeben ohne zusätzlichen Wrapper
              return {
                customer,
                // Datum-Validierung - nur gültige Daten senden oder null verwenden
                dateOfReading: this.isValidDate(reading.dateOfReading) ? reading.dateOfReading : null,
                meterId: reading.meterId || '',
                substitute: reading.substitute === true || reading.substitute === 'true' || false,
                meterCount: Number(reading.meterCount) || 0,
                kindOfMeter: reading.kindOfMeter || ''
              };
            })
        );
        console.log('Prepared readings for saving:', this.readings);
      } catch (error) {
        this.error = `Error fetching customer data: ${error.message}`;
        console.error('Error fetching customer:', error);
      }
    },

    // New method to handle JSON files where customers are already included
    prepareReadingsFromJson() {
      if (!this.parsedData || this.parsedData.length === 0) {
        this.error = "No data available to process";
        return;
      }

      try {
        // Assume JSON already has the correct structure with customer data
        this.readings = this.parsedData.map(reading => {
          return {
            // Use the existing customer data if available
            customer: reading.customer || null,
            dateOfReading: this.isValidDate(reading.dateOfReading) ? reading.dateOfReading : null,
            meterId: reading.meterId || '',
            substitute: reading.substitute === true || reading.substitute === 'true' || false,
            meterCount: Number(reading.meterCount) || 0,
            kindOfMeter: reading.kindOfMeter || ''
          };
        });
        console.log('Prepared JSON readings for saving:', this.readings);
      } catch (error) {
        this.error = `Error preparing JSON data: ${error.message}`;
        console.error('Error preparing JSON data:', error);
      }
    },

    async saveToDatabase() {
      if (!this.readings || this.readings.length === 0) {
        this.error = "No readings to save";
        return;
      }

      try {
        // Überprüfe alle Readings auf gültige Datumswerte vor dem Absenden
        const validReadings = this.readings.map(reading => {
          // Kopiere das Reading-Objekt
          const validReading = {...reading};

          // Stelle sicher, dass dateOfReading ein gültiges Datum ist oder null
          if (!this.isValidDate(validReading.dateOfReading)) {
            validReading.dateOfReading = null;
          }

          // Stelle sicher, dass meterId ein String ist
          if (typeof validReading.meterId !== 'string') {
            validReading.meterId = String(validReading.meterId);
          }

          return validReading;
        });

        // Direkt das readings-Array senden ohne zusätzliches Wrapping
        const payload = { readings: validReadings };
        console.log('Sending payload:', payload);

        const response = await axios.post(url, payload);
        console.log('Saved to Database:', response.data);
        alert('Data successfully saved!');

        // Reset after successful save
        this.parsedData = [];
        this.readings = [];
      } catch (error) {
        this.error = `Failed to save data: ${error.response?.data?.message || error.message}`;
        console.error('Error saving to database:', error);
        console.log('Failed payload:', JSON.stringify({ readings: this.readings }));
      }
    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
button {
  padding: 8px 16px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover:not(:disabled) {
  background-color: #45a049;
}
.error-message {
  color: #d32f2f;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>