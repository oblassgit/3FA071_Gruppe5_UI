<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Customer List</h1>
      <div class="d-flex gap-2 ms-auto">
        <router-link to="/customers/new" class="btn btn-primary">
          Add customer
        </router-link>
        <b-dropdown id="dropdown-export" text="Export customer" variant="primary">
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
        <div class="col-md-4">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" v-model="filters.startDate">
        </div>
        <div class="col-md-4">
          <label class="form-label">End Date</label>
          <input type="date" class="form-control" v-model="filters.endDate">
        </div>
        <div class="col-md-3">
          <label class="form-label">Gender</label>
          <select class="form-select" v-model="filters.gender">
            <option value="">All</option>
            <option value="M">Male</option>
            <option value="W">Female</option>
            <option value="D">Diverse</option>
            <option value="U">Undefined</option>
          </select>
        </div>
        <div class="col-md-1 d-flex align-items-end">
          <button class="btn btn-secondary w-100" @click="resetFilters">
            Reset
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow p-4">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="customers.length === 0">
            <td colspan="4" class="text-center text-muted">No customers found.</td>
          </tr>
          <tr v-else v-for="customer in customers" :key="customer.uuid">
            <td>{{ customer.firstName }}</td>
            <td>{{ customer.lastName }}</td>
            <td>{{ customer.gender }}</td>
            <td>{{ customer.birthDate }}</td>
            <td>
              <div class="d-flex gap-2">
                <router-link :to="'/customers/' + customer.uuid" class="btn btn-sm btn-info">
                  View
                </router-link>
                <router-link :to="'/customers/edit/' + customer.uuid" class="btn btn-sm btn-warning">
                  Edit
                </router-link>
                <button @click="deleteCustomer(customer.uuid)" class="btn btn-sm btn-danger">
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
import customerService from "@/api/customerService";
import exportHelper from '@/helper/exportHelper.js';
import {BDropdown, BDropdownItem} from "bootstrap-vue-3";
import router from "@/router/index.js";

export default {
  components: { BDropdown, BDropdownItem },
  data() {
    return {
      customers: [],
      filters: {
        startDate: '',
        endDate: '',
        gender: ''
      }
    };
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.fetchCustomers();
      }
    }
  },
  methods: {
    router() {
      return router
    },
    // ... your existing methods

    async fetchCustomers() {
      try {
        const queryParams = new URLSearchParams();

        if (this.filters.startDate) {
          queryParams.append('start', this.filters.startDate);
        }
        if (this.filters.endDate) {
          queryParams.append('end', this.filters.endDate);
        }
        if (this.filters.gender) {
          queryParams.append('gender', this.filters.gender);
        }

        const response = await customerService.getCustomersByParam(queryParams);
        this.customers = response.data.customers;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    deleteCustomer(uuid) {
      if (!this.dontAskAgain) {
        const userConfirmed = confirm(
          "Are you sure you want to delete this customer?\n\nCheck 'Don't ask again' to skip this confirmation in the future."
        );
        if (!userConfirmed) return;

        const dontAsk = confirm("Don't ask again for deletions?");
        if (dontAsk) {
          localStorage.setItem("dontAskDelete", "true");
          this.dontAskAgain = true;
        }
      }

      try {
        customerService.deleteCustomer(uuid);
        alert("Customer deleted successfully!");
        this.fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer.");
      }
    },
    resetFilters() {
      this.filters = {
        startDate: '',
        endDate: '',
        gender: ''
      };
    },
    async exportData(fileType, region) {
      switch(fileType) {
        case 'csv':
          exportHelper.exportCsv('customers', region);
          break;
        case 'json':
          exportHelper.exportJson('customers');
          break;
        case 'xml':
          exportHelper.exportXml('customers');
          break;
      }
    }
  },
  created() {
    this.fetchCustomers();
  }
};
</script>