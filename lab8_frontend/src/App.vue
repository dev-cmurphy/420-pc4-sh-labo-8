<template>
    <EnteteNavigation />
    <router-view></router-view>
</template>

<script>
import { computed } from 'vue';

import EnteteNavigation from './components/EnteteNavigation.vue';

import { cart } from './CartService';

export default {
    components: {
        EnteteNavigation
    },
    data: function () {
        return {
            cart: cart
        };
    },
    methods: {
    },
    provide() {
        return {
            cart: this.cart
        };
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}

html {
    font-family: sans-serif;
}
</style>
