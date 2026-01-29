import React, {useState} from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
}));

const CategoryAdd = () => {
    const [name, setName] = useState("");
    const [parent, setParent] = useState("");
    const [level, setLevel] = useState(0);
    const [color, setColor] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    /* Image handler */
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    /* Submit */
    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);          // REQUIRED
            formData.append("parent", parent);      // OPTIONAL
            formData.append("level", level);
            formData.append("color", color);
            formData.append("isFeatured", isFeatured);

            if (image) formData.append("image", image);

            await API.post(
                `/api/category/create`,
                formData,
                {headers: {"Content-Type": "multipart/form-data"}}
            );

            alert("Category added successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Error creating category");
        }
    };

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Category Add</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="category"/>
                    <StyledBreadcrumb label="Category Add"/>
                </Breadcrumbs>
            </div>

            <div className="form">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card p-4">
                            <h5 className="mb-4">Basic Information</h5>

                            {/* NAME (MANDATORY) */}
                            <div className="form-group mb-3">
                                <h6>TITLE *</h6>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="row mb-3">
                                {/* PARENT ID INPUT */}
                                <div className="col form-group">
                                    <h6>PARENT CATEGORY ID</h6>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="MongoDB ObjectId (optional)"
                                        value={parent}
                                        onChange={(e) => setParent(e.target.value)}
                                    />
                                </div>

                                <div className="col form-group">
                                    <h6>COLOR CODE</h6>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="#ff0000"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col form-group">
                                    <h6>LEVEL</h6>
                                    <Select
                                        fullWidth
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                    >
                                        <MenuItem value={0}>0</MenuItem>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                    </Select>
                                </div>
                                {/* FEATURED */}
                                <div className="col form-group ">
                                    <h6>FEATURED</h6>
                                    <Select
                                        fullWidth
                                        value={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.value)}
                                    >
                                        <MenuItem value={false}>NO</MenuItem>
                                        <MenuItem value={true}>YES</MenuItem>
                                    </Select>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* MEDIA */}
            <div className="card media-card p-4">
                <h5 className="mb-4">Media And Published</h5>

                <div className="imagesUploadSec d-flex align-items-center gap-3">
                    {preview ? (
                        <div className="uploadBox">
              <span className="remove" onClick={() => setPreview(null)}>
                <IoCloseSharp/>
              </span>
                            <div className="previewBox">
                                <LazyLoadImage src={preview} effect="blur"/>
                            </div>
                        </div>
                    ) : (
                        <label className="uploadPlaceholder">
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

export default CategoryAdd;
