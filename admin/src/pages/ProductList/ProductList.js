import React, { useEffect, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Button, Dialog, FormControl, InputLabel, MenuItem, Pagination, Select } from "@mui/material";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";



import ProductEdit from "../../components/ProductEdit/ProductEdit";

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
}));

const ProductList = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [showBy, setShowBy] = useState("");
    const [categoryBy, setCategoryBy] = useState("");

    const [openEdit, setOpenEdit] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const navigate = useNavigate();

    // ================= FETCH CATEGORIES =================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get("/api/category/");
                setCategories(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const res = await API.get("/api/product/");
            setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ================= FILTER + LIMIT =================
    const filteredProducts = products
        .filter((prodt) => {
            if (!categoryBy) return true;
            return prodt.category?._id === categoryBy;
        })
        .slice(0, showBy || products.length);

    // ================= OPEN EDIT =================
    const handleEditOpen = async (id) => {
        try {
            const res = await API.get(`/api/product/${id}`);
            setEditProduct(res.data.data);
            setOpenEdit(true);
        } catch (err) {
            console.error(err);
            alert("Failed to load product");
        }
    };

    // ================= DELETE PRODUCT =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await API.delete(`/api/product/${id}`);
            fetchProducts();
            alert("Product deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Product List</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard" />
                    <StyledBreadcrumb label="Product" />
                    <StyledBreadcrumb label="Product List" />
                </Breadcrumbs>
            </div>

            <div className="card p-4 mt-3">
                <h3 className="hd">Best Selling Products</h3>

                {/* FILTERS */}
                <div className="row cardFilters mt-3">
                    <div className="col-md-3">
                        <h4>Show By</h4>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="showby-label">None</InputLabel>
                            <Select
                                labelId="showby-label"
                                value={showBy}
                                label="Show By"
                                onChange={(e) => setShowBy(e.target.value)}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="col-md-3">
                        <h4>Category By</h4>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="categoryby-label">None</InputLabel>
                            <Select
                                labelId="categoryby-label"
                                value={categoryBy}
                                label="Category By"
                                onChange={(e) => setCategoryBy(e.target.value)}
                            >
                                <MenuItem value=""><em>Select Category</em></MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-responsive mt-4">
                    <table className="table table-bordered align-middle">
                        <thead className="thead-dark">
                            <tr>
                                <th>UID</th>
                                <th style={{ width: "300px" }}>PRODUCT</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRODUCT ID</th>
                                <th>FEATURED</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((prodt, index) => (
                                    <tr key={prodt._id}>
                                        <td>{index + 1}</td>

                                        <td>
                                            <div className="d-flex productBox align-items-center">
                                                <div className="imgWrapper">
                                                    <img
                                                        src={prodt.images?.[0]?.url || "https://via.placeholder.com/150"}
                                                        alt={prodt.name}
                                                        className="w-100"
                                                    />
                                                </div>
                                                <div className="info ms-2">
                                                    <h6>{prodt.name}</h6>
                                                    <p>{prodt.description}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{prodt.category?.name || "N/A"}</td>
                                        <td>{prodt.brand}</td>

                                        <td>
                                            <h6>{prodt._id}</h6>
                                        </td>

                                        <td>{prodt.isFeatured ? "Yes" : "No"}</td>

                                        <td>
                                            <div className="actions d-flex gap-1">
                                                <Button size="small" color="secondary">
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleEditOpen(prodt._id)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    size="medium"
                                                    color="success"
                                                    onClick={() => navigate(`/product/varient/${prodt._id}/add`)}
                                                >
                                                    <IoAddCircle />
                                                </Button>

                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(prodt._id)}
                                                >
                                                    <MdDelete />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="tableFooter">
                        <p>
                            Showing <b>{filteredProducts.length}</b> results
                        </p>
                        <Pagination count={1} color="secondary" />
                    </div>
                </div>
            </div>

            {/* EDIT PRODUCT DIALOG */}
            <Dialog
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setEditProduct(null);
                }}
                fullWidth
                maxWidth="sm"
            >
                {editProduct && (
                    <ProductEdit
                        product={editProduct}
                        onClose={() => setOpenEdit(false)}
                        onSuccess={fetchProducts}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default ProductList;
