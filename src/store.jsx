import React, { useState, useEffect, useContext } from "react";
import { BrandService, Categories, ProductService } from "./services";
import { userContex } from "./userContex";
import Product from "./product";
let Store = () => {
    let [brand, setBrand] = useState([]);
    let [catagory, setCatagory] = useState([]);
    let [product, setProduct] = useState([]);
    let [showProduct, setShowProduct] = useState([]);
    let [search, setSearch] = useState("");
    let userContext = useContext(userContex);
    useEffect(() => {
        (async () => {
            let brandResponse = await BrandService.fetchBrand();
            let brandResponseBody = await brandResponse.json();
            brandResponseBody.forEach((brand) => {
                brand.isChecked = true;
            });
            setBrand(brandResponseBody);

            let catagoryResponse = await Categories.fetchCategories();
            let catagoryResponseBody = await catagoryResponse.json();
            catagoryResponseBody.forEach((catagory) => {
                catagory.isChecked = true;
            });
            setCatagory(catagoryResponseBody);

            let productResponse = await fetch(`http://localhost:4500/products?productName_like=${search}`, { method: "GET" });
            let productResponseBody = await productResponse.json();
            if (productResponse.ok) {
                productResponseBody.forEach((prod) => {
                    prod.brand = BrandService.getBrandByBrandId(brandResponseBody, prod.brandId);
                    prod.catagory = Categories.getCatagoryById(catagoryResponseBody, prod.categoryId);
                    prod.isOrdered = false;
                });
            }
            setProduct(productResponseBody);
            setShowProduct(productResponseBody);
            document.title = "store-eCommerce";
        })();
    }, [search]);

    let updateBrandCheck = (id) => {
        let brandData = brand.map((brd) => {
            if (brd.id == id) brd.isChecked = !brd.isChecked;
            return brd;
        });
        setBrand(brandData);
        console.log(brandData);
        console.log("showProduct", showProduct);
        updateShowProduct();
    }

    let updateCatagoryCheck = (id) => {
        let catagoryData = catagory.map((cata) => {
            if (cata.id == id) cata.isChecked = !cata.isChecked;
            return cata;
        });
        setCatagory(catagoryData);
        console.log(catagoryData);
        updateShowProduct();
    }

    function updateShowProduct() {
        setShowProduct(
            product.filter((prod) => prod.catagory.isChecked && prod.brand.isChecked)
        );
    }

    let onAddToCartClick = (prod) => {
        (async () => {
            let newOrder = {
                userId: userContext.user.currentUserId,
                productId: prod.id,
                quantity: 1,
                isPaymentComplete: false
            }
            let orderResponse = await fetch("http://localhost:4500/orders", {
                method: "POST",
                body: JSON.stringify(newOrder),
                headers: { "content-type": "application/json" }
            });
            let orderResponseBody = await orderResponse.json();
            if (orderResponse.ok) {
                let prods = product.map((p) => {
                    if (p.id == prod.id) p.isOrdered = true;
                    return p;
                });
                setProduct(prods);
                updateShowProduct();
            }
            else {
                console.log(orderResponse);
            }
        })();
    }
    return (
        <div><div className="row">
            <div className="col-lg-3">
                <h3 className="store-h3"><i className="fa fa-shopping-bag mr-1"></i>Store{" "}
                    <span className="badge badge-secondary">{showProduct.length}</span>
                </h3>
            </div>
            <div className="col-lg-9">
                <input type="search" value={search} placeholder="search" className="form-control" autoFocus="autofocus"
                    onChange={(e) => { setSearch(e.target.value) }} />
            </div>
        </div>
            <div className="row">
                <div className="col-lg-3 py-2">
                    <div className=" my-2">
                        <h5>Brands</h5>
                        <ul className="list-group list-group-flush">
                            {brand.map((brand) => (<li className="list-group-item" key={brand.id}>
                                <input type="checkbox" value={true} id={`brand${brand.id}`}
                                    className="form-check-input"
                                    checked={brand.isChecked}
                                    onChange={() => { updateBrandCheck(brand.id) }} />
                                <label htmlFor={`brand${brand.id}`} className="form-check-label">{brand.brandName}</label>
                            </li>))}
                        </ul>
                    </div>
                    <div className="my-2">
                        <h5>Catagories</h5>
                        <ul className="list-group list-group-flush">
                            {catagory.map((catagory) => (<li className="list-group-item" key={catagory.id}>
                                <input type="checkbox" value={true}
                                    id={`catagory${catagory.id}`}
                                    className="form-check-input"
                                    checked={catagory.isChecked}
                                    onChange={() => { updateCatagoryCheck(catagory.id) }} />
                                <label htmlFor={`catagory${catagory.id}`} className="form-check-label">{catagory.categoryName}</label>
                            </li>))}
                        </ul>
                    </div>
                </div>
                <div className="col-lg-9">
                    <div className="row">
                        {showProduct.map((prod) => (
                            <Product key={prod.id} product={prod} onAddToCartClick={onAddToCartClick} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Store;   