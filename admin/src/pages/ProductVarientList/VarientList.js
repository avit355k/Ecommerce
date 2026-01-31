import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Button } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import API from "../../services/api";

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
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

const VarientList = () => {
    const [productsData, setProductsData] = useState([]);

    //fetch all products with varients
    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const res = await API.get("/api/varient/available");
                setProductsData(Array.isArray(res.data.data) ? res.data.data : []);
                console.log("Products with Varients", res.data.data);
            } catch (error) {
                console.error("Error in fetching products data", error);
            }
        };
        fetchProductsData();
    }, []);

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Product Varient List </h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard" />
                    <StyledBreadcrumb label="Products Varient" />
                    <StyledBreadcrumb label="Product Varient List" />
                </Breadcrumbs>
            </div>

            <div className="card p-4 mt-3">
                Product Varient List

                <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>UID</th>
                                <th style={{ width: "300px" }}>PRODUCT</th>
                                <th style={{ width: "300px" }}>ATTRIBUTES</th>
                                <th>PRICE</th>
                                <th>STOCK</th>
                                <th>VARIENT ID</th>
                                <th>SKU</th>
                                <th>ACTIVE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productsData.map((prodt, index) => (
                                <tr key={prodt.product._id}>

                                    <td>{index + 1}</td>
                                    {/* PRODUCT */}
                                    <td>
                                        <div className="d-flex productBox align-items-center">
                                            <div className="imgWrapper">
                                                <img
                                                    src={
                                                        prodt.product?.images?.[0]?.url ||
                                                        "https://via.placeholder.com/150"
                                                    }
                                                    alt={prodt.product?.name}
                                                    className="w-100"
                                                />
                                            </div>
                                            <div className="info ms-2">
                                                <h6>{prodt.product?.name}</h6>
                                                <p className="mb-0">{prodt.product?.description}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* ATTRIBUTES */}
                                    <td>
                                        {prodt.attributes ? Object.entries(prodt.attributes).map(([key, value]) => (
                                            <div key={key}>{key}: {value}</div>
                                        )) : "—"}
                                    </td>

                                    {/* PRICE */}
                                    <td>
                                        {prodt.discountedPrice || prodt.price || "—"}
                                    </td>

                                    {/* STOCK */}
                                    <td>{prodt.countInStock ?? "—"}</td>

                                    {/* VARIANT ID */}
                                    <td>{prodt._id ?? "—"}</td>

                                    {/* SKU */}
                                    <td>{prodt.sku ?? "—"}</td>

                                    {/* ACTIVE */}
                                    <td>{prodt.isActive ? "Yes" : "No"}</td>

                                    {/* ACTION */}
                                    <td>
                                        <div className="actions d-flex gap-1">
                                            <Button size="small" color="success">
                                                <FaEdit />
                                            </Button>
                                            <Button size="small" color="error">
                                                <MdDelete />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default VarientList