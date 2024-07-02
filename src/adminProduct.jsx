import React, { useState, useEffect, useMemo } from "react";
import { BrandService, Categories, SortService } from "./services";

let AdminProduct = () => {
    let [search, setSearch] = useState("");
    let [products, setProducts] = useState([]);
    let [sortProduct, setSortProduct] = useState([]);
    let [sortBy, setSortBy] = useState("");
    let [sortOrder, setSortOrder] = useState("ASC");
    let [brands, setBrands] = useState([]);
    let [selectBrand, setSelectBrand] = useState("");
    useEffect(() => {
        (async () => {
            let brandResponse = await BrandService.fetchBrand();
            let brandResponseBody = await brandResponse.json();
            setBrands(brandResponseBody)
                ;
            let catagoryResponse = await Categories.fetchCategories();
            let catagoryResponseBody = await catagoryResponse.json();

            let productsResponse = await fetch(` http://localhost:4500/products?productName_like=${search}&_sort=productName&_order="ASC"`, { method: "GET" });
            let productsResponseBody = await productsResponse.json();
            if (productsResponse.ok) {

                productsResponseBody.forEach((product) => {
                    product.brand = BrandService.getBrandByBrandId(brandResponseBody, product.brandId);
                    product.catagory = Categories.getCatagoryById(catagoryResponseBody, product.categoryId);
                });
                setProducts(productsResponseBody);
                setSortProduct(productsResponseBody);
            }
        })();
    }, [search]);
    let filterBySelectedBrand = useMemo(() => {
        return sortProduct.filter((prod) => prod.brand.brandName.indexOf(selectBrand) >= 0);
    }, [sortProduct, selectBrand]);

    let onSortClick = (event, cloumnName) => {
        event.preventDefault();
        setSortBy(cloumnName);
        //setSortOrder(sortOrder == "ASC" ? "DESC" : "ASC");
        let newSortOrder = sortOrder == "ASC" ? "DESC" : "ASC";
        setSortOrder(newSortOrder);
    }

    useEffect(() => {
        setProducts(SortService.sortProductService(filterBySelectedBrand, sortBy, sortOrder));
    }, [filterBySelectedBrand, sortBy, sortOrder]);

    let getColumnHeader = (columnName, displayName) => {
        return (
            <React.Fragment>
                <a href="/#" onClick={(event) => onSortClick(event, columnName)} >{displayName}</a> {" "}
                {sortBy == columnName && sortOrder == "ASC" ? (<i className="fa fa-sort-up"></i>) : ""}
                {sortBy == columnName && sortOrder == "DESC" ? (<i className="fa fa-sort-down"></i>) : ""}
            </React.Fragment>
        )
    }
    return (
        <div>
            <div className="row header">
                <div className="col-lg-3">
                    <h4><i className="fa fa-suitcase"></i>Products</h4>
                </div>
                <div className="col-lg-6">
                    <input type="search" className="form-control" placeholder="search" autoFocus="autofocus"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-lg-3">
                    <select className="form-control"
                        value={selectBrand}
                        onChange={(e) => { setSelectBrand(e.target.value) }}
                    >
                        <option key="" value={""}>All Brand</option>
                        {brands.map((brand) => <option key={brand.id} value={brand.brandName}>{brand.brandName}</option>)}
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-10 mx-auto mb-2">
                    <div className="card my-2 shadow">
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{getColumnHeader("productName", "Product Name")}</th>
                                        <th>{getColumnHeader("price", "Price")}</th>
                                        <th>{getColumnHeader("brand", "Brand")}</th>
                                        <th>{getColumnHeader("catagory", "Catagory")}</th>
                                        <th>{getColumnHeader("rating", "Rating")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        return (<tr key={product.id}>
                                            <td>{product.productName}</td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td>{product.brand.brandName}</td>
                                            <td>{product.catagory.categoryName}</td>
                                            <td>
                                                {[...Array(product.rating).keys()].map((n) => (<i className="fa fa-star text-warning" key={n}></i>))}
                                                {[...Array(5 - product.rating).keys()].map((n) => (<i className="fa fa-star-o text-warning" key={n}></i>))}
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminProduct;