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
  </div>
</template>

<script>
import customerService from "@/api/customerService";

export default {
  data() {
    return {
      customers: [],
    };
  },
  async created() {
    const response = await customerService.getAllCustomers();
    this.customers = response.data.customers;
    debugger;
  },
  methods: {
    async deleteCustomer(uuid) {
      await customerService.deleteCustomer(uuid);
      this.customers = this.customers.filter((customer) => customer.uuid !== uuid);
    },
  },
};
</script>