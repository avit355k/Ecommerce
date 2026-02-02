import React, { useEffect, useState } from "react";
import { Button, MenuItem, Select } from "@mui/material";
import { MdCancel } from "react-icons/md";

import API from "../../services/api";

const VarientEdit = ({ varientData, onSuccess, onClose }) => {
    const [attributes, setAttributes] = useState([{ name: "", value: "" }]);
    const [price, setPrice] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [isActive, setIsActive] = useState(true);

    //load variant data
    useEffect(() => {
        if (!varientData) return;

        if (varientData.attributes) {
            const attrs = Object.entries(varientData.attributes).map(([name, value]) => ({ name, value }));
            setAttributes(attrs);
        } else {
            setAttributes([{ name: "", value: "" }]);
        }

        setPrice(varientData.price || "");
        setDiscountedPrice(varientData.discountedPrice || "");
        setCountInStock(varientData.countInStock || "");
        setIsActive(Boolean(varientData.isActive));
    }, [varientData]);

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

    // update variant
    const handleSubmit = async () => {
        if (!price || countInStock === "") {
            alert("Price and stock are required");
            return;
        }

        // EXACT SAME logic as Add page
        const attributesMap = {};
        attributes.forEach(attr => {
            if (attr.name && attr.value) {
                attributesMap[attr.name] = attr.value;
            }
        });

        try {
            await API.put(
                `/api/varient/${varientData._id}`,
                {
                    price,
                    discountedPrice,
                    countInStock,
                    attributes: attributesMap,
                    isActive
                }
            );

            alert("Variant updated successfully");
            onSuccess();   // refresh list
            onClose();     // close modal

        } catch (error) {
            console.error(error);
            alert("Failed to update variant");
        }
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Edit Varient</h5>

                <span className="cursor-pointer" style={{ fontSize: '25px', color: '#ff0000' }}>
                    <MdCancel onClick={onClose} />
                </span>
            </div>

            <div className="form">
                <div className="row">

                    <div className="col form-group">
                        <h5 className="mb-4">Attributes</h5>
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

                        <Button
                            className="mt-2"
                            variant="outlined"
                            onClick={addAttributes}
                        >
                            Add Another Attribute
                        </Button>
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

                    <div className="form-group mb-3">
                        <h6>Active</h6>
                        <Select
                            value={String(isActive)}
                            onChange={(e) => setIsActive(e.target.value === "true")}
                            fullWidth
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>

                    </div>
                </div>
            </div>

            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Update Varient
                </Button>
            </div>

        </div>
    )
};

export default VarientEdit;