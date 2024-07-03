import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import PageAchats from './pages/achats/PageAchats.vue';
import ItemCatalogueDetail from './pages/ItemCatalogueDetail.vue';
import PageCheckout from './pages/checkout/PageCheckout.vue';
import NewItemCatalogue from './pages/NewItemCatalogue.vue';
import FormulaireLogin from './pages/FormulaireLogin.vue';

const app = createApp(App);

// Déclaration de Vue Router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component: PageAchats },
        { path: '/products/:id', component: ItemCatalogueDetail, props: true },
        { path: '/checkout', component: PageCheckout },
        { path: '/admin/new-product', component: NewItemCatalogue },
        { path: '/login', component: FormulaireLogin }
    ]
});

// Ajout de Vue Router à l'application
app.use(router);

app.mount("#app");
