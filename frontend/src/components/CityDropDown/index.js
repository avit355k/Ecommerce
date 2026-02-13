import {MdOutlineArrowDropDownCircle} from "react-icons/md";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {FaSearch} from "react-icons/fa";
import {IoMdClose} from "react-icons/io";
import IconButton from '@mui/material/IconButton';
import React, {useContext, useEffect, useState} from 'react';
import {mycontext} from "../../App";


const CityDropDown = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Kolkata");
    const [filteredCities, setFilteredCities] = useState([]);


    const {cityList} = useContext(mycontext);

    useEffect(() => {
        setFilteredCities(cityList);
    }, [cityList]);


    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = cityList.filter((city) =>
            city.toLowerCase().includes(keyword)
        );
        setFilteredCities(filtered);
    };

    const selectCity = (name) => {
        setSelectedCity(name);
        setIsOpenModal(false);
    };


    return (
        <>
            <Button className="citydropdown" onClick={() => setIsOpenModal(true)}>
                <div className='info d-flex flex-column'>
                    <span className="label">Your Location</span>
                    <span className="name">
                        {selectedCity}
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

                <ul className="cityList mt-3">
                    {filteredCities.map((city, index) => (
                        <li key={index}>
                            <Button
                                onClick={() => selectCity(city)}
                                className={`cityItem ${selectedCity === city ? 'active' : ''}`}>
                                {city}
                            </Button>
                        </li>
                    ))}
                </ul>

            </Dialog>
        </>
    );
}

export default CityDropDown;