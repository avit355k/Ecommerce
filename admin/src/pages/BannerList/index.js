import React, {useEffect, useState} from 'react';
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {FaEdit, FaEye} from "react-icons/fa";
import {Button, Dialog, FormControl, InputLabel, MenuItem, Pagination, Select} from "@mui/material";
import {MdDelete} from "react-icons/md";
import API from "../../services/api";
import BannerEdit from "../../components/BannerEdit";

const StyledBreadcrumb = styled(Chip)(({theme}) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
}));

const BannerList = () => {
    const [banners, setBanners] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editBanner, setEditBanner] = useState(null);

    const [positionBy, setPositionBy] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const PER_PAGE = 10;

    /*  Debounced Fetch */
    useEffect(() => {
        fetchBanners();
    }, [page, positionBy]);
    /*  Banners Fetch */
    const fetchBanners = async () => {
        try {
            const res = await API.get("/api/banner/", {
                params: {
                    page,
                    limit: PER_PAGE,
                    ...(positionBy && {position: positionBy})
                }
            });

            if (res.data.success) {
                setBanners(res.data.bannerList || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalResults(res.data.total || 0);
            }

        } catch (err) {
            console.error(err);
        }
    };
    // open edit
    const handleEditOpen = async (id) => {
        try {
            const res = await API.get(`/api/banner/${id}`);

            if (res.data.success) {
                setEditBanner(res.data.banner);
                setOpenEdit(true);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to load banner");
        }
    };
    /*  Delete*/
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await API.delete(`/api/banner/${id}`);

            if (banners.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchBanners();
            }

            alert("Banners deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Banner List</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="Banner"/>
                    <StyledBreadcrumb label="BannerList"/>
                </Breadcrumbs>
            </div>

            <div className="card p-4 mt-3">
                {/*Filters */}
                <div className="row cardFilters mt-3">
                    <div className="col-md-3">
                        <h4>Filter By Position</h4>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="positionby-label">Position</InputLabel>
                            <Select
                                labelId="positionby-label"
                                value={positionBy}
                                label="Position"
                                onChange={(e) => {
                                    setPage(1);
                                    setPositionBy(e.target.value);
                                }}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                <MenuItem value="homepage">Homepage</MenuItem>
                                <MenuItem value="offer">Offer</MenuItem>
                                <MenuItem value="listingpage">Listing Page</MenuItem>
                                <MenuItem value="promotion">Promotion</MenuItem>
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
                            <th style={{width: "300px"}}>BANNER</th>
                            <th>BANNER ID</th>
                            <th>CATEGORY</th>
                            <th>POSITION</th>
                            <th>REDIRECT</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>

                        <tbody>
                        {banners.length > 0 ? (
                            banners.map((banner, index) => (
                                <tr key={banner._id}>
                                    <td>{(page - 1) * PER_PAGE + index + 1}</td>

                                    <td>
                                        <div className="d-flex productBox align-items-center">
                                            <img
                                                src={banner.image?.url}
                                                alt={banner.title}
                                                className="w-100"
                                                style={{maxHeight: "80px", objectFit: "cover"}}
                                            />
                                        </div>
                                    </td>

                                    <td>{banner._id}</td>
                                    <td>{banner.category?.name}</td>
                                    <td>{banner.position}</td>
                                    <td>
                                        {banner.redirect?.type}/{banner.redirect?.value}
                                    </td>

                                    <td>
                                        <div className="actions d-flex gap-1">
                                            <Button size="small" color="secondary">
                                                <FaEye/>
                                            </Button>

                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => handleEditOpen(banner._id)}
                                            >
                                                <FaEdit/>
                                            </Button>

                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(banner._id)}
                                            >
                                                <MdDelete/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No banners found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="tableFooter">
                    <p>
                        Showing <b>{banners.length}</b> of <b>{totalResults}</b> results
                    </p>

                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="secondary"
                    />
                </div>
            </div>
            {/* EDIT PRODUCT DIALOG */}
            <Dialog
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    setEditBanner(null);
                }}
                fullWidth
                maxWidth="sm"
            >
                {editBanner && (
                    <BannerEdit
                        banner={editBanner}
                        onClose={() => setOpenEdit(false)}
                        onSuccess={fetchBanners}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default BannerList;