<template>
  <div class="position-relative">
    <label class="form-label">{{ label }}</label>
    <div class="input-group">
      <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          :placeholder="selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 'Search customer...'"
          @focus="showDropdown = true"
          @keydown.down.prevent="selectedIndex = Math.min(selectedIndex + 1, filteredCustomers.length - 1)"
          @keydown.up.prevent="selectedIndex = Math.max(selectedIndex - 1, -1)"
          @keydown.enter.prevent="selectCustomer(filteredCustomers[selectedIndex])"
      >
      <button class="btn btn-outline-secondary" type="button" @click="toggleDropdown">
        <i class="bi bi-chevron-down"></i>
      </button>
    </div>
    <div v-if="showDropdown" class="position-absolute w-100 mt-1 shadow bg-white border rounded-2 z-3">
      <div v-if="filteredCustomers.length > 0">
        <div v-for="(customer, index) in filteredCustomers"
             :key="customer.uuid"
             @click="selectCustomer(customer)"
             @mouseenter="selectedIndex = index"
             :class="['p-2 cursor-pointer', selectedIndex === index ? 'bg-light' : '']">
          {{ customer.firstName }} {{ customer.lastName }}
        </div>
      </div>
      <div v-else class="p-2 text-muted">
        No customers found
      </div>
    </div>
  </div>
</template>

<script>
import customerService from '@/api/customerService';

export default {
  name: 'CustomerSearch',
  props: {
    label: {
      type: String,
      default: 'Customer'
    },
    modelValue: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      customers: [],
      searchQuery: '',
      showDropdown: false,
      selectedIndex: -1,
      selectedCustomer: null
    };
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) return this.customers;
      const query = this.searchQuery.toLowerCase();
      return this.customers.filter(customer =>
          `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query)
      );
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.selectedCustomer = newValue;
          this.searchQuery = `${newValue.firstName} ${newValue.lastName}`;
        }
      }
    }
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await customerService.getAllCustomers();
        this.customers = response.data.customers;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) {
        this.searchQuery = '';
      }
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer;
      this.searchQuery = `${customer.firstName} ${customer.lastName}`;
      this.showDropdown = false;
      this.selectedIndex = -1;
      this.$emit('update:modelValue', customer);
    },
    reset() {
      this.searchQuery = '';
      this.selectedCustomer = null;
      this.showDropdown = false;
      this.selectedIndex = -1;
      this.$emit('update:modelValue', null);
    }

  },
  created() {
    this.fetchCustomers();
  }
};
</script>

<style scoped>
.z-3 {
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  background-color: #f8f9fa;
}
.input-group .btn-outline-secondary {
  border-color: #ced4da;
}
</style>