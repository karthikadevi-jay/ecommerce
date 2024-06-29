export const OrderService = {
    getPreviousOrder: (order) => {
        return order.filter((ord) => ord.isPaymentComplete === true);
    },
    getCurrentOrder: (order) => {
        return order.filter((ord) => ord.isPaymentComplete === false);
    }
}
export const ProductService = {
    getProductByProductId: (product, productId) => {
        return product.find((prod) => prod.id == productId);
    },
    fetchProduct: () => {
        return fetch("http://localhost:4500/products", { method: "GET" });
    }
}
export const BrandService = {
    fetchBrand: () => {
        return fetch("http://localhost:4500/brands", { method: "GET" });
    },
    getBrandByBrandId: (brands, brandId) => {
        return brands.find((brand) => (brand.id == brandId));
    }
}
export const Categories = {
    fetchCategories: () => {
        return fetch("http://localhost:4500/categories", { method: "GET" });
    },
    getCatagoryById: (catagories, catagoryId) => {
        return catagories.find((catagory) => (catagory.id == catagoryId));
    }
}
export const SortService = {
    sortProductService: (sortProduct, sortBy, sortOrder) => {
        if (!sortProduct) {
            return sortProduct;
        }
        console.log("sortProduct", sortProduct);
        let array = [...sortProduct];
        console.log("array", array);
        array.sort((a, b) => {
            if (a[sortBy] && b[sortBy]) {
                return a[sortBy].toString().toLowerCase() - b[sortBy].toString().toLowerCase();
            }
            else {
                return 0;
            }
        });
        if (sortOrder == "DESC") {
            array.reverse();
        }
        return array;
    }
}