import React, { useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link } from 'react-router-dom';

function valueText(value) {
    return `₹${value}`;
}

const Sidebar = () => {

    const [value, setValue] = React.useState([100, 60000]);
    const [value2, setValue2] = useState(0);

    return (
        <div className='Sidebar'>
            <div className='sticky'>
                <div className='filterBox'>
                    <h6>PRODUCT CATEGORIES</h6>
                    <div className='filterBoxContent'>
                        <ul>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Women" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="laptop" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Grocery" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Beauty" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Men" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Women" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="laptop" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Grocery" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Beauty" /></li>
                        </ul>
                    </div>
                </div>

                <div className='filterBox'>
                    <h6>Filter By Price</h6>
                    <RangeSlider min={100} max={60000} step={100} value={value} onInput={setValue} />

                    <div className='d-flex pt-2 pb-2 priceRange'>
                        <span>From: <strong className='text-dark'>₹.{value[0]}</strong></span>
                        <span className='ml-auto'>To <strong className='text-dark'>₹.{value[1]}</strong></span>
                    </div>

                </div>

                <div className='filterBox'>
                    <h6>Availability</h6>
                    <div className='filterBoxContent'>
                        <ul>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Include Out Of Stock" /></li>
                        </ul>
                    </div>
                </div>

                <div className='filterBox'>
                    <h6>Brands</h6>
                    <div className='filterBoxContent'>
                        <ul>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Apple" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Google" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Xiomi" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Realme" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Sumsung" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Motorola" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Vivo" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Oppo" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="OnePlus" /></li>
                        </ul>
                    </div>
                </div>
                <br />

                <Link to="#"><img src='https://m.media-amazon.com/images/G/31/img21/Watches2021/Dec_22_watches/New_launches_A/Titan-newlaunch._CB617707897_.gif' className='w-100' /></Link>
                <Link to="#"><img src='https://m.media-amazon.com/images/G/31/2025/Auto/BIF/Helmets__riding_gears._SY530_QL85_FMpng_.png' className='mt-4 w-100' /></Link>
            </div>
        </div>
    )
}

export default Sidebar