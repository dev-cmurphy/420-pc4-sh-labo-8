import { reactive, watch } from 'vue';

import session from './session';

const convertToCartItem = jsonCartItem => {
    const jsonProduct = jsonCartItem.product;

    return {
        product: {
            id: jsonProduct.id,
            name: jsonProduct.name,
            price: +jsonProduct.price,
            desc: jsonProduct.desc,
            image: jsonProduct.image
        },
        quantity: +jsonCartItem.quantity
    };
};

export const cart = reactive({
    userId: null,
    loading: false,
    itemsLoaded: false,
    loadError: false,
    items: [],
    initialFetch() {
        cart.userId = session.user ? session.user.userAccountId : null;
        if (this.userId) {
            this.fetchCart();
        } else {
            this.items = [];
        }
    },
    /**
     * Récupère les données du panier depuis le REST API (back-end). Le tableau items de l'objet courant sera
     * peuplé avec les items du panier lorsque le téléchargement est complété. Le champs itemsLoaded sera mis à true
     * également, afin d'indiquer que le chargement est terminé. Si une erreur quelconque survient, le champ
     * loadError sera mis à true afin d'indiquer qu'il y a un problème.
     * 
     * @return Promesse avec les données du panier chargées
     */
    async fetchCart() {
        if (!this.userId) {
            return;
        }

        this.loading = true;

        try {
            const response = await fetch(`/api/cart/${this.userId}`, {
                method: "GET",
                headers: {
                    // Ajoute l'en-tête pour s'authentifier avec Basic Auth
                    ...session.getAuthHeaders()
                }
            });

            if (response.ok) {
                const respJson = await response.json();

                this.items = respJson.map(item => convertToCartItem(item));
                this.itemsLoaded = true;
                this.loading = false;
                this.loadError = false;

                return this.items;
            } else {
                throw new Error("Impossible de récupérer le panier");
            }

        } catch (err) {
            console.error(err);
            this.loadError = true;
        }
    },
    /**
     * Ajoute un produit (selon son productId) au panier. L'ajout est géré côté back-end, on fait
     * un appel PUT au chemin /api/cart/:userId/:productId sans spécifier la quantité dans l'objet JSON
     * de la requête. Si le produit existe déjà dans le panier, le back-end s'occupera d'incrémenter
     * sa quantité de 1.
     * 
     * @param {String} productId L'identifiant du produit à ajouter
     */
    addToCart(productId) {
        if (!this.userId) {
            return;
        }

        // Ceci désactivera les actions qui modifient les données du panier (ajout, changement de quantité, retrait)
        // en attendant que le rechargement des données du panier soit complété.
        this.loading = true;

        fetch(`/api/cart/${this.userId}/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...session.getAuthHeaders()
            },
            body: JSON.stringify({})
        }).then((response) => {
            if (response.ok) {
                // On recharge le cart à partir du back-end afin que tout se mette à jour dans la page
                return this.fetchCart();
            } else {
                throw new Error(`Erreur ${response.status}`);
            }
        }).catch((error) => {
            console.error("Erreur", error);
        });
    },
    /**
     * Retire un produit du panier selon son productId. Si aucun produit avec ce productId n'existe,
     * la méthode n'a aucun effet. La suppression se fait depuis le back-end.
     * @param {String} productId L'identifiant du produit à retirer
     */
    removeFromCart: function (productId) {
        if (!this.userId) {
            return;
        }

        // Ceci désactivera les actions qui modifient les données du panier (ajout, changement de quantité, retrait)
        // en attendant que le rechargement des données du panier soit complété.
        this.loading = true;

        fetch(`/api/cart/${this.userId}/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...session.getAuthHeaders()
            }
        }).then((response) => {
            if (response.ok) {
                // On recharge le cart à partir du back-end afin que tout se mette à jour dans la page
                this.fetchCart();
            } else {
                throw new Error(`Erreur ${response.status}`);
            }
        }).catch((error) => {
            console.error("Erreur", error);
        });
    },
    /**
     * Change la quantité d'un produit dans le panier.
     * @param {String} productId L'identifiant du produit dont on veut changer la quantité
     * @param {Number} newQuantity La nouvelle quantité
     */
    changeQuantity: function (productId, newQuantity) {
        if (!this.userId) {
            return;
        }

        // Ceci désactivera les actions qui modifient les données du panier (ajout, changement de quantité, retrait)
        // en attendant que le rechargement des données du panier soit complété.
        this.loading = true;

        const reqBody = {
            quantity: newQuantity
        };

        fetch(`/api/cart/${this.userId}/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...session.getAuthHeaders()
            },
            body: JSON.stringify(reqBody)
        }).then((response) => {
            if (response.ok) {
                // On recharge le cart à partir du back-end afin que tout se mette à jour dans la page
                this.fetchCart();
            } else if (response.status >= 400 && response.status < 500) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes("application/json")) {
                    response.json().then((body) => {
                        alert("Erreur: " + body.message);
                    });
                } else {
                    throw new Error(`Erreur ${response.status}`);
                }
            }
        }).catch((error) => {
            console.error("Erreur", error);
        });
    },
    /**
     * Calcule et retourne le prix total de tous les produits dans le panier
     * @returns Le prix total des produits dans le panier
     */
    calculateTotal() {
        let total = 0;
        this.items.forEach((item) => {
            total = total + item.quantity * item.product.price;
        });

        return total;
    },
    /**
     * Retourne le nombre total d'articles dans le panier
     * @returns Le nombre d'articles dans le panier
     */
    calculateTotalItems() {
        let total = 0;
        this.items.forEach((item) => {
            total = total + item.quantity;
        });

        return total;
    }
});

watch(() => session.user, (newUser, oldUser) => {
    cart.initialFetch();
});

cart.initialFetch();
