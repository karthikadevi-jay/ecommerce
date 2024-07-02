import React from "react";
let Order = (props) => {
    console.log("order Rende", props);
    return (
        <div className="card my-3 shadow">
            <div className="card-body">
                <h6>
                    <i className="fa fa-arrow-right px-2"></i>{props.productName}
                    {props.isPaymentComplete == false ? <div className="float-right">
                        <button className="btn btn-sm btn-info mr-2"
                            onClick={() => props.onBuyNowClick(props.userId, props.productId, props.orderId, props.quantity)}>
                            <i className="fa fa-truck mr-1"></i>Buy Now</button>
                        <button className="btn btn-sm btn-danger mr-2" onClick={() => props.onDeleteClick(props.orderId)}><i className="fa fa-trash-o mr-1"></i>Delete</button>
                    </div> : ""}

                </h6>
                <table className="table table-sm table-borderless mt-1">
                    <tbody>
                        <tr>
                            <td style={{ width: "100px" }}>Quantity:</td>
                            <td>{props.quantity}</td>
                        </tr>
                        <tr>
                            <td style={{ width: "100px" }}>Price:</td>
                            <td>${props.price}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default React.memo(Order);