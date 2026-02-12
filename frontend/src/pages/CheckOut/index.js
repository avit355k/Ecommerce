import {useContext, useEffect, useState} from 'react';

import {Button, Dialog, DialogContent, Radio} from '@mui/material';
import {FaChevronDown, FaPlus} from "react-icons/fa";

import {mycontext} from '../../App';

const Checkout = () => {
    const {setIsHeaderFooterVisible} = useContext(mycontext);

    const [selectedAddress, setSelectedAddress] = useState(1);
    const [openModal, setOpenModal] = useState(false);

    //  States API Data
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");

    useEffect(() => {
        setIsHeaderFooterVisible(false);
        return () => setIsHeaderFooterVisible(true);
    }, []);

    //Fetch Indian States
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch(
                    "https://countriesnow.space/api/v0.1/countries/states",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            country: "India",
                        }),
                    }
                );

                const data = await response.json();

                if (data?.data?.states) {
                    setStates(data.data.states);
                }
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };

        fetchStates();
    }, []);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    return (
        <div className='checkoutPage'>

            <div className='row'>
                {/*left bar*/}
                <div className='col-md-8'>
                    <div className='address-container'>
                        <div className='address-header-blue'>
                            <span className='step-box'>2</span>
                            DELIVERY ADDRESS
                        </div>

                        <div className="address-item">
                            <div className="d-flex align-items-start p-3">
                                <Radio
                                    checked={selectedAddress}
                                    onChange={() => setSelectedAddress()}

                                    size="small"
                                />
                                <div className='address-info ml-2 w-100'>
                                    <div className="d-flex align-items-center">
                                        <span className="user-name">AVIJIT RAKSHIT</span>
                                        <span className='user-phone ml-3'>9641404096</span>
                                        <Button className="ml-auto edit-btn">EDIT</Button>
                                    </div>
                                    <p className='address-text mt-1'>Aminpur, Degananga vashila road, aminpur sakti
                                        sangha club, bharati vidyalay, North Twenty Four Parganas District, West Bengal
                                        - 743423</p>
                                    <Button variant="contained" className="deliver-here-btn mt-2">
                                        DELIVER HERE
                                    </Button>
                                </div>
                            </div>

                            <div className="d-flex align-items-start p-3">
                                <Radio
                                    checked={selectedAddress}
                                    onChange={() => setSelectedAddress()}

                                    size="small"
                                />
                                <div className='address-info ml-2 w-100'>
                                    <div className="d-flex align-items-center">
                                        <span className="user-name">ARIJUL ISLAM</span>
                                        <span className='user-phone ml-3'>9875494706</span>
                                        <Button className="ml-auto edit-btn">EDIT</Button>
                                    </div>
                                    <p className='address-text mt-1'>Aminpur, Degananga vashila road, aminpur sakti
                                        sangha club, bharati vidyalay, North Twenty Four Parganas District, West Bengal
                                        - 743423</p>
                                    <Button variant="contained" className="deliver-here-btn mt-2">
                                        DELIVER HERE
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='address-footer-actions p-2'>
                            <Button startIcon={<FaChevronDown style={{fontSize: '16px'}}/>} className="view-all-btn">
                                View all 6 addresses
                            </Button>
                        </div>

                    </div>

                    <div className='newAddress'>
                        <Button onClick={handleOpen}>
                            <FaPlus className='mr-3'/> Add New Address
                        </Button>
                    </div>
                </div>

                {/*right bar*/}
                <div className='col-md-4'>
                    <div className='shadow-sm p-3 cartDetails'>
                        <h4>Price details</h4>

                        <div className='d-flex'>
                            <span>Subtotal</span>
                            <span className='ml-auto text-red'>₹599</span>
                        </div>

                        <div className='d-flex mt-2'>
                            <span>Discount</span>
                            <span className='ml-auto text-success'>₹100</span>
                        </div>

                        <div className='d-flex mt-2'>
                            <span>Delivery</span>
                            <span className='ml-auto'>Free</span>
                        </div>

                        <div className='total-price d-flex mt-3'>
                            <strong>Total</strong>
                            <strong className='ml-auto text-red'>₹499</strong>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <div className="modal-header-custom">ADD NEW ADDRESS</div>
                <DialogContent className="address-form-container">
                    <form className="address-custom-form">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="custom-form-group">
                                    <label>Name</label>
                                    <input type="text" placeholder="Name"/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="custom-form-group">
                                    <label>10-digit mobile number</label>
                                    <input type="tel" maxLength="10" placeholder="Phone No"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <div className="custom-form-group">
                                    <label>Pincode</label>
                                    <input type="text" placeholder="Pincode"/>
                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <div className="custom-form-group">
                                    <label>Address (Area and Street)</label>
                                    <textarea rows="3" placeholder="full address"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="custom-form-group">
                                    <label>City/District/Town</label>
                                    <input type="text" placeholder="City/District/Town"/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="custom-form-group">
                                    <label>State</label>
                                    <select className="custom-select-input"
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
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
                                    <input type="text" placeholder="Landmark (Optional)"/>
                                </div>
                            </div>

                        </div>

                        <div className="form-actions mt-3">
                            <button type="submit" className="save-address-btn">Save Address</button>
                            <button type="button" onClick={handleClose} className="cancel-btn">CANCEL</button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Checkout;