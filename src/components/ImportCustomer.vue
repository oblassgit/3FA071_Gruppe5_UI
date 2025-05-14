<template>
  <div class="customers">
    <h2>Import Customers</h2>
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
  </div>
</template>

<script>
import Papa from 'papaparse';
import axios from 'axios';

const url = 'http://127.0.0.1:8080/rest/customers/import';

export default {
  data() {
    return {
      parsedData: [],
    };
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            this.parsedData = results.data;
            console.log('Parsed CSV:', results.data);
          },
          error: (error) => {
            console.error('CSV Parse Error:', error.message);
          }
        });
      } else if (fileExtension === 'xml') {
        const reader = new FileReader();
        reader.onload = () => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(reader.result, 'text/xml');
          const items = xmlDoc.getElementsByTagName('item');

          const parsed = [];
          for (let i = 0; i < items.length; i++) {
            const itemNode = items[i];
            const customer = {};

            for (let j = 0; j < itemNode.children.length; j++) {
              const child = itemNode.children[j];
              customer[child.nodeName] = child.textContent;
            }

            parsed.push(customer);
          }

          this.parsedData = parsed;
          console.log('Parsed XML:', parsed);
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
          } catch (error) {
            console.error('JSON Parse Error:', error.message);
            alert(`JSON Parse Error: ${error.message}`);
          }
        };
        reader.readAsText(file);
      } else {
        alert('Unsupported file type. Please upload a CSV, XML, or JSON file.');
      }
    },


    async saveToDatabase() {
      try {
        const response = await axios.post(url, {
          customers: this.parsedData
        });
        console.log('Saved to Database:', response.data);
        alert('Data successfully saved!');
      } catch (error) {
        console.error('Error saving to database:', error);
        console.log(JSON.stringify({customers: this.parsedData}));
        alert('Failed to save data.');
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
</style>