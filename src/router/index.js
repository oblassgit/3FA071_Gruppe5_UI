import { createRouter, createWebHistory } from "vue-router";
import CustomerList from "@/components/CustomerList.vue";
import CustomerForm from "@/components/CustomerForm.vue";
import CustomerDetail from "@/components/CustomerDetail.vue";
import importCSV from "@/components/importCSV.vue";

const routes = [
    { path: "/", component: CustomerList },
    { path: "/customers/new", component: CustomerForm },
    { path: "/customers/:id", component: CustomerDetail, props: true },
    { path: "/customers/edit/:id", component: CustomerForm, props: true },
    { path: "/customers/import", component: importCSV}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;