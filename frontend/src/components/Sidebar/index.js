import React, { useState } from 'react'

import { FormControl, MenuItem, Select } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { IoIosArrowDown } from "react-icons/io";

import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { Link } from 'react-router-dom';

const Sidebar = ({ filters, setFilters, filtersData }) => {

    const [value, setValue] = useState([filters.minPrice, filters.maxPrice]);

    const toggleArrayValue = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value],
        }));
    };

    const toggleMapValue = (mapKey, key, value) => {
        setFilters(prev => {
            const prevArr = prev[mapKey]?.[key] || [];
            return {
                ...prev,
                [mapKey]: {
                    ...prev[mapKey],
                    [key]: prevArr.includes(value)
                        ? prevArr.filter(v => v !== value)
                        : [...prevArr, value],
                }
            };
        });
    };


    return (
        <div className='Sidebar'>

            <div className="sortingBox">
                <span>Sort by :</span>

                <FormControl variant="standard" className="sortSelect">
                    <Select
                        value={filters.sort}
                        onChange={(e) =>
                            setFilters(prev => ({ ...prev, sort: e.target.value }))
                        }
                        disableUnderline
                        IconComponent={() => <IoIosArrowDown className="text-dark" />}
                    >
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                        <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                        <MenuItem value="discount">discount</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className='sticky'>
                {/* BRANDS – DYNAMIC */}
                <div className='filterBox'>
                    <h6>Brands</h6>
                    <div className='filterBoxContent'>
                        <ul>
                            {filtersData?.brands?.map((brand) => (
                                <li key={brand}>
                                    <FormControlLabel
                                        className='w-100'
                                        control={
                                            <Checkbox
                                                checked={filters.brands.includes(brand)}
                                                onChange={() =>
                                                    toggleArrayValue('brands', brand)
                                                }
                                            />
                                        }
                                        label={brand}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* PRICE – STATIC */}
                <div className='filterBox'>
                    <h6>Filter By Price</h6>
                    <RangeSlider
                        min={100}
                        max={100000}
                        step={100}
                        value={value}
                        onInput={(val) => {
                            setValue(val);
                            setFilters(prev => ({
                                ...prev,
                                minPrice: val[0],
                                maxPrice: val[1]
                            }));
                        }}
                    />


                    <div className='d-flex pt-2 pb-2 priceRange'>
                        <span>From: <strong className='text-dark'>₹.{value[0]}</strong></span>
                        <span className='ml-auto'>To <strong className='text-dark'>₹.{value[1]}</strong></span>
                    </div>

                </div>
                {/* AVAILABILITY – STATIC */}
                <div className='filterBox'>
                    <h6>Availability</h6>
                    <div className='filterBoxContent'>
                        <ul>
                            <li>
                                <FormControlLabel
                                    className='w-100'
                                    control={
                                        <Checkbox
                                            checked={filters.includeOutOfStock}
                                            onChange={(e) =>
                                                setFilters(prev => ({
                                                    ...prev,
                                                    includeOutOfStock: e.target.checked
                                                }))
                                            }
                                        />
                                    }
                                    label="Include Out Of Stock"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                {/* DISCOUNT – STATIC */}
                <div className='filterBox'>
                    <h6>Discount</h6>
                    <div className='filterBoxContent'>
                        <ul>
                            {[10, 20, 30, 40, 50, 60, 70].map(d => (
                                <li key={d}>
                                    <FormControlLabel
                                        className='w-100'
                                        control={
                                            <Checkbox
                                                checked={filters.discount === d}
                                                onChange={() =>
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        discount: prev.discount === d ? null : d
                                                    }))
                                                }
                                            />
                                        }
                                        label={`${d}% Off or more`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ATTRIBUTES – DYNAMIC (size, ram, rom etc.) */}
                {filtersData?.attributes &&
                    Object.entries(filtersData.attributes).map(([key, values]) => (
                        <div className='filterBox' key={key}>
                            <h6>{key.toUpperCase()}</h6>
                            <div className='filterBoxContent'>
                                <ul>
                                    {values.map(val => (
                                        <li key={val}>
                                            <FormControlLabel
                                                className='w-100'
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            filters.attributes?.[key]?.includes(val) || false
                                                        }
                                                        onChange={() =>
                                                            toggleMapValue('attributes', key, val)
                                                        }
                                                    />
                                                }
                                                label={val}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}

                {/* DETAILS – DYNAMIC (fit, fabric, occasion etc.) */}
                {filtersData?.details &&
                    Object.entries(filtersData.details).map(([key, values]) => (
                        <div className='filterBox' key={key}>
                            <h6>{key.toUpperCase()}</h6>
                            <div className='filterBoxContent'>
                                <ul>
                                    {values.map(val => (
                                        <li key={val}>
                                            <FormControlLabel
                                                className='w-100'
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            filters.details?.[key]?.includes(val) || false
                                                        }
                                                        onChange={() =>
                                                            toggleMapValue('details', key, val)
                                                        }
                                                    />
                                                }
                                                label={val}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}

                <br />

                <Link to="#"><img src='https://m.media-amazon.com/images/G/31/img21/Watches2021/Dec_22_watches/New_launches_A/Titan-newlaunch._CB617707897_.gif' className='w-100' /></Link>
                <Link to="#"><img src='https://m.media-amazon.com/images/G/31/2025/Auto/BIF/Helmets__riding_gears._SY530_QL85_FMpng_.png' className='mt-4 w-100' /></Link>
            </div>
        </div>
    )
}

export default Sidebar