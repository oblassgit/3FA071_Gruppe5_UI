import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import CustomerList from "@/components/CustomerList.vue";
import CustomerForm from "@/components/CustomerForm.vue";
import CustomerDetail from "@/components/CustomerDetail.vue";
import ReadingList from "@/components/ReadingList.vue";
import ReadingForm from "@/components/ReadingForm.vue";
import ReadingDetail from "@/components/ReadingDetail.vue";
import ImportCustomer from "@/components/ImportCustomer.vue";
import ImportReading from "@/components/ImportReading.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/customers", component: CustomerList },
    { path: "/customers/new", component: CustomerForm },
    { path: "/customers/:id", component: CustomerDetail, props: true, name: "customerDetail" },
    { path: "/customers/edit/:id", component: CustomerForm, props: true },
    { path: "/readings", component: ReadingList },
    { path: "/readings/new", component: ReadingForm },
    { path: "/readings/:id", component: ReadingDetail, props: true },
    { path: "/readings/edit/:id", component: ReadingForm, props: true },
    { path: "/customers/importCustomer", component: ImportCustomer},
    { path: "/customers/importReading", component: ImportReading}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;