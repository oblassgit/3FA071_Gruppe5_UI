import './assets/main.css'

import CustomerList from './components/CustomerList.vue'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

App.component('CustomerList', CustomerList)
