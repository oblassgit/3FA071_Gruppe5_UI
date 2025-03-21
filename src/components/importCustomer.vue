<template>
  <div class="customers">
    <h2>import customers</h2>
    <input type="file" @change="handleFile" accept=".csv, .xml, .json" />
    <button :disabled="!parsedData.length" @click="saveToDatabase" style="margin-left: 10px;">Save to Database</button>
    <div v-if="parsedData.length">
      <h3>results:</h3>
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

const url = 'http://127.0.0.1:8080/rest/customers/createcustomers';

export default {
  data() {
    return {
      parsedData: []
    };
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          this.parsedData = results.data;
          console.log('Parsed CSV (Reading):', results.data);
        },
        error: (error) => {
          console.error('Fehler beim Parsen (Reading):', error.message);
        }
      });
    },
    async saveToDatabase() {
      try {
        const response = await axios.post(url, this.parsedData);
        console.log('Saved to Database:', response.data);
        alert('Data successfully saved!');
      } catch (error) {
        console.error('Error saving to database:', error);
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
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
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
}
</style>
