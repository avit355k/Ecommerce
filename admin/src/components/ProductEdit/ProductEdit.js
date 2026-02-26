import React, {useEffect, useState} from "react";
import {Button, MenuItem, Select} from "@mui/material";
import {IoCloseSharp, IoCloudUploadSharp} from "react-icons/io5";
import {PiImageBrokenThin} from "react-icons/pi";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import API from "../../services/api";

const ProductEdit = ({product, onClose, onSuccess}) => {
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [categoryVal, setCategoryVal] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);

    const [specifications, setSpecifications] = useState([{field: "", value: ""}]);

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    /* Load Product */
    useEffect(() => {
        if (!product) return;

        setTitle(product.name || "");
        setDescription(product.description || "");
        setBrand(product.brand || "");
        setCategoryVal(product.category?._id || "");
        setIsFeatured(Boolean(product.isFeatured));

        if (product.productDetails) {
            const specsArray = Object.entries(product.productDetails).map(
                ([field, value]) => ({field, value})
            );
            setSpecifications(specsArray);
        } else {
            setSpecifications([{field: "", value: ""}]);
        }

        setExistingImages(product.images || []);
        setNewImages([]);
        setRemovedImages([]);
    }, [product]);

    // Fetch categories from API
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                let allCategories = [];
                let currentPage = 1;
                let totalPages = 1;

                do {
                    const res = await API.get(`/api/category?page=${currentPage}`);

                    if (res.data && Array.isArray(res.data.data)) {
                        allCategories = [...allCategories, ...res.data.data];
                        totalPages = res.data.totalPages;
                        currentPage++;
                    } else {
                        break;
                    }

                } while (currentPage <= totalPages);

                setCategories(allCategories);

            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            }
        };

        fetchAllCategories();
    }, []);


    /* SPECIFICATIONS  */
    const addSpecification = () => {
        setSpecifications([...specifications, {field: "", value: ""}]);
    };

    const handleSpecificationChange = (index, key, value) => {
        const updated = [...specifications];
        updated[index][key] = value;
        setSpecifications(updated);
    };

    /* IMAGE HANDLERS  */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const removeExistingImage = (img) => {
        setExistingImages(existingImages.filter(i => i.public_id !== img.public_id));
        setRemovedImages(prev => [...prev, img.public_id]);
    };

    /*  SUBMIT UPDATE */
    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append("name", title);
            formData.append("description", description);
            formData.append("brand", brand);
            formData.append("category", categoryVal);
            formData.append("isFeatured", isFeatured);

            specifications.forEach(spec => {
                if (spec.field && spec.value) {
                    formData.append(`productDetails[${spec.field}]`, spec.value);
                }
            });

            newImages.forEach(img => {
                formData.append("images", img);
            });

            removedImages.forEach(id => {
                formData.append("removedImages[]", id);
            });

            await API.put(`/api/product/${product._id}`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });

            alert("Product updated successfully");
            onSuccess && onSuccess();
            onClose && onClose();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update product");
        }
    };

    return (
        <div className="p-3">
            <h5 className="mb-4">Edit Product</h5>

            {/* BASIC INFO */}
            <div className="form-group mb-3">
                <h6>TITLE</h6>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="form-group mb-3">
                <h6>DESCRIPTION</h6>
                <textarea
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-group mb-3">
                <h6>BRAND</h6>
                <input
                    type="text"
                    className="form-control"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                />
            </div>

            <div className="row mb-3">
                <div className="col">
                    <h6>CATEGORY</h6>
                    <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        value={categories.find(cat => cat._id === categoryVal) || null}
                        onChange={(event, newValue) => {
                            setCategoryVal(newValue ? newValue._id : "");
                        }}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Category"/>
                        )}
                    />
                </div>

                <div className="col">
                    <h6>Featured</h6>
                    <Select
                        value={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                </div>
            </div>

            {/* SPECIFICATIONS */}
            <h6 className="mb-2">Product Specifications</h6>
            {specifications.map((spec, index) => (
                <div key={index} className="org-input mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Field"
                        value={spec.field}
                        onChange={(e) =>
                            handleSpecificationChange(index, "field", e.target.value)
                        }
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) =>
                            handleSpecificationChange(index, "value", e.target.value)
                        }
                    />
                </div>
            ))}

            <Button className="mt-2" variant="contained" onClick={addSpecification}>
                Add Specification
            </Button>

            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
                <div className="mt-4">
                    <h6>Current Images</h6>
                    <div className="imagesUploadSec d-flex gap-3">
                        {existingImages.map((img, i) => (
                            <div key={i} className="uploadBox">
                                <span className="remove" onClick={() => removeExistingImage(img)}>
                                    <IoCloseSharp/>
                                </span>
                                <div className="previewBox">
                                    <LazyLoadImage src={img.url} effect="blur"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* NEW IMAGES */}
            <div className="mt-4 imagesUploadSec d-flex gap-3">
                {newImages.map((img, index) => (
                    <div key={index} className="uploadBox">
                        <span className="remove" onClick={() => removeNewImage(index)}>
                            <IoCloseSharp/>
                        </span>
                        <div className="previewBox">
                            <LazyLoadImage
                                src={URL.createObjectURL(img)}
                                effect="blur"
                            />
                        </div>
                    </div>
                ))}

                <div className="uploadPlaceholder">
                    <div className="icon"><PiImageBrokenThin/></div>
                    <p>Add Images</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        style={{position: "absolute", opacity: 0, width: "100%", height: "100%"}}
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            {/* ACTIONS */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    <IoCloudUploadSharp className="mx-2"/>
                    Update Product
                </Button>
            </div>
        </div>
    );
};

export default ProductEdit;
