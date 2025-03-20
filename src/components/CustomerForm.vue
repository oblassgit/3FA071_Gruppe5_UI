<template>
  <div class="container mt-4" tabindex="0" ref="container" @keyup.esc.prevent="router().back()">
    <h1 class="mb-4 text-center">{{ isEdit ? "Edit Customer" : "Add Customer" }}</h1>
    <div class="card shadow p-4">
      <form @submit.prevent="saveCustomer" @keyup.enter="saveCustomer">
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
                :max="today"
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
        <div class="d-flex gap-2 mt-4">
          <button type="button" @click="$router.back()" class="btn btn-secondary">
            Cancel <span class="key-symbol">esc</span>
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? "Update" : "Create" }} <span class="key-symbol">⏎</span>
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
  computed: {
    today() {
      return new Date().toISOString().split("T")[0];
    },
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
    router() {
      return this.$router;
    },
    async saveCustomer() {
      const wrappedCustomer = {
        customer: this.customer, // Wrap the customer data
      };
      console.log("Saving customer:", this.customer);
      try {
        if (this.isEdit) {
          await customerService.updateCustomer(wrappedCustomer);
        } else {
          await customerService.createCustomer(wrappedCustomer);
        }
        this.$router.push("/customers"); // Redirect to customer list
      } catch (error) {
        console.error("Error saving customer:", error);
      }
    },
  },
};
</script>

<style scoped>
.key-symbol {
  font-size: 0.75em;
  opacity: 0.8;
}
</style>