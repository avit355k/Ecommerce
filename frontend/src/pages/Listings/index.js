import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { TiThMenu } from "react-icons/ti";
import { BsFillGridFill, BsGrid3X3GapFill } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";

import Sidebar from '../../components/Sidebar'
import ProductItem from '../../components/ProductItem';
import API from "../../Services/api";


const Listings = () => {
    const { slug } = useParams();

    const [products, setProducts] = useState([]);
    const [filtersData, setFiltersData] = useState({});
    const [loading, setLoading] = useState(true);

    const [productView, setProductView] = useState('four');

    const [filters, setFilters] = useState({
        brands: [],
        attributes: {},
        details: {},
        minPrice: 100,
        maxPrice: 100000,
        discount: null,
        includeOutOfStock: false,
        sort: "newest",
    });

    // Reset filters when category changes
    useEffect(() => {
        setFilters({
            brands: [],
            attributes: {},
            details: {},
            minPrice: 100,
            maxPrice: 100000,
            discount: null,
            includeOutOfStock: false,
            sort: "newest"
        });
    }, [slug]);

    const buttonRef = React.useRef(null); // Default view
    const [anchorEl, setAnchorEl] = useState(null);
    const openDropDown = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Fetch dynamic filters
    useEffect(() => {
        const fetchFilters = async () => {
            const { data } = await API.get(`/api/catalog/filters/${slug}`);
            if (data.success) setFiltersData(data.filters);
        };
        fetchFilters();
    }, [slug]);


    // fetch products by category slug
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};

                // brands
                if (filters.brands.length) {
                    params.brands = filters.brands.join(",");
                }
                // attributes
                Object.entries(filters.attributes).forEach(
                    ([key, values]) => {
                        if (values.length) {
                            params[`attr_${key}`] = values.join(",");
                        }
                    }
                );

                // details
                Object.entries(filters.details).forEach(
                    ([key, values]) => {
                        if (values.length) {
                            params[`detail_${key}`] = values.join(",");
                        }
                    }
                );

                params.minPrice = filters.minPrice;
                params.maxPrice = filters.maxPrice;

                if (filters.discount) {
                    params.discount = filters.discount;
                }

                if (filters.includeOutOfStock) {
                    params.includeOutOfStock = true;
                }

                if (filters.sort) {
                    params.sort = filters.sort;
                }

                const { data } = await API.get(
                    `/api/catalog/category/${slug}`,
                    { params }
                );
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error("Product fetch error", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [slug, filters]);

    return (
        <>
            <section className='product_listings_page'>
                <div className='container'>
                    <div className='productListing d-flex'>
                        <Sidebar
                            filters={filters}
                            setFilters={setFilters}
                            filtersData={filtersData}
                        />

                        <div className='content-right'>
                            <img
                                src='https://m.media-amazon.com/images/G/31/img24hp/tf/WhatsApp_Image_2025-08-18_at_14.55.27_d0f5e261._CB802203197_.jpg'
                                className='w-100' style={{ borderRadius: '7px' }} alt='Banner' />

                            <div className='showBy mt-3 mb-3 d-flex align-items-center'>
                                <div className='d-flex align-items-center btnWrapper'>
                                    <Button
                                        onClick={() => setProductView('one')}
                                        className={productView === 'one' && 'active'}
                                    >
                                        <TiThMenu />
                                    </Button>
                                    <Button
                                        onClick={() => setProductView('three')}
                                        className={productView === 'three' && 'active'}
                                    >
                                        <BsFillGridFill />
                                    </Button>
                                    <Button
                                        onClick={() => setProductView('four')}
                                        className={productView === 'four' && 'active'}
                                    >
                                        <BsGrid3X3GapFill />
                                    </Button>
                                </div>
                                <div className='ml-auto showByFilter'>
                                    <Button
                                        onClick={handleClick}
                                        id="basic-button"
                                        ref={buttonRef} // keep a reference to measure width
                                    >
                                        Show 10 <FaAngleDown />
                                    </Button>

                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropDown}
                                        onClose={handleClose}
                                        PaperProps={{
                                            sx: {
                                                width: anchorEl ? anchorEl.offsetWidth : 'auto' // match button width
                                            }
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>10</MenuItem>
                                        <MenuItem onClick={handleClose}>20</MenuItem>
                                        <MenuItem onClick={handleClose}>50</MenuItem>
                                        <MenuItem onClick={handleClose}>100</MenuItem>
                                    </Menu>
                                </div>

                            </div>

                            {/* Product Grid */}
                            <div className={"product-listings"}>
                                {loading ? (
                                    <p>Loading products...</p>
                                ) : products.length === 0 ? (
                                    <p>No products found</p>
                                ) : (
                                    products.map((product) => (
                                        <ProductItem
                                            key={product._id}
                                            product={product}
                                            itemView={productView}
                                        />
                                    ))
                                )}
                            </div>


                            <div className='d-flex align-items-center justify-content-center mt-4'>
                                <Pagination count={10} color="primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Listings;