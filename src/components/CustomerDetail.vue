<template>
  <div class="container mt-5">
    <h1 class="mb-4">Customer Details</h1>
    <div v-if="customer" class="card">
      <div class="card-body">
        <h5 class="card-title">{{ customer.firstName }} {{ customer.lastName }}</h5>
        <p class="card-text"><strong>Gender:</strong> {{ genderText }}</p>
        <p class="card-text"><strong>Birth Date:</strong> {{ formattedBirthDate }}</p>
        <p class="card-text"><strong>ID:</strong> {{ customer.uuid }}</p>

        <!-- Action Buttons -->
        <div class="mt-4 d-flex gap-2">
          <router-link to="/" class="btn btn-primary">Back to List</router-link>
          <router-link :to="'/customers/edit/' + customer.uuid" class="btn btn-warning">Edit</router-link>
          <button @click="deleteCustomer" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger">Customer not found.</div>
  </div>
</template>

<script>
import customerService from "@/api/customerService";

export default {
  props: ["id"],
  data() {
    return {
      customer: null,
      dontAskAgain: localStorage.getItem("dontAskDelete") === "true", // Load preference
    };
  },
  async created() {
    try {
      const response = await customerService.getCustomer(this.id);
      this.customer = response.data.customer;
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  },
  methods: {
    async deleteCustomer() {
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
        await customerService.deleteCustomer(this.id);
        alert("Customer deleted successfully!");
        this.$router.push("/");
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer.");
      }
    },
  },
  computed: {
    genderText() {
      if (!this.customer) return "";
      const genderMap = { M: "Male", W: "Female", D: "Diverse", U: "Undefined" };
      return genderMap[this.customer.gender] || "Unknown";
    },
    formattedBirthDate() {
      return this.customer ? moment(this.customer.birthDate).format("MMMM D, YYYY") : "";
    },
  },
};
</script>