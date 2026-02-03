import {MdOutlineArrowDropDownCircle} from "react-icons/md";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {FaSearch} from "react-icons/fa";
import {IoMdClose} from "react-icons/io";
import IconButton from '@mui/material/IconButton';
import React, {useContext, useEffect, useState} from 'react';
import {mycontext} from "../../App";


const CountryDropDown = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [country, setCountry] = useState([]);


    const {countryList} = useContext(mycontext);

    useEffect(() => {
        setCountry(countryList);
    }, [countryList]);

    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = countryList.filter((item) =>
            item.country.toLowerCase().includes(keyword)
        );
        setCountry(filtered);
    };

    const selectCountry = (name) => {
        setSelectedCountry(name);
        setIsOpenModal(false);
    };

    return (
        <>
            <Button className="countrydropdown" onClick={() => setIsOpenModal(true)}>
                <div className='info d-flex flex-column'>
                    <span className="label">Your Location</span>
                    <span className="name">
                        {selectedCountry}
                    </span>
                </div>
                <span className="ml-auto"><MdOutlineArrowDropDownCircle/></span>
            </Button>

            <Dialog open={isOpenModal} onClose={() => setIsOpenModal(false)}
                    className="locationModal">
                <h4 className="mb-0">Choose your Delivery Location </h4>
                <p>Enter your address and we will specify the offer for your area.</p>
                <IconButton className="dialogClose" onClick={() => setIsOpenModal(false)}>
                    <IoMdClose/>
                </IconButton>
                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Search your location' onChange={filterList}/>
                    <Button className="close_"> <FaSearch/></Button>
                </div>

                <ul className="countryList mt-3">
                    {country.map((item, index) => (
                        <li key={index}>
                            <Button
                                onClick={() => selectCountry(item.country)}
                                className={`countryItem ${selectedCountry === item.country ? 'active' : ''}`}>
                                {item.country}
                            </Button>
                        </li>
                    ))}
                </ul>

            </Dialog>
        </>
    );
}

export default CountryDropDown;