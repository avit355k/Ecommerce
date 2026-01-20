import React, {useState} from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import {IoCloseSharp, IoCloudUploadSharp} from "react-icons/io5";
import {PiImageBrokenThin} from "react-icons/pi";

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
    const [brandVal, setBrandVal] = useState("");

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
                    <div className="col-sm-7">
                        <div className="card p-4">
                            <h5 className="mb-4">Basic Information</h5>

                            <div className="form-group mb-3">
                                <h6>TITLE</h6>
                                <input type="text" className="form-control"/>
                            </div>

                            <div className="form-group mb-3">
                                <h6>DESCRIPTION</h6>
                                <textarea className="form-control" rows="5"></textarea>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <h6>CATEGORY</h6>
                                    <Select
                                        value={categoryVal}
                                        onChange={(e) => setCategoryVal(e.target.value)}
                                        displayEmpty
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select Category</em>
                                        </MenuItem>
                                        <MenuItem value="electronics">Electronics</MenuItem>
                                        <MenuItem value="fashion">Fashion</MenuItem>
                                        <MenuItem value="grocery">Grocery</MenuItem>
                                    </Select>
                                </div>

                                <div className="col">
                                    <h6>BRAND</h6>
                                    <Select
                                        value={brandVal}
                                        onChange={(e) => setBrandVal(e.target.value)}
                                        displayEmpty
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select Brand</em>
                                        </MenuItem>
                                        <MenuItem value="brand1">Brand 1</MenuItem>
                                        <MenuItem value="brand2">Brand 2</MenuItem>
                                    </Select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col form-group">
                                    <h6>REGULAR PRICE</h6>
                                    <input type="text" className="form-control"/>
                                </div>

                                <div className="col form-group">
                                    <h6>DISCOUNT PRICE</h6>
                                    <input type="text" className="form-control"/>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col form-group">
                                    <h6>SHIPPING FEE</h6>
                                    <input type="text" className="form-control"/>
                                </div>

                                <div className="col form-group">
                                    <h6>IN STOCK</h6>
                                    <input type="text" className="form-control"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <h6>TAGS</h6>
                                <textarea className="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-sm-5">
                        <div className="card p-4">
                            <h5>Organization</h5>

                            <div className="row mt-2">
                                {/* Category */}
                                <div className="col form-group">
                                    <h6 className="mb-3">Add Category</h6>
                                    <div className="org-input">
                                        <input type="text" className="form-control" placeholder="type here"/>
                                        <Button variant="contained">Add</Button>
                                    </div>
                                </div>


                            </div>

                            <div className="row mt-2">
                                {/* Brand */}
                                <div className="col form-group">
                                    <h6 className="mb-3">Add Brand</h6>
                                    <div className="org-input">
                                        <input type="text" className="form-control" placeholder="type here"/>
                                        <Button variant="contained">Add</Button>
                                    </div>
                                </div>


                            </div>

                            <div className="row mt-2">
                                {/* Color*/}
                                <div className="col form-group">
                                    <h6 className="mb-3">Add Color</h6>
                                    <div className="org-input">
                                        <input type="text" className="form-control" placeholder="type here"/>
                                        <Button variant="contained">Add</Button>
                                    </div>
                                </div>


                            </div>

                            <div className="row mt-2">
                                {/* Size */}
                                <div className="col form-group">
                                    <h6 className="mb-3">Add Size</h6>
                                    <div className="org-input">
                                        <input type="text" className="form-control" placeholder="type here"/>
                                        <Button variant="contained">Add</Button>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card media-card p-4">
                <h5 className="mb-4">Media And Published</h5>

                <div className="imagesUploadSec d-flex align-items-center gap-3">

                    {/* Uploaded Image */}
                    <div className="uploadBox">
                    <span className="remove">
                        <IoCloseSharp/>
                    </span>

                        <div className="previewBox">
                            <LazyLoadImage
                                alt="product"
                                effect="blur"
                                src="https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/JUNE/3/QgH2Akno_ac25b2519e434be6ac5afc8a8ec91c1d.jpg"
                            />
                        </div>
                    </div>

                    {/* Upload Placeholder */}

                    <div className="uploadPlaceholder">
                        <div className="icon"><PiImageBrokenThin/></div>
                        <p>image upload</p>
                    </div>

                </div>

                {/* Publish Button */}
                <Button variant="contained" className="publishBtn mt-4">
                    <IoCloudUploadSharp className="mx-2"/> PUBLISH AND VIEW
                </Button>
            </div>
        </div>
    );
};

export default Productupload;
