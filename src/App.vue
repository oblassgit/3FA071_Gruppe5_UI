<template>
  <div id="app">
    <header class="bg-blue-500 text-white p-4">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <div class="navbar-brand">Household-Hub</div>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/customers">Customers</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/readings">Readings</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main class="container mx-auto my-8">
      <router-view />
    </main>
    <footer class="bg-gray-200 text-center p-4 mt-auto">
      <p>&copy; Household-Hub 2025</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Add some global styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  text-decoration: underline;
}

.container {
  max-width: 800px;
}
</style>