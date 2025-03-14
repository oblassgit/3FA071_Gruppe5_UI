<template>
  <div class="container mt-4">
    <h1 class="mb-4">Customer List</h1>
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
          <td colspan="5" class="text-center text-muted">No customers found.</td>
        </tr>
        <tr v-else v-for="customer in customers" :key="customer.uuid">
          <td>{{ customer.firstName }}</td>
          <td>{{ customer.lastName }}</td>
          <td>{{ customer.gender }}</td>
          <td>{{ customer.birthDate }}</td>
          <td>
            <router-link :to="'/customers/' + customer.uuid" class="btn btn-sm btn-info">View</router-link>
            <router-link :to="'/customers/edit/' + customer.uuid" class="btn btn-sm btn-warning ms-2">Edit</router-link>
            <button @click="deleteCustomer(customer.uuid)" class="btn btn-sm btn-danger ms-2">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
    <b-dropdown id="dropdown-export" text="Export" variant="primary">
      <b-dropdown-item @click="Export('CSV')">CSV</b-dropdown-item>
      <b-dropdown-item @click="Export('JSON')">JSON</b-dropdown-item>
      <b-dropdown-item @click="Export('XML')">XML</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import customerService from "@/api/customerService";
import {BDropdown, BDropdownItem} from "bootstrap-vue-3";

export default {
  components: {BDropdown, BDropdownItem},
  data() {
    return {
      customers: [],
      dontAskAgain: localStorage.getItem("dontAskDelete") === "true", // Load preference
    };
  },
  async created() {
    const response = await customerService.getAllCustomers();
    this.customers = response.data.customers;
    debugger;
  },
  methods: {
    async deleteCustomer(uuid) {
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
        await customerService.deleteCustomer(uuid);
        alert("Customer deleted successfully!");
        this.customers = this.customers.filter((customer) => customer.uuid !== uuid);
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    },
    async Export() {
      alert('Export');

    }
  },
};
</script>