import React, {useEffect, useState} from 'react';

import Breadcrumbs from "@mui/material/Breadcrumbs";
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";

import API from "../../services/api";

import {IoCloseSharp, IoCloudUploadSharp} from "react-icons/io5";
import {PiImageBrokenThin} from "react-icons/pi";

import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";


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


const BannerAdd = () => {
    const [categoryVal, setCategoryVal] = useState("");
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [position, setPosition] = useState("homepage");
    const [redirectType, setRedirectType] = useState("category");
    const [redirectValue, setRedirectValue] = useState("");

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

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

    /* Image handler */
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    /* handle Submit */
    const handleSubmit = async () => {
        try {
            if (!title || !categoryVal || !position || !image) {
                return alert("Please fill all required fields");
            }
            const formData = new FormData();
            formData.append("title", title)
            formData.append("category", categoryVal);
            formData.append("position", position);
            formData.append("redirectType", redirectType);
            formData.append("redirectValue", redirectValue);
            formData.append("image", image);

            await API.post("/api/banner/upload",
                formData,
                {headers: {"Content-Type": "multipart/form-data"}}
            );
            alert("Successfully Banner Added");
        } catch (error) {
            console.log(error);
            alert(error.message || "Error creating banner");
        }
    };

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Banner Upload</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="Banner"/>
                    <StyledBreadcrumb label="Banner Upload"/>
                </Breadcrumbs>
            </div>

            <div className="form">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card p-4">
                            <h5 className="mb-4">Basic Information</h5>

                            {/* Title */}
                            <div className="form-group mb-3">
                                <h6>TITLE *</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="row mb-3">

                                <div className="col ">
                                    <h6>Category</h6>

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

                                <div className="col form-group">
                                    <h6>Position</h6>
                                    <Select
                                        fullWidth
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                    >
                                        <MenuItem value="homepage">homepage</MenuItem>
                                        <MenuItem value="offer">offer</MenuItem>
                                        <MenuItem value="listingPage">listingPage</MenuItem>
                                        <MenuItem value="promotion">promotion</MenuItem>
                                    </Select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col form-group">
                                    <h6>Redirect Type</h6>
                                    <Select
                                        fullWidth
                                        value={redirectType}
                                        onChange={(e) => setRedirectType(e.target.value)}
                                    >
                                        <MenuItem value="category">category</MenuItem>
                                        <MenuItem value="product">product</MenuItem>
                                        <MenuItem value="external">external</MenuItem>
                                    </Select>
                                </div>
                                <div className="col form-group">
                                    <h6>Redirect Value</h6>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={redirectValue}
                                        onChange={(e) => setRedirectValue(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card media-card p-4">
                <h5 className="mb-4">Media And Published</h5>

                <div className="imagesUploadSec d-flex align-items-center gap-3">
                    {preview ? (
                        <div className=" bannerUploadBox">
                        <span className="remove" onClick={() => setPreview(null)}>
                                 <IoCloseSharp/>
                        </span>

                            <div className="previewBox">
                                <LazyLoadImage src={preview} effect="blur"/>
                            </div>
                        </div>
                    ) : (
                        <label className="bannerUploadPlaceholder">
                            <div className="icon">
                                <PiImageBrokenThin/>
                            </div>
                            <p>image upload</p>
                            <input type="file" hidden onChange={handleImage}/>
                        </label>
                    )}
                </div>

                <Button
                    variant="contained"
                    className="publishBtn mt-4"
                    onClick={handleSubmit}
                >
                    <IoCloudUploadSharp className="mx-2"/>
                    PUBLISH AND VIEW
                </Button>
            </div>
        </div>
    );
};

export default BannerAdd;