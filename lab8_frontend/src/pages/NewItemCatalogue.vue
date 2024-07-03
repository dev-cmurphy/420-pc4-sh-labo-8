<template>
    <div class="product" v-if="session.user && session.user.isAdmin">
        <form @submit.prevent="submitNewProduct">
            <div>
                <div>
                    <label for="product-id">Identifiant unique du produit: </label>
                </div>
                <div>
                    <input class="product-id" id="product-id" v-model="productId" />
                </div>
            </div>
            <div>
                <div>
                    <label for="product-name">Nom du produit: </label>
                </div>
                <div>
                    <input class="product-name" id="product-name" v-model="productName" />
                </div>
            </div>
            <div>
                <div>
                    <label for="product-price">Prix: </label>
                </div>
                <div>
                    <input class="product-price" id="product-price" type="number" step="0.01" v-model="productPrice" />
                </div>
            </div>
            <div>
                <div>
                    <label for="product-description">Description: </label>
                </div>
                <div>
                    <input class="product-description" id="product-description" v-model="productDesc" />
                </div>
            </div>
            <div>
                <div>
                    <label for="product-long-desc">Description longue: </label>
                </div>
                <div>
                    <textarea class="product-long-desc" id="product-long-desc" v-model="productLongDesc"></textarea>
                </div>
            </div>
            <button type="submit">Ajouter</button>
        </form>
    </div>
    <div v-else>Vous n'avez pas les permissions pour voir cette page</div>
</template>

<script>
import session from '../session';
import { createProduct } from '../ProductService';

export default {
    data() {
        return {
            session: session,
            productId: '',
            productName: '',
            productPrice: 0,
            productDesc: '',
            productLongDesc: ''
        };
    },
    methods: {
        async submitNewProduct() {
            const product = {
                id: this.productId,
                name: this.productName,
                price: this.productPrice,
                desc: this.productDesc,
                longDesc: this.productLongDesc
            };

            try {
                await createProduct(product);
                this.$router.push('/products/' + this.productId);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    }
}
</script>

<style scoped>
.product {
    margin-bottom: 20px;
    border: 1px solid black;
    padding: 10px;
    overflow: hidden;
    clear: both;
}

.product img {
    float: left;
    margin-right: 10px;
    width: 15rem;
    object-fit: cover;
}

.product-info {
    float: left;
    width: 60%;
}

.product-name {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 5px;
}

.product-price {
    font-weight: bold;
    font-size: 1.2em;
    color: green;
}

.product-description {
    margin-top: 5px;
    font-size: 0.9em;
    font-weight: bold;
    color: #666;
}

.product-long-desc {
    margin-top: 5px;
    font-size: 0.9em;
    color: #666;
    white-space: pre-wrap;
}

textarea.product-long-desc {
    width: 100%;
    height: 15rem;
}

.product-add-to-cart {
    float: right;
    width: 40%;
    text-align: right;
    font-size: 1.2em;
    line-height: 2em;
}
</style>
