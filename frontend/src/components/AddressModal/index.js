import {useEffect, useState} from "react";
import {Dialog, DialogContent} from "@mui/material";
import API from "../../Services/api";

const AddressModal = ({open, handleClose, fetchAddresses, editData = null}) => {

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        pincode: "",
        addressLine: "",
        city: "",
        state: "",
        landmark: "",
    });

    const [states, setStates] = useState([]);

    // Load states
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch(
                    "https://countriesnow.space/api/v0.1/countries/states",
                    {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({country: "India"}),
                    }
                );
                const data = await response.json();
                if (data?.data?.states) {
                    setStates(data.data.states);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchStates();
    }, []);

    // If editing, fill data
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            resetForm();
        }
    }, [editData]);

    const resetForm = () => {
        setFormData({
            fullName: "",
            phone: "",
            pincode: "",
            addressLine: "",
            city: "",
            state: "",
            landmark: "",
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {...formData};

            if (editData) {
                await API.put(`/api/address/${editData._id}`, payload);
            } else {
                await API.post("/api/address/add", payload);
            }

            fetchAddresses();
            handleClose();
            resetForm();

        } catch (error) {
            console.log("Submit Error:", error.response?.data);
            alert("Something went wrong");
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <div className="modal-header-custom">
                {editData ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
            </div>

            <DialogContent className="address-form-container">
                <form className="address-custom-form" onSubmit={handleSubmit}>
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
                                    required
                                />

                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="custom-form-group">
                                <label>10-digit mobile number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="custom-form-group">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="custom-form-group">
                                <label>Address (Area and Street)</label>
                                <textarea
                                    name="addressLine"
                                    value={formData.addressLine}
                                    onChange={handleChange}
                                    placeholder="Address Line"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="custom-form-group">
                                <label>City/District/Town</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="custom-form-group">
                                <label>State</label>
                                <select className="custom-select-input"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                >
                                    <option value="">Select State</option>

                                    {states.map((state, index) => (
                                        <option key={index} value={state.name}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="custom-form-group">
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="Landmark (Optional)"
                                />
                            </div>
                        </div>

                    </div>


                    <div className="form-actions mt-3">
                        <button type="submit" className="save-address-btn">
                            {editData ? "Update Address" : "Save Address"}
                        </button>
                        <button type="button" onClick={handleClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddressModal;
