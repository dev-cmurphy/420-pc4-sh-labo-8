import session from './session';

const convertToProduct = jsonProduct => {
    return {
        id: jsonProduct.id,
        name: jsonProduct.name,
        price: +jsonProduct.price,
        desc: jsonProduct.desc,
        image: jsonProduct.image,
        longDesc: jsonProduct.longDesc
    };
};

/**
 * Récupère depuis l'API back-end la liste de tous les produits du catalogue
 * 
 * @returns Promesse permettant d'obtenir la liste des produits
 */
export async function fetchProducts() {
    const response = await fetch('/api/products');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(p => convertToProduct(p));
    } else {
        throw new Error("Impossible de récupérer la liste des produits");
    }
}

/**
 * Récupère depuis l'API back-end un produit individuel du catalogue
 * 
 * @param {String} productId L'identifiant du produit à récupérer
 * @returns Promesse permettant d'obtenir le produit demandé
 */
export async function fetchProduct(productId) {
    const response = await fetch(`/api/products/${productId}`);

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw new Error(`Produit ${productId} introuvable`);
    }
};

export async function updateProduct(product) {
    const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw new Error(`Impossible d'éditer le produit ${product.id}: ${response.status}`);
    }
}

export async function createProduct(product) {
    const response = await fetch(`/api/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw new Error(`Impossible d'ajouter le produit ${product.id}: ${response.status}`);
    }
}


export async function updateProductImage(productId, formData) {
    const response = await fetch(`/api/products/${productId}/image`, {
        method: "POST",
        headers: {
            ...session.getAuthHeaders()
        },
        body: formData
    });

    if (response.ok) {
        return;
    } else {
        throw new Error(`Impossible de modifier l'image du produit ${productId}: ${response.status}`);
    }
}
