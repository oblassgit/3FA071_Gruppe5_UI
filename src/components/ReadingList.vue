<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Reading List</h1>
      <div class="d-flex gap-2 ms-auto">
        <router-link to="/readings/new" class="btn btn-primary">
          Add reading
        </router-link>
        <router-link class="btn btn-primary" to="/customers/importReading">Import Reading</router-link>
        <b-dropdown id="dropdown-export" text="Export readings" variant="primary">
          <b-dropdown-item @click="exportData('csv')">CSV</b-dropdown-item>
          <b-dropdown-item @click="exportData('csv', 'eu')">CSV [Optimized for EU]</b-dropdown-item>
          <b-dropdown-item @click="exportData('json')">JSON</b-dropdown-item>
          <b-dropdown-item @click="exportData('xml')">XML</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="card shadow p-3 mb-4">
      <div class="row g-3">
        <div class="col-md-3">
          <CustomerSearch
              ref="customerSearch"
              v-model="filters.customer"
              label="Filter by Customer"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" v-model="filters.startDate">
        </div>
        <div class="col-md-3">
          <label class="form-label">End Date</label>
          <input type="date" class="form-control" v-model="filters.endDate">
        </div>
        <div class="col-md-2">
          <label class="form-label">Type</label>
          <select class="form-select" v-model="filters.kindOfMeter">
            <option value="">All</option>
            <option value="HEIZUNG">Heating</option>
            <option value="STROM">Power</option>
            <option value="WASSER">Water</option>
            <option value="UNBEKANNT">Unknown</option>
          </select>
        </div>
        <div class="col-md-1 d-flex align-items-end">
          <button class="btn btn-secondary w-100" @click="resetFilters">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
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
          <td>{{ formatDate(reading.dateOfReading) }}</td>
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
import exportHelper from '@/helper/exportHelper.js';
import CustomerSearch from '@/components/CustomerSearch.vue';
import {BDropdownItem} from "bootstrap-vue-3";

export default {
  name: 'ReadingList',
  components: {BDropdownItem, CustomerSearch },

  data() {
    return {
      readings: [],
      filters: {
        customer: null,
        startDate: '',
        endDate: '',
        kindOfMeter: ''
      },
      dontAskAgain: localStorage.getItem('dontAskDelete') === 'true'
    };
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        this.fetchReadings();
      }
    }
  },

  methods: {
    async fetchReadings() {
      try {
        const queryParams = new URLSearchParams();

        if (this.filters.customer) {
          queryParams.append('customer', this.filters.customer.uuid);
        }
        if (this.filters.startDate) {
          queryParams.append('start', this.filters.startDate);
        }
        if (this.filters.endDate) {
          queryParams.append('end', this.filters.endDate);
        }
        if (this.filters.kindOfMeter) {
          queryParams.append('kindOfMeter', this.filters.kindOfMeter);
        }

        const response = await readingService.getReadingsByParameter(queryParams);
        this.readings = response.data.readings;
      } catch (error) {
        console.error('Error fetching readings:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

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
        await this.fetchReadings();
      } catch (error) {
        console.error('Error deleting reading:', error);
        alert('Failed to delete reading');
      }
    },

    async exportData(fileType, region = null) {
      try {
        if (fileType === 'csv') {
          await exportHelper.exportCsv('readings', region);
        } else if (fileType === 'json') {
          await exportHelper.exportJson('readings');
        } else if (fileType === 'xml') {
          await exportHelper.exportXml('readings');
        }
      } catch (error) {
        console.error('Error exporting data:', error);
        alert('Failed to export data');
      }
    },

    resetFilters() {
      this.$refs.customerSearch?.reset();
      this.filters = {
        customer: null,
        startDate: '',
        endDate: '',
        kindOfMeter: ''
      };

      console.log(this.filters)
    }
  },

  created() {
    this.fetchReadings();
  }
};
</script>