import React, {useEffect, useRef, useState} from 'react';
import {HiDotsVertical} from "react-icons/hi";
import API from "../../Services/api";

const ManageAddress = () => {

    const [openMenu, setOpenMenu] = useState(null);
    const [address, setAddress] = useState([]);
    const menuRef = useRef(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        landmark: "",
        pincode: "",
        isDefault: false
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggle menu
    const handleMenuClick = (e, id) => {
        e.stopPropagation();
        setOpenMenu(openMenu === id ? null : id);
    };

    // Fetch addresses
    useEffect(() => {
        fetchAddress();
    }, []);
    //fetch address
    const fetchAddress = async () => {
        try {
            const res = await API.get("/api/address/");
            setAddress(res.data.addresses);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };
    //handel edit
    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData(item);
        setOpenMenu(null);
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };
    const updateAddress = async (id) => {
        try {
            const res = await API.put(`/api/address/${id}`, formData);

            // Update UI instantly
            setAddress(prev =>
                prev.map(item =>
                    item._id === id ? res.data.address : item
                )
            );

            setEditingId(null);
            alert("Address updated successfully");

        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };
    // Delete address
    const deleteAddress = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this address?");
            if (!confirmDelete) return;

            await API.delete(`/api/address/${id}`);

            // Remove from UI instantly
            setAddress((prev) =>
                prev.filter((item) => item._id !== id)
            );

            setOpenMenu(null);

            alert("Address deleted successfully.");
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <section className="my-Address-page py-4">
            <h4 className="mb-4">My Address</h4>

            {address.map((item) => (
                <div key={item._id} className="AddressCard mb-2 p-3">
                    <div className="d-flex align-items-center justify-content-between">

                        <div>
                            <span className="user-name">{item.fullName}</span>
                            <span className="user-phone ml-3">{item.phone}</span>
                        </div>

                        <div className="position-relative" ref={menuRef}>
                            <HiDotsVertical
                                className="cursor"
                                onClick={(e) => handleMenuClick(e, item._id)}
                            />

                            {openMenu === item._id && (
                                <div className="address-dropdown">
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                    <button onClick={() => deleteAddress(item._id)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    <p className="address-text mt-2">
                        {item.addressLine}, {item.landmark}, {item.city},{" "}
                        {item.state} - {item.pincode}
                    </p>

                    {/* address edit form */}
                    {editingId === item._id && (
                        <div className="address-edit-form mt-3">

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="custom-form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <div className="custom-form-group">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <div className="custom-form-group">
                                        <label>Address Line</label>
                                        <input
                                            type="text"
                                            name="addressLine"
                                            value={formData.addressLine}
                                            onChange={handleChange}
                                            placeholder="Address Line"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="custom-form-group">
                                        <label>Landmark</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            placeholder="Landmark"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="custom-form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="custom-form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <div className="custom-form-group">
                                        <label>Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="Pincode"
                                            className="form-control mb-2"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    Set as Default
                                </label>
                            </div>

                            <button
                                className="btn btn-success btn-sm mr-3"
                                onClick={() => updateAddress(item._id)}
                            >
                                Update
                            </button>

                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingId(null)}
                            >
                                Cancel
                            </button>

                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default ManageAddress;