<template>
    <div class="readings">
      <h2>Import Reading</h2>
      <input type="file" @change="handleFile" accept=".csv, .xml, .json" />
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
      }
    }
  };
  </script>
  