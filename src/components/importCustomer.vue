<template>
  <div class="import">
    <div class="customers">
      <h2>import customer</h2>
      <input type="file" @change="handleFile" accept=".csv, .xml, .json" />
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
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  data() {
    return {
      parsedData: []  // Hier werden die CSV-Daten gespeichert
    };
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,        // Die erste Zeile als Header verwenden
        dynamicTyping: true, // Automatische Typkonvertierung (z.B. Zahlen)
        complete: (results) => {
          this.parsedData = results.data;
          console.log('Parsed CSV:', results.data);
        },
        error: (error) => {
          console.error('Fehler beim Parsen:', error.message);
        }
      });
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
</style>
