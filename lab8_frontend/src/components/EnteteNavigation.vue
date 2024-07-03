<template>
    <header>
        <div class="container">
            <div class="title">
                <h1 class="green-title">Le Panier Vert</h1>
                <p>La boutique en ligne des choses qui sont vertes.</p>
            </div>
            <div class="nav">
                <span><router-link to="/">Achats</router-link></span>
                <span v-if="session.user"> | 
                    <router-link to="/checkout">Caisse</router-link>
                </span>
                <span v-if="session.user && session.user.isAdmin"> | 
                    <router-link to="/admin/new-product">Nouveau produit</router-link>
                </span>
            </div>
            <div class="panier">
                <div>Panier : {{ calculatedTotalItems }} articles</div>
                <div>Total : {{ calculatedTotal }}</div>
            </div>
            <div class="connexion">
                <div v-if="session.user">
                    <div>Bienvenue, {{ session.user.userFullName }}</div>
                    <div v-if="session.user.isAdmin" class="admin">ADMINISTRATEUR</div>
                    <div><a href="" @click.prevent="session.disconnect()">Déconnexion</a></div>
                </div>
                <div v-else><router-link to="/login">Se connecter</router-link></div>
            </div>
        </div>
    </header>
</template>

<script>
import { formatCurrency } from '../text_format';
import session from '../session';

export default {
    inject: ['cart'],
    data: function() {
        return {
            session: session
        };
    },
    computed: {
        calculatedTotal() {
            const total = this.cart.calculateTotal();
            return formatCurrency(total);
        },
        calculatedTotalItems() {
            return this.cart.calculateTotalItems();
        }
    }
}
</script>

<style scoped>
.green-title {
    color: green;
}

.container {
    display: flex;
    justify-content: space-between;
    padding: 0rem;
}

.title {
    flex-basis: 30%;
    padding: 0.3rem;
}

.nav {
    flex-basis: 40%;
    padding: 0.3rem;
}

.panier {
    flex-basis: 15%;
    padding: 0.3rem;
}

.connexion {
    flex-basis: 15%;
    padding: 0.3rem;
    text-align: right;
}

.admin {
    background-color: darkred;
    color: white;
    text-align: center;
}
</style>
