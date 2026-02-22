import React, {useEffect, useState} from "react";
import {Checkbox, FormControl, FormControlLabel, MenuItem, Select} from "@mui/material";
import {IoIosArrowDown} from "react-icons/io";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const FilterTab = ({filters, setFilters, filtersData}) => {

    const [priceRange, setPriceRange] = useState([0, 0]);

    useEffect(() => {
        if (filtersData?.priceRange) {
            setPriceRange([
                filtersData.priceRange.min,
                filtersData.priceRange.max
            ]);
        }
    }, [filtersData]);

    if (!filtersData) return null;

    return (
        <div className="filterTab">

            {/* Sorting */}
            <div className="sortingBox">
                <span>Sort by :</span>

                <FormControl variant="standard" className="sortSelect">
                    <Select
                        value={filters.sortBy}
                        disableUnderline
                        onChange={(e) =>
                            setFilters(prev => ({
                                ...prev,
                                sortBy: e.target.value
                            }))
                        }
                        IconComponent={() => <IoIosArrowDown/>}
                    >
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="price_low_high">Price: Low to High</MenuItem>
                        <MenuItem value="price_high_low">Price: High to Low</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="sticky">
                {/* Category */}
                <div className="filterBox">
                    <h6>Category</h6>

                    <div className="filterBoxContent">
                        {filtersData.categories.map(cat => (
                            <FormControlLabel
                                key={cat._id}
                                control={
                                    <Checkbox
                                        checked={filters.category.includes(cat._id)}
                                        onChange={(e) => {
                                            const value = cat._id;
                                            setFilters(prev => ({
                                                ...prev,
                                                category: e.target.checked
                                                    ? [...prev.category, value]
                                                    : prev.category.filter(id => id !== value)
                                            }));
                                        }}
                                    />
                                }
                                label={cat.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Brands */}
                <div className="filterBox">
                    <h6>Brands</h6>

                    <div className="filterBoxContent">
                        <ul>
                            {filtersData.brands.map(brand => (
                                <li key={brand}>
                                    <FormControlLabel
                                        key={brand}
                                        control={
                                            <Checkbox
                                                checked={filters.brand.includes(brand)}
                                                onChange={(e) => {
                                                    const value = brand;
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        brand: e.target.checked
                                                            ? [...prev.brand, value]
                                                            : prev.brand.filter(b => b !== value)
                                                    }));
                                                }}
                                            />
                                        }
                                        label={brand}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Price */}
                <div className="filterBox">
                    <h6>Filter By Price</h6>

                    <RangeSlider
                        min={filtersData.priceRange.min}
                        max={filtersData.priceRange.max}
                        value={priceRange}
                        onInput={(val) => {
                            setPriceRange(val);
                            setFilters(prev => ({
                                ...prev,
                                minPrice: val[0],
                                maxPrice: val[1]
                            }));
                        }}
                    />

                    <div className="d-flex pt-2 pb-2">
                        ₹{priceRange[0]} – ₹{priceRange[1]}
                    </div>
                </div>

                {/* Rating */}
                <div className="filterBox">
                    <h6>Rating</h6>

                    <div className="filterBoxContent">
                        <ul>
                            {filtersData.ratings.map(rate => (
                                <li key={rate}>
                                    <FormControlLabel
                                        key={rate}
                                        control={
                                            <Checkbox
                                                checked={filters.rating.includes(rate)}
                                                onChange={(e) => {
                                                    const value = rate;
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        rating: e.target.checked
                                                            ? [...prev.rating, value]
                                                            : prev.rating.filter(r => r !== value)
                                                    }));
                                                }}
                                            />
                                        }
                                        label={`${rate} Stars & Up`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Availability*/}
                <div className="filterBox">
                    <h6>Availability</h6>

                    <div className="filterBoxContent">
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

                {/* Attributes */}
                {Object.entries(filtersData.attributes).map(([key, values]) => (
                    <div className="filterBox" key={key}>
                        <h6>{key.toUpperCase()}</h6>

                        <div className="filterBoxContent">
                            <ul>
                                {values.map(val => (
                                    <li key={val}>
                                        <FormControlLabel
                                            key={val}
                                            control={
                                                <Checkbox
                                                    checked={filters[key]?.includes(val)}
                                                    onChange={(e) => {
                                                        const value = val;
                                                        setFilters(prev => ({
                                                            ...prev,
                                                            [key]: e.target.checked
                                                                ? [...(prev[key] || []), value]
                                                                : (prev[key] || []).filter(v => v !== value)
                                                        }));
                                                    }}
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
            </div>
        </div>
    );
};

export default FilterTab;