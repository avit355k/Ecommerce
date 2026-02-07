const getSortStage = (sort) => {
    switch (sort) {
        case "priceLowHigh":
            return { price: 1 };

        case "priceHighLow":
            return { price: -1 };

        case "newest":
            return { createdAt: -1 };

        case "discount":
            return { discountPercent: -1 };

        default:
            return { createdAt: -1 };
    }
};


module.exports = { getSortStage };
