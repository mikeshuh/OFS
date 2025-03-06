import React from 'react'

function ProductCard() {
    return(
        <section>
            <img align="left"
            src="https://watermark.lovepik.com/photo/20211201/large/lovepik-celery-picture_501339548.jpg"
            width={175}
            height={175}
            alt="katherine johnson"
            />
            <h1>
                Celery
            </h1>
            <h2>
                Price per Unit: $3
                <br />
                Weight: 0.5 lbs
                <br />
                Category: Vegetables
                <br />
            </h2>
        </section>
    );
}

export default ProductCard;