import React, { useEffect, useContext, useState, useCallback } from "react";
import { userContex } from "./userContex";
import Order from "./order";
import { OrderService, ProductService } from "./services.js";

/*let getPreviousOrder = (order) => {
    return order.filter((ord) => ord.isPaymentComplete === true);
}
let getCurrentOrder = (order) => {
    return order.filter((ord) => ord.isPaymentComplete === false);
}*/
let DashBoard = () => {
    let [orders, setOrders] = useState([]);
    let userContext = useContext(userContex);
    let [orderPlaced, setOrderPlaced] = useState(false);
    let [orderDelete, setOrderDelete] = useState(false);

    let loadDataFromDatabase = useCallback(async () => {
        let orderResponse = await fetch(`http://localhost:4500/orders?userId=${userContext.user.currentUserId}`, { method: "GET" });
        if (orderResponse.ok) {
            let orderResponseBody = await orderResponse.json();
            //let productsResponse = await fetch("http://localhost:4500/products", { method: "GET" });
            let productsResponse = await ProductService.fetchProduct();
            if (productsResponse.ok) {
                let productsResponseBody = await productsResponse.json();
                console.log("productsResponseBody", productsResponseBody);
                console.log("orderResponseBody", orderResponseBody);
                orderResponseBody.forEach((order) => {
                    //order.product = productsResponseBody.find((prod) => prod.id === order.productId);
                    order.product = ProductService.getProductByProductId(productsResponseBody, order.productId);
                });
                setOrders(orderResponseBody);
            }
        }
    }, [userContext.user.currentUserId]);

    useEffect(() => {
        document.title = "DashBoard-Ecommerce";
        loadDataFromDatabase();
    }, [userContext.user.currentUserId, loadDataFromDatabase]);

    let onBuyNowClick = useCallback(async (userId, productId, orderId, quantity) => {
        if (window.confirm("You want to buy this product?")) {
            let updatedData = {
                id: orderId,
                userId: userId,
                productId: productId,
                quantity: quantity,
                isPaymentComplete: true
            }
            let response = await fetch(`http://localhost:4500/orders/${orderId}`, {
                method: "PUT",
                body: JSON.stringify(updatedData),
                headers: { "Content-type": "application/json" }
            });
            let responseBody = await response.json();
            if (response.ok) {
                setOrderPlaced(true);
                loadDataFromDatabase();
            }
        }

    }, [loadDataFromDatabase]);

    let onDeleteClick = useCallback(async (orderId) => {
        if (window.confirm("are you sure, you want to delete?")) {
            let response = await fetch(`http://localhost:4500/orders/${orderId}`, { method: "DELETE" });
            let responseBody = await response.json();
            if (response.ok) {
                setOrderDelete(true);
                loadDataFromDatabase();
            }
        }
    }, [loadDataFromDatabase]);

    return (
        <div className="row">
            <div className="col-12 py-4 header">
                <h4>
                    <i className="fa fa-dashboard"></i>Dashboard{"  "}
                    <button className="btn btn-sm btn-info" onClick={loadDataFromDatabase}>
                        <i className="fa fa-refresh"></i>Refresh
                    </button>
                </h4>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-md-6">
                        <h4 className="py-2 my-2 text-info border-bottom border-info">
                            <i className="fa fa-history"></i>Previous Order {" "}
                            <span className="badge badge-info">{OrderService.getPreviousOrder(orders).length}</span>
                        </h4>

                        {OrderService.getPreviousOrder(orders).length === 0 ? <div className="text-danger">No Order</div> : ""}
                        {OrderService.getPreviousOrder(orders).map((ord) => {
                            return <Order key={ord.id}
                                userId={ord.userId}
                                orderId={ord.id}
                                productId={ord.productId}
                                quantity={ord.quantity}
                                isPaymentComplete={ord.isPaymentComplete}
                                productName={ord.product.productName}
                                price={ord.product.price}
                                onBuyNowClick={onBuyNowClick}
                                onDeleteClick={onDeleteClick}
                            />
                        })}
                    </div>
                    <div className="col-md-6">
                        <h4 className="py-2 my-2 text-primary border-bottom border-primary">
                            <i className="fa fa-shopping-cart"></i>Cart{" "}
                            <span className="badge badge-primary">{OrderService.getCurrentOrder(orders).length}</span>
                        </h4>
                        {orderPlaced ? <div className="alert alert-success alert-dismissible fade show mt-1" role="alert">Your order has been placed
                            <button className="close" type="button" data-dismiss="alert">
                                <span>&times;</span>
                            </button>
                        </div> : ""}
                        {orderDelete ? <div className="alert alert-danger alert-dismissible fade show mt-1" role="alert">
                            Your order has been delete
                            <button className="close" type="button" data-dismiss="alert">
                                <span>&times;</span></button></div> : ""}
                        {OrderService.getCurrentOrder(orders).length === 0 ? <div className="text-danger">No Product In Your Cart</div> : ""}
                        {OrderService.getCurrentOrder(orders).map((ord) => {
                            return <Order key={ord.id}
                                userId={ord.userId}
                                orderId={ord.id}
                                productId={ord.productId}
                                quantity={ord.quantity}
                                isPaymentComplete={ord.isPaymentComplete}
                                productName={ord.product.productName}
                                price={ord.product.price}
                                onBuyNowClick={onBuyNowClick}
                                onDeleteClick={onDeleteClick}
                            />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DashBoard;