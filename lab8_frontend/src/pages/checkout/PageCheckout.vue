<template>
    <div v-if="session.user">
        <SommairePanier />
        <FormulaireCheckout v-if="!isCartEmpty"/>
    </div>
    <div v-else class="boxed">
        Vous devez être connecté pour passer une commande
    </div>
</template>

<script>
import SommairePanier from './SommairePanier.vue';
import FormulaireCheckout from './FormulaireCheckout.vue';
import session from '../../session';

export default {
    components: {
        SommairePanier,
        FormulaireCheckout
    },
    data: function() {
        return {
            session: session
        };
    },
    inject: ['cart'],
    computed: {
        isCartEmpty() {
            return this.cart.items.length === 0;
        }
    }
}
</script>
