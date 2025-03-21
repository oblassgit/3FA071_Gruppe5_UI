<!-- src/components/ReadingForm.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="card-title mb-4">{{ isEditing ? 'Edit Reading' : 'New Reading' }}</h2>
        <form @submit.prevent="saveReading">
          <div class="row">
            <div class="mb-3">
              <CustomerSearch
                  v-model="reading.customer"
                  label="Select Customer"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Date of Reading</label>
              <input type="date" v-model="reading.dateOfReading" class="form-control" required :max="today">
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Meter ID</label>
              <input type="text" v-model="reading.meterId" class="form-control">
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Meter Count</label>
              <input type="number" v-model="reading.meterCount" class="form-control" required step="0.01">
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Kind of Meter</label>
              <select v-model="reading.kindOfMeter" class="form-select" required>
                <option value="HEIZUNG">Heating</option>
                <option value="STROM">Electricity</option>
                <option value="WASSER">Water</option>
                <option value="UNBEKANNT">Unknown</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <div class="form-check mt-4">
                <input type="checkbox" v-model="reading.substitute" class="form-check-input" id="substitute">
                <label class="form-check-label" for="substitute">Substitute Reading</label>
              </div>
            </div>

            <div class="col-12 mb-3">
              <label class="form-label">Comment</label>
              <textarea v-model="reading.comment" class="form-control" rows="3"></textarea>
            </div>
          </div>

          <div class="mt-3">
            <button type="submit" class="btn btn-primary me-2">Save</button>
            <router-link to="/readings" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import readingService from '@/api/readingService';
import customerService from '@/api/customerService';
import CustomerSearch from "@/components/CustomerSearch.vue";

export default {
  components: {CustomerSearch},
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      reading: {
        customer: null,
        dateOfReading: new Date().toISOString().split('T')[0],
        meterId: '',
        substitute: false,
        meterCount: 0,
        kindOfMeter: 'UNBEKANNT',
        comment: ''
      },
      customers: []
    };
  },
  computed: {
    isEditing() {
      return !!this.id;
    },
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },
  async created() {
    try {
      this.customers = (await customerService.getAllCustomers()).data.customers;

      if (this.isEditing) {
        const response = await readingService.getReading(this.id);
        const reading = response.data.reading; // Access the reading property from the response

        // Map the existing reading data to the form
        this.reading = {
          customer: reading.customer,
          dateOfReading: reading.dateOfReading.split('T')[0], // Format date for input
          meterId: reading.meterId || '',
          substitute: reading.substitute || false,
          meterCount: reading.meterCount || 0,
          kindOfMeter: reading.kindOfMeter || 'UNBEKANNT',
          comment: reading.comment || ''
        };
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
      this.$router.push('/readings');
    }
  },
  methods: {
    async saveReading() {
      try {
        if (this.isEditing) {
          await readingService.updateReading(this.id, this.reading);
        } else {
          await readingService.createReading(this.reading);
        }
        this.$router.push('/readings');
      } catch (error) {
        console.error('Error saving reading:', error);
        alert('Failed to save reading');
      }
    }
  }
};
</script>