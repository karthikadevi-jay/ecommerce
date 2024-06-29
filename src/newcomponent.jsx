import React, { useState } from "react";

function New() {
    const [counter, setCounter] = useState(1);
    const onClickHandel = () => {
        setCounter(counter + 1);
        setCounter(counter + 1);
        setCounter(counter + 1);
        setCounter(counter + 1);
    }
    return (
        <div>
            <span>{counter}</span>
            <button onClick={onClickHandel}>increment</button>
        </div>
    )
}
export default New;