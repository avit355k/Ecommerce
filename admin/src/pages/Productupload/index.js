import React, {useEffect, useState} from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import {IoCloseSharp, IoCloudUploadSharp} from "react-icons/io5";
import {PiImageBrokenThin} from "react-icons/pi";
import API from "../../services/api";

import {LazyLoadImage} from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const StyledBreadcrumb = styled(Chip)(({theme}) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
    "&:active": {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
    },
}));

const Productupload = () => {
    const [categoryVal, setCategoryVal] = useState("");
    const [isFeatured, setIsFeatured] = useState("");
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [brand, setBrand] = useState("");

    const [specifications, setSpecifications] = useState([{field: "", value: ""}]);
    const [images, setImages] = useState([]);

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

    // Add a new specification input
    const addSpecification = () => {
        setSpecifications([...specifications, {field: "", value: ""}]);
    };

    // Handle specification change
    const handleSpecificationChange = (index, key, value) => {
        const newSpecs = [...specifications];
        newSpecs[index][key] = value;
        setSpecifications(newSpecs);
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    // Remove image
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Submit product to API
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", title);
            formData.append("description", description);
            formData.append("brand", brand);
            formData.append("category", categoryVal);
            formData.append("isFeatured", isFeatured);

            //  Convert specs array → object

            specifications.forEach((spec) => {
                if (spec.field && spec.value) {
                    formData.append(
                        `productDetails[${spec.field}]`,
                        spec.value
                    );
                }
            });

            images.forEach(img => {
                formData.append("images", img);
            });

            const res = await API.post("/api/product/create", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });

            console.log("Product created:", res.data);
            alert("Product created successfully!");
            // Clear form after success
            setTitle("");
            setDescription("");
            setBrand("");
            setCategoryVal("");
            setIsFeatured("");
            setSpecifications([{field: "", value: ""}]);
            setImages([]);

        } catch (error) {
            console.error("Error creating product:", error);
            console.log(error);
            alert("Failed to create product");
        }
    };

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Product Upload</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="Products"/>
                    <StyledBreadcrumb label="Product Upload"/>
                </Breadcrumbs>
            </div>

            <div className="form">
                <div className="row">
                    {/* LEFT SIDE */}
                    <div className="col-sm-6">
                        <div className="card p-4">
                            <h5 className="mb-4">Basic Information</h5>

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
                                    rows="5"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
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
                                        displayEmpty
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-sm-6">
                        <div className="card p-4">
                            <h5>Product Details</h5>

                            <div className="row mt-3">
                                <div className="col form-group">
                                    <h6 className="mb-3">Add A Specification</h6>
                                    {specifications.map((spec, index) => (
                                        <div key={index} className="org-input mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Field"
                                                value={spec.field}
                                                onChange={(e) => handleSpecificationChange(index, "field", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Value"
                                                value={spec.value}
                                                onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                                            />
                                        </div>
                                    ))}

                                    <Button className="mt-2" variant="contained" onClick={addSpecification}>
                                        Add Another Specification
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card media-card p-4">
                <h5 className="mb-4">Media And Published</h5>

                <div className="imagesUploadSec d-flex align-items-center gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="uploadBox">
                            <span className="remove" onClick={() => removeImage(index)}>
                                <IoCloseSharp/>
                            </span>
                            <div className="previewBox">
                                <LazyLoadImage
                                    alt="product"
                                    effect="blur"
                                    src={URL.createObjectURL(img)}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Upload Placeholder */}
                    <div className="uploadPlaceholder">
                        <div className="icon"><PiImageBrokenThin/></div>
                        <p>image upload</p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            style={{position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer"}}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* Publish Button */}
                <Button variant="contained" className="publishBtn mt-4" onClick={handleSubmit}>
                    <IoCloudUploadSharp className="mx-2"/> PUBLISH AND VIEW
                </Button>
            </div>
        </div>
    );
};

export default Productupload;
