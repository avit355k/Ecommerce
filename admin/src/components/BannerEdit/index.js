import React, {useEffect, useState} from 'react';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {Button, MenuItem, Select} from "@mui/material";
import API from "../../services/api";

import {IoCloseSharp, IoCloudUploadSharp} from "react-icons/io5";
import {PiImageBrokenThin} from "react-icons/pi";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const BannerEdit = ({banner, onClose, onSuccess}) => {

    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [categoryVal, setCategoryVal] = useState("");
    const [position, setPosition] = useState("homepage");

    const [redirectType, setRedirectType] = useState("category");
    const [redirectValue, setRedirectValue] = useState("");

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    /* Prefill existing banner data */
    useEffect(() => {
        if (banner) {
            setTitle(banner.title || "");
            setCategoryVal(banner.category?._id || "");
            setPosition(banner.position || "homepage");
            setRedirectType(banner.redirect?.type || "category");
            setRedirectValue(banner.redirect?.value || "");
            setPreview(banner.image?.url || null);
        }
    }, [banner]);

    /* Fetch categories */
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
                console.error(error);
                setCategories([]);
            }
        };

        fetchAllCategories();
    }, []);

    /* Image Change */
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    /* Update Banner */
    const handleUpdate = async () => {
        try {
            if (!title || !categoryVal || !position) {
                return alert("Please fill required fields");
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryVal);
            formData.append("position", position);
            formData.append("redirectType", redirectType);
            formData.append("redirectValue", redirectValue);

            if (image) {
                formData.append("image", image);
            }

            await API.put(`/api/banner/${banner._id}`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });

            alert("Banner Updated Successfully");

            if (onSuccess) onSuccess();
            if (onClose) onClose();

        } catch (error) {
            console.error(error);
            alert(error.message || "Update failed");
        }
    };

    return (
        <div className="p-4">
            <h5 className="mb-4">Edit Banner</h5>

            {/* TITLE */}
            <div className="form-group mb-3">
                <h6>TITLE *</h6>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* CATEGORY + POSITION */}
            <div className="row mb-3">
                <div className="col">
                    <h6>Category</h6>

                    <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        value={categories.find(cat => cat._id === categoryVal) || null}
                        onChange={(event, newValue) =>
                            setCategoryVal(newValue ? newValue._id : "")
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Select Category"/>
                        )}
                    />
                </div>

                <div className="col">
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

            {/* REDIRECT */}
            <div className="row mb-3">
                <div className="col">
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
                <div className="col">
                    <h6>Redirect Value</h6>
                    <input
                        type="text"
                        className="form-control"
                        value={redirectValue}
                        onChange={(e) => setRedirectValue(e.target.value)}
                    />
                </div>
            </div>

            {/* IMAGE */}
            <div className="imagesUploadSec d-flex align-items-center gap-3 mb-3">
                {preview ? (
                    <div className="bannerUploadBox">
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
                fullWidth
                onClick={handleUpdate}
            >
                <IoCloudUploadSharp className="mx-2"/>
                UPDATE BANNER
            </Button>
        </div>
    );
};

export default BannerEdit;