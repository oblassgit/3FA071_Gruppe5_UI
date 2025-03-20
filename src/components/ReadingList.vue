<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Reading List</h1>
      <div class="d-flex gap-2 ms-auto">
        <router-link to="/readings/new" class="btn btn-primary">
          Add reading
        </router-link>
        <b-dropdown id="dropdown-export" text="Export readings" variant="primary">
          <b-dropdown-item @click="Export('csv')">CSV</b-dropdown-item>
          <b-dropdown-item @click="Export('csv', 'eu')">CSV [Optimized for EU]</b-dropdown-item>
          <b-dropdown-item @click="Export('json')">JSON</b-dropdown-item>
          <b-dropdown-item @click="Export('xml')">XML</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="card shadow p-4">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Meter ID</th>
            <th>Count</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="readings.length === 0">
            <td colspan="6" class="text-center text-muted">No readings found.</td>
          </tr>
          <tr v-for="reading in readings" :key="reading.uuid">
            <td>
              {{ reading.customer ? `${reading.customer.firstName} ${reading.customer.lastName}` : 'N/A' }}
            </td>
            <td>{{ new Date(reading.dateOfReading).toLocaleDateString() }}</td>
            <td>{{ reading.meterId }}</td>
            <td>{{ reading.meterCount }}</td>
            <td>
              <span :class="getMeterTypeClass(reading.kindOfMeter)">
                {{ reading.kindOfMeter }}
              </span>
            </td>
            <td>
              <div class="d-flex gap-2">
                <router-link :to="'/readings/' + reading.uuid" class="btn btn-sm btn-info">
                  View
                </router-link>
                <router-link :to="'/readings/edit/' + reading.uuid" class="btn btn-sm btn-warning">
                  Edit
                </router-link>
                <button @click="deleteReading(reading.uuid)" class="btn btn-sm btn-danger">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import readingService from '@/api/readingService';
import exportHelper from "@/helper/exportHelper.js";


export default {
  data() {
    return {
      readings: [],
      dontAskAgain: localStorage.getItem('dontAskDelete') === 'true'
    };
  },
  async created() {
    try {
      const response = await readingService.getReadings();
      console.log('Readings:', response);
      this.readings = response.data.readings;
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  },
  methods: {
    getMeterTypeClass(type) {
      const classes = {
        HEIZUNG: 'badge bg-danger',
        STROM: 'badge bg-warning',
        WASSER: 'badge bg-info',
        UNBEKANNT: 'badge bg-secondary'
      };
      return classes[type] || classes.UNBEKANNT;
    },
    async deleteReading(uuid) {
      if (!this.dontAskAgain) {
        const userConfirmed = confirm('Are you sure you want to delete this reading?');
        if (!userConfirmed) return;

        const dontAsk = confirm('Don\'t ask again for deletions?');
        if (dontAsk) {
          localStorage.setItem('dontAskDelete', 'true');
          this.dontAskAgain = true;
        }
      }

      try {
        await readingService.deleteReading(uuid);
        this.readings = this.readings.filter(reading => reading.uuid !== uuid);
        alert('Reading deleted successfully');
      } catch (error) {
        console.error('Error deleting reading:', error);
        alert('Failed to delete reading');
      }
    },
    async Export(fileType, region) {
      switch(fileType) {
        case 'csv':
          exportHelper.exportCsv('readings', region);
          break;
        case 'json':
          exportHelper.exportJson('readings');
          break;
        case 'xml':
          exportHelper.exportXml('readings');
          break;
      }
    }
  }
};
</script>

<style scoped>
.badge {
  padding: 0.5em 1em;
}
</style>