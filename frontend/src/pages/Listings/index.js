import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TiThMenu } from "react-icons/ti";
import { BsFillGridFill, BsGrid3X3GapFill } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import ProductItem from '../../components/ProductItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Listings = () => {
    const [productView, setProductView] = useState('four');

    const buttonRef = React.useRef(null); // Default view
    const [anchorEl, setAnchorEl] = useState(null);
    const openDropDown = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <section className='product_listings_page'>
                <div className='container'>
                    <div className='productListing d-flex'>
                        <Sidebar />

                        <div className='content-right'>
                            <img src='https://m.media-amazon.com/images/G/31/img24hp/tf/WhatsApp_Image_2025-08-18_at_14.55.27_d0f5e261._CB802203197_.jpg'
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

                            <div className={"product-listings"}>
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
                                <ProductItem itemView={productView} />
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

export default Listings