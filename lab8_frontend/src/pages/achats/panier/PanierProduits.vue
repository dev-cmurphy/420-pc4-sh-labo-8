<template>
    <div id="cart-pane">
        <h2>Panier</h2>
        <div v-if="session.user">
            <div id="cart-items">
                <!-- cart est maintenant un objet plutôt qu'un simple tableau. La liste des items du panier
                 est dans sa propriété items (voir le module Cart.js). -->
                <ItemPanier v-for="cartitem in cart.items" :key="cartitem.product.id" v-bind="cartitem" />
            </div>
            <div id="cart-summary">
                Total: <span id="cart-total">{{ calculatedTotal }}</span>
            </div>
            <button @click="checkout">Passer à la caisse</button>
        </div>
        <div v-else>
            Vous devez être connecté afin de voir le panier
        </div>
    </div>
</template>

<script>
import { formatCurrency } from '../../../text_format';
import ItemPanier from './ItemPanier.vue';
import session from '../../../session';

export default {
    components: {
        ItemPanier: ItemPanier
    },
    inject: ['cart'],
    data: function () {
        return {
            session: session
        };
    },
    computed: {
        /**
         * Propriété calculée donnant le montant total du panier
         */
        calculatedTotal() {
            // La méthode pour calculer le montant total du panier est désormais dans l'objet
            // cart qui est défini dans le module Cart.js. On l'expose ici comme une propriété
            // calculée. Puisque l'objet cart est réactif, Vue.js saura qu'il a besoin d'invoquer
            // la propriété calculée uniquement si le contenu de l'objet cart change.
            const total = this.cart.calculateTotal();
            return formatCurrency(total);
        }
    },
    methods: {
        checkout() {
            this.$router.push('/checkout');
        }
    }
}
</script>

<style scoped>
#cart-pane {
    flex-basis: 30%;
    border: 1px solid black;
    padding: 10px;
}
</style>
