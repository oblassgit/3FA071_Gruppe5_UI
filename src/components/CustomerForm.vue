<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center">{{ isEdit ? "Edit Customer" : "Add Customer" }}</h1>
    <div class="card shadow p-4">
      <form @submit.prevent="saveCustomer">
        <div class="row">
          <!-- First Name -->
          <div class="col-md-6 mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input
                id="firstName"
                type="text"
                v-model="customer.firstName"
                required
                class="form-control"
            />
          </div>

          <!-- Last Name -->
          <div class="col-md-6 mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input
                id="lastName"
                type="text"
                v-model="customer.lastName"
                required
                class="form-control"
            />
          </div>
        </div>

        <div class="row">
          <!-- Birth Date -->
          <div class="col-md-6 mb-3">
            <label for="birthDate" class="form-label">Birth Date</label>
            <input
                id="birthDate"
                type="date"
                v-model="customer.birthDate"
                class="form-control"
            />
          </div>

          <!-- Gender -->
          <div class="col-md-6 mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select
                id="gender"
                v-model="customer.gender"
                required
                class="form-select"
            >
              <option disabled value="">Select Gender</option>
              <option value="D">Diverse</option>
              <option value="M">Male</option>
              <option value="U">Undefined</option>
              <option value="W">Female</option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary w-100">
            {{ isEdit ? "Update" : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import customerService from "@/api/customerService";

export default {
  props: ["id"],
  data() {
    return {
      customer: {
        uuid: null,
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
      },
      isEdit: false,
    };
  },
  async created() {
    console.log("Received ID from route:", this.id); // Debugging log
    if (this.id) {
      this.isEdit = true;
      try {
        const response = await customerService.getCustomer(this.id);
        this.customer = response.data.customer; // ✅ Assign retrieved customer
        console.log("Loaded customer data:", this.customer);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    }
  },
  methods: {
    async saveCustomer() {
      console.log("Saving customer:", this.customer);
      try {
        if (this.isEdit) {
          await customerService.updateCustomer(this.customer);
        } else {
          await customerService.createCustomer(this.customer);
        }
        this.$router.push("/");
      } catch (error) {
        console.error("Error saving customer:", error);
      }
    },
  },
};
</script>