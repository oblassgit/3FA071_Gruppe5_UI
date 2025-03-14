<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Customer List</h1>
      <router-link to="/customers/new" class="btn btn-primary">
        New Customer
      </router-link>
    </div>
    <div class="card shadow p-4">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <th>Birth Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="customers.length === 0">
          <td colspan="4" class="text-center text-muted">No customers found.</td>
        </tr>
        <tr v-else v-for="customer in customers" :key="customer.uuid"
            @click="router().push({ name: 'customerDetail', params: {id: customer.uuid}})">
            <td>{{ customer.firstName }}</td>
            <td>{{ customer.lastName }}</td>
            <td>{{ customer.gender }}</td>
            <td>{{ customer.birthDate }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import customerService from "@/api/customerService";
import router from "@/router/index.js";

export default {
  data() {
    return {
      customers: [],
      dontAskAgain: localStorage.getItem("dontAskDelete") === "true", // Load preference
    };
  },
  async created() {
    const response = await customerService.getAllCustomers();
    this.customers = response.data.customers;
  },
  methods: {
    router() {
      return router
    },
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
  },
};
</script>