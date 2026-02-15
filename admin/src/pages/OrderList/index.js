import React, {useEffect, useState} from "react";
import {format} from "date-fns";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import {emphasize, styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
} from "@mui/material";

import {DateRange} from "react-date-range";
import {FaEdit} from "react-icons/fa";

import API from "../../services/api";

const StyledBreadcrumb = styled(Chip)(({theme}) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
}));

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [OrderStatusBy, setOrderStatusBy] = useState("");

    //  Date Range State
    const [showPicker, setShowPicker] = useState(false);
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ================= FETCH ORDERS =================
    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/order/all-orders", {
                params: {
                    status: OrderStatusBy,
                    startDate: format(range[0].startDate, "yyyy-MM-dd"),
                    endDate: format(range[0].endDate, "yyyy-MM-dd"),
                    page,
                    limit: 10,
                },
            });

            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [OrderStatusBy, range, page]);

    // ================= UPDATE ORDER =================
    const handleUpdate = async () => {
        try {
            await API.put(`/api/order/update-status/${selectedOrderId}`, {
                status: selectedStatus,
            });

            setOpenEdit(false);
            fetchOrders();
        } catch (err) {
            console.error("Error updating order", err);
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Order List</h5>

                <Breadcrumbs className="ms-auto">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="Order List"/>
                </Breadcrumbs>
            </div>

            <div className="card p-4 mt-3">

                {/* Filter */}
                <div className="row cardFilters mt-3">
                    {/* STATUS FILTER */}
                    <div className="col-md-3">
                        <h4>Status</h4>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Order Status</InputLabel>
                            <Select
                                value={OrderStatusBy}
                                label="Order Status"
                                onChange={(e) => {
                                    setPage(1);
                                    setOrderStatusBy(e.target.value);
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                <MenuItem value="refund">Refund</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* DATE RANGE FILTER */}
                    <div className="col-md-3">
                        <h4>Select Date Range</h4>

                        <TextField
                            size="small"
                            fullWidth
                            value={`${format(
                                range[0].startDate,
                                "dd/MM/yyyy"
                            )} - ${format(range[0].endDate, "dd/MM/yyyy")}`}
                            onClick={() => setShowPicker(!showPicker)}
                            readOnly
                        />

                        {showPicker && (
                            <div style={{position: "absolute", zIndex: 999}}>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={(item) => setRange([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={range}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setShowPicker(false)}
                                    sx={{mt: 1}}
                                >
                                    Apply
                                </Button>
                            </div>
                        )}

                    </div>
                </div>

                {/* ================= TABLE ================= */}
                <div className="table-responsive mt-4">
                    <table className="table table-bordered align-middle">
                        <thead className="thead-dark">
                        <tr>
                            <th>UID</th>
                            <th>ORDER ID</th>
                            <th>PRODUCT</th>
                            <th>TOTAL</th>
                            <th>QTY</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>

                        <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order._id}</td>

                                <td>
                                    {order.items?.map((item) => (
                                        <div key={item._id} className="d-flex productBox align-items-center">
                                            <div className="imgWrapper">
                                                <img
                                                    src={
                                                        item.product?.images?.[0]?.url ||
                                                        "https://via.placeholder.com/60"
                                                    }
                                                    alt={item.product?.name}
                                                    className="w-100"
                                                />
                                            </div>
                                            <div className="info ms-2">
                                                <h6>{item.product?.name}</h6>
                                            </div>
                                        </div>
                                    ))}
                                </td>

                                <td>₹ {order.totalAmount}</td>

                                <td>
                                    {order.items.reduce(
                                        (acc, item) => acc + item.quantity,
                                        0
                                    )}
                                </td>

                                <td>
                                <span className={`badge ${
                                    order.orderStatus === "processing"
                                        ? "bg-warning"
                                        : order.orderStatus === "delivered"
                                            ? "bg-success"
                                            : order.orderStatus === "cancelled"
                                                ? "bg-danger"
                                                : "bg-info"
                                }`}
                                >
                        {order.orderStatus}
                                </span>
                                </td>

                                <td>
                                    <div className="actions d-flex gap-1">
                                        <Button
                                            size="small"
                                            color="success"
                                            onClick={() => {
                                                setSelectedOrderId(order._id);
                                                setSelectedStatus(order.orderStatus);
                                                setOpenEdit(true);
                                            }}
                                        >
                                            <FaEdit/>
                                        </Button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="tableFooter">
                        <p>Showing {orders.length} results</p>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="secondary"
                        />
                    </div>
                </div>
            </div>

            {/* EDIT DIALOG */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
                <DialogTitle>Update Order Status</DialogTitle>

                <DialogContent>
                    <FormControl fullWidth sx={{mt: 2}}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={selectedStatus}
                            label="Status"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="refund">Refund</MenuItem>
                        </Select>
                    </FormControl>
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

export default OrderList;
