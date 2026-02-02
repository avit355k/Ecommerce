import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import API from "../../services/api";

const VarientAdd = () => {
    const navigate = useNavigate();
    const { productId } = useParams();

    const [product, setProduct] = useState(null);

    const [price, setPrice] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [countInStock, setCountInStock] = useState("");

    const [attributes, setAttributes] = useState([{ name: "", value: "" }]);

    //fetch products
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/api/product/${productId}`);
                setProduct(res.data.data);
            } catch (error) {
                console.error(error);
                alert("Failed to load product");
            }
        };
        fetchProduct();
    }, [productId]);

    // add atributes
    const addAttributes = () => {
        setAttributes([...attributes, { name: "", value: "" }]);
    };

    // handle attribute change
    const handleAttributeChange = (index, key, value) => {
        const updated = [...attributes];
        updated[index][key] = value;
        setAttributes(updated);
    };

    // remove attribute
    const removeAttribute = (index) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    // save variant
    const handleSaveVariant = async () => {
        if (!price || countInStock === "") {
            alert("Price and Stock are required");
            return;
        }

        const attributesMap = {};
        attributes.forEach(attr => {
            if (attr.name && attr.value) {
                attributesMap[attr.name] = attr.value;
            }
        });

        try {
            await API.post(
                `/api/varient/product/${productId}/add`,
                {
                    price,
                    discountedPrice,
                    countInStock,
                    attributes: attributesMap,
                    isActive: true
                }
            );

            alert("Variant added successfully");
            navigate("/product/varient/list");

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to add variant");
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card p-4 mb-3">
                <h4>Add Product Variant</h4>
                <p className="text-muted">
                    Product: <b>{product?.name || "Loading..."}</b>
                </p>
            </div>

            <div className="form">
                <div className="row">
                    {/* LEFT SIDE */}
                    <div className="col-sm-6">
                        <div className="card p-4">
                            <h5 className="mb-4">Variant Information</h5>

                            <div className="form-group mb-3">
                                <h6>PRODUCT</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={product?.name || ""}
                                    disabled
                                />
                            </div>

                            <div className="form-group mb-3">
                                <h6>PRICE *</h6>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <h6>DISCOUNTED PRICE</h6>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={discountedPrice}
                                    onChange={(e) => setDiscountedPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <h6>COUNT IN STOCK *</h6>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-sm-6"> 
                        <div className="card p-4">

                            <h5 className="mb-4">Attributes</h5>

                            <div className="row">
                                <div className="col form-group">
                                    {attributes.map((attr, index) => (
                                        <div key={index} className="org-input mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Attribute Name"
                                                value={attr.name}
                                                onChange={(e) =>
                                                    handleAttributeChange(index, "name", e.target.value)
                                                }
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Attribute Value"
                                                value={attr.value}
                                                onChange={(e) =>
                                                    handleAttributeChange(index, "value", e.target.value)
                                                }
                                            />

                                            {attributes.length > 1 && (
                                                <Button
                                                    color="error"
                                                    onClick={() => removeAttribute(index)}
                                                >
                                                    ✕
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                className="mt-2"
                                variant="outlined"
                                onClick={addAttributes}
                            >
                                Add Another Attribute
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="card p-4 mt-4">
                <div className="d-flex justify-content-center gap-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveVariant}
                    >
                        Save Variant
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VarientAdd;
