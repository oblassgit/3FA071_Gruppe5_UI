<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">
        <h1 class="mb-4">Reading Details</h1>

        <div class="row g-3">
          <!-- Customer Info -->
          <div class="col-md-6">
            <h5>Customer</h5>
            <p class="mb-3">
              {{ reading.customer ? `${reading.customer.firstName} ${reading.customer.lastName}` : 'N/A' }}
            </p>
          </div>

          <!-- Reading Date -->
          <div class="col-md-6">
            <h5>Date of Reading</h5>
            <p>{{ reading.dateOfReading ? new Date(reading.dateOfReading).toLocaleDateString() : 'N/A' }}</p>
          </div>

          <!-- Meter Details -->
          <div class="col-md-6">
            <h5>Meter ID</h5>
            <p>{{ reading.meterId || 'N/A' }}</p>
          </div>

          <div class="col-md-6">
            <h5>Meter Count</h5>
            <p>{{ reading.meterCount }}</p>
          </div>

          <div class="col-md-6">
            <h5>Type</h5>
            <span :class="getMeterTypeClass(reading.kindOfMeter)">
              {{ reading.kindOfMeter }}
            </span>
          </div>

          <div class="col-md-6">
            <h5>Substitute</h5>
            <p>{{ reading.substitute ? 'Yes' : 'No' }}</p>
          </div>

          <!-- Comment -->
          <div class="col-12">
            <h5>Comment</h5>
            <p>{{ reading.comment || 'No comment' }}</p>
          </div>
        </div>

        <div class="mt-4 d-flex gap-2">
          <button @click="$router.back()" class="btn btn-secondary">
            Back
          </button>
          <router-link :to="`/readings/edit/${reading.uuid}`" class="btn btn-warning">
            Edit
          </router-link>
          <button @click="handleDelete" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import readingService from '@/api/readingService';

export default {
  props: ['id'],
  data() {
    return {
      reading: {},
      dontAskAgain: localStorage.getItem('dontAskDelete') === 'true'
    };
  },
  async created() {
    try {
      const response = await readingService.getReading(this.id);
      this.reading = response.data.reading;
    } catch (error) {
      console.error('Error fetching reading:', error);
      alert('Failed to load reading details');
      this.$router.push('/readings');
    }
  },
  methods: {
    getMeterTypeClass(type) {
      const classes = {
        HEIZUNG: 'badge bg-danger',
        STROM: 'badge bg-warning',
        WASSER: 'badge bg-info',
        UNBEKANNT: 'badge bg-secondary'
      };
      return classes[type] || classes.UNBEKANNT;
    },
    async handleDelete() {
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
        await readingService.deleteReading(this.id);
        this.$router.push('/readings');
      } catch (error) {
        console.error('Error deleting reading:', error);
        alert('Failed to delete reading');
      }
    }
  }
};
</script>

<style scoped>
.badge {
  padding: 0.5em 1em;
}
</style>