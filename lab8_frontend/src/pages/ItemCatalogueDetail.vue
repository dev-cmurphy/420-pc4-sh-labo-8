<template>
    <LoadingSpinner :loading="loading" :error="loadError" :errorMessage="errorMessage" />
    <div v-if="product" class="product">
        <img v-bind:src="imageSrc" />
        <div class="product-info" v-if="!edition">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">{{ formattedPrice }}</div>
            <div class="product-description">{{ product.desc }}</div>
            <div class="product-long-desc">{{ product.longDesc }}</div>
            <button type="button" v-if="session.user && session.user.isAdmin" @click="enableEdit">Éditer</button>
        </div>
        <div class="product-info" v-if="edition">
            <form @submit.prevent="submitUpdatedProduct">
                <div>
                    <div>
                        <label for="product-name">Nom du produit: </label>
                    </div>
                    <div>
                        <input class="product-name" id="product-name" v-model="product.name" />
                    </div>
                </div>
                <div>
                    <div>
                        <label for="product-price">Prix: </label>
                    </div>
                    <div>
                        <input class="product-price" id="product-price" type="number" step="0.01" v-model="product.price" />
                    </div>
                </div>
                <div>
                    <div>
                        <label for="product-description">Description: </label>
                    </div>
                    <div>
                        <input class="product-description" id="product-description" v-model="product.desc" />
                    </div>
                </div>
                <div>
                    <div>
                        <label for="product-long-desc">Description longue: </label>
                    </div>
                    <div>
                        <textarea class="product-long-desc" id="product-long-desc" v-model="product.longDesc"></textarea>
                    </div>
                </div>
                <button type="submit" v-if="session.user && session.user.isAdmin">Enregistrer</button>
                <button type="button" @click="cancelEdit">Annuler</button>
            </form>
            <hr />
            <form @submit.prevent="submitImage">
                <div>
                    <div>
                        <label for="product-image">Téléverser nouvelle image: </label>
                    </div>
                    <div>
                        <input type="file" id="product-image" accept="image/png, image/jpeg, image/gif" />
                    </div>
                    &nbsp;
                    <div>
                        <button type="submit">Soumettre</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { formatCurrency } from '../text_format';
import { fetchProduct, updateProduct, updateProductImage } from '../ProductService';
import { addApiPrefixToPath } from '../api_utils';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import session from '../session';

export default {
    components: {
        LoadingSpinner
    },
    props: {
        id: String
    },
    data() {
        return {
            session: session,
            loading: true,
            loadError: false,
            errorMessage: null,
            product: null,
            edition: false
        };
    },
    methods: {
        refreshProduct(id) {
            this.loadError = false;
            this.loading = true;
            this.errorMessage = null;
            this.product = null;

            fetchProduct(id).then(product => {
                this.product = product;
                this.loading = false;
            }).catch(err => {
                this.product = null;
                this.loadError = true;
                this.loading = false;
                this.errorMessage = err.message;
            });
        },
        enableEdit() {
            this.edition = true;
        },
        cancelEdit() {
            this.edition = false;
            this.refreshProduct(this.id);
        },
        async submitUpdatedProduct() {
            try {
                await updateProduct(this.product);
                this.edition = false;
                this.refreshProduct(this.id);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        async submitImage() {
            const formData = new FormData();
            const fileField = document.querySelector("input[id='product-image']");
            formData.append('product-image', fileField.files[0]);

            try {
                await updateProductImage(this.id, formData);
                this.edition = false;
                this.refreshProduct(this.id);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    },
    computed: {
        formattedPrice() {
            return formatCurrency(this.product.price);
        },
        imageSrc() {
            return addApiPrefixToPath(this.product.image);
        }
    },
    watch: {
        id(newId) {
            this.refreshProduct(newId);
        }
    },
    mounted() {
        this.refreshProduct(this.id);
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
