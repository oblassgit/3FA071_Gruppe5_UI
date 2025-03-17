<template>
  <div class="container mt-5">
    <h1 class="mb-4">Reading List</h1>
    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
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
    </div>

    <router-link to="/readings/new" class="btn btn-primary mt-3">
      Add New Reading
    </router-link>
    <b-dropdown id="dropdown-export" text="Export" variant="primary">
      <b-dropdown-item @click="Export('csv')">CSV</b-dropdown-item>
      <b-dropdown-item @click="Export('json')">JSON</b-dropdown-item>
      <b-dropdown-item @click="Export('xml')">XML</b-dropdown-item>
    </b-dropdown>
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
    async Export(fileType) {
      switch(fileType) {
        case 'csv':
        alert('csv');
          break;
        case 'json':
          exportHelper.exportJson('readings');
          break;
        case 'xml':
          alert('xml');
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