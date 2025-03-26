import React from 'react'
import placeholderImage from "../assets/placeholderItem.jpg"
import { useContext, createContext, useState, useEffect } from "react";

function ProductCard() {
    const [product, setProduct] = useState(JSON.parse(localStorage.getItem("itemData")));
    return(
        <div class="flex flex-nowrap items-center gap-100 border-b-5 border-solid border-green-500">
            {
            <img align="left"
            src={placeholderImage}
            width={175}
            height={175}
            alt="katherine johnson"
            />}
            <h2>
                {product[0].name}
                <br />
                Price per Unit: ${product[0].price}
                <br />
                Weight: {product[0].pounds} lbs
                <br />
                Category: {product[0].category}
                <br />
            </h2>
        </div>
    );
}

export default ProductCard;