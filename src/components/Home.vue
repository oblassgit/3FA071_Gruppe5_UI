<template>
  <div class="main-container">
    <div class="text-center">
      <h1>Welcome</h1>
      <div class="d-flex gap-3 mt-3">
        <router-link to="/customers" class="btn btn-primary">
          Navigate to Customers
        </router-link>
        <router-link to="/readings" class="btn btn-primary">
          Navigate to Reading
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 104px - 88px); /* Subtracting header and footer heights */
  padding: 0 15px; /* Optional: Adjust the padding for responsive design */
}

h1 {
  margin-bottom: 20px;
}

.d-flex {
  display: flex;
  gap: 1rem;
}
</style>