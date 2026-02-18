import React, {useEffect, useState} from "react";
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import API from "../../services/api";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Pagination,
    Select,
    TextField
} from "@mui/material";

import {FaEdit} from "react-icons/fa";
import {MdDelete} from "react-icons/md";
import {CiSearch} from "react-icons/ci";

const StyledBreadcrumb = styled(Chip)(({theme}) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
}));

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    /* Search + pagination */
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const PER_PAGE = 10;

    /* Edit dialog state */
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [name, setName] = useState("");
    const [parent, setParent] = useState("");
    const [level, setLevel] = useState(1);
    const [color, setColor] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    /* ===============================
       Debounced Fetch
    =============================== */
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchCategories();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [page, search]);

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const res = await API.get("/api/category", {
                params: {
                    page: page,
                    limit: PER_PAGE,
                    search: search
                }
            });

            setCategories(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalResults(res.data.total || 0);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ===============================
       Open Edit
    =============================== */
    const handleEditOpen = async (id) => {
        try {
            const res = await API.get(`/api/category/${id}`);
            const cat = res.data.data;

            setEditId(id);
            setName(cat.name || "");
            setParent(cat.parent || "");
            setLevel(cat.level || 1);
            setColor(cat.color || "");
            setIsFeatured(Boolean(cat.isFeatured));
            setIsActive(Boolean(cat.isActive));

            setPreview(cat.image?.url || null);
            setImage(null);

            setOpenEdit(true);
        } catch (err) {
            console.error(err);
            alert("Failed to load category");
        }
    };

    /* ===============================
       Update
    =============================== */
    const handleUpdate = async () => {
        if (!name.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("parent", parent);
            formData.append("level", level);
            formData.append("color", color);
            formData.append("isActive", isActive);
            formData.append("isFeatured", isFeatured);
            if (image) formData.append("image", image);

            await API.put(`/api/category/${editId}`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });

            setOpenEdit(false);
            fetchCategories();

            alert("Category Edited successfully");
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    /*  Delete*/
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await API.delete(`/api/category/${id}`);

            if (categories.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchCategories();
            }

            alert("Category deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Category List</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="Category"/>
                    <StyledBreadcrumb label="Category List"/>
                </Breadcrumbs>
            </div>

            <div className="card p-4 mt-3">
                <h3 className="hd">All Categories</h3>

                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="searchBox position-relative d-flex align-items-center">
                            <CiSearch style={{marginRight: '0.5rem'}}/>
                            <input
                                type="text"
                                placeholder="Search for Categories"
                                aria-label="Search input"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-muted">Loading...</p>
                ) : (
                    <div className="table-responsive mt-4">
                        <table className="table table-bordered align-middle">
                            <thead className="thead-dark">
                            <tr>
                                <th>UID</th>
                                <th style={{width: "300px"}}>CATEGORY</th>
                                <th>CATEGORY ID</th>
                                <th>SLUG</th>
                                <th>PARENT</th>
                                <th>LEVEL</th>
                                <th>STATUS</th>
                                <th>FEATURED</th>
                                <th>ACTION</th>
                            </tr>
                            </thead>

                            <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="text-center text-muted">
                                        No categories found
                                    </td>
                                </tr>
                            )}

                            {categories.map((cat, index) => (
                                <tr key={cat._id}>
                                    <td>{(page - 1) * PER_PAGE + index + 1}</td>

                                    <td>
                                        <div className="d-flex productBox align-items-center">
                                            <div className="imgWrapper">
                                                <img
                                                    src={cat.image?.url || "https://via.placeholder.com/80"}
                                                    alt=""
                                                    className="w-100"
                                                />
                                            </div>
                                            <div className="info ms-2">
                                                <h6>{cat.name}</h6>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{cat._id}</td>
                                    <td>{cat.slug}</td>
                                    <td>{cat.parent || "null"}</td>
                                    <td>{cat.level}</td>
                                    <td>{cat.isActive ? "Active" : "Inactive"}</td>
                                    <td>{cat.isFeatured ? "Yes" : "No"}</td>

                                    <td>
                                        <div className="actions d-flex gap-1">
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => handleEditOpen(cat._id)}
                                            >
                                                <FaEdit/>
                                            </Button>

                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(cat._id)}
                                            >
                                                <MdDelete/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="tableFooter">
                            <p>
                                Showing <b>{categories.length}</b> of <b>{totalResults}</b> results
                            </p>

                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                color="secondary"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* EDIT DIALOG */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Category</DialogTitle>

                <DialogContent>
                    <TextField
                        label="Category Name *"
                        fullWidth
                        margin="dense"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        label="Parent Category ID"
                        fullWidth
                        margin="dense"
                        value={parent}
                        onChange={(e) => setParent(e.target.value)}
                    />

                    <TextField
                        label="Level"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    />

                    <TextField
                        label="Color"
                        fullWidth
                        margin="dense"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />

                    <Select
                        fullWidth
                        className="mt-3"
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                    >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                    </Select>

                    <Select
                        fullWidth
                        className="mt-3"
                        value={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.value)}
                    >
                        <MenuItem value={true}>Featured</MenuItem>
                        <MenuItem value={false}>Not Featured</MenuItem>
                    </Select>

                    <div className="mt-3">
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                style={{width: 100, marginBottom: 10}}
                            />
                        )}
                        <input
                            type="file"
                            onChange={(e) => {
                                setImage(e.target.files[0]);
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }}
                        />
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoryList;
