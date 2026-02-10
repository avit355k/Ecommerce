import {useContext, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/images/logo.png'
import {Link} from 'react-router-dom';

import CountryDropDown from '../CountryDropDown';
import SearchBox from './SearchBox';
import Navigation from './Navigations';
import AccountDropdown from './../AccountDropdown/index';

import {FaUser} from "react-icons/fa";
import {FaChevronDown} from "react-icons/fa6"
import {MdOutlineShoppingCart} from "react-icons/md";

import Button from '@mui/material/Button';

import {mycontext} from '../../App';
import API from '../../Services/api';

const Header = () => {
    const {countryList, isLogin, cartData, setCartData} = useContext(mycontext);

    // Fetch cart
    useEffect(() => {
        if (!isLogin) {
            setCartData({totalItems: 0, totalPrice: 0});
            return;
        }

        const fetchCart = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                const {data} = await API.get("/api/cart/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (data.success) {
                    setCartData({
                        totalItems: data.totalItems,
                        totalPrice: data.totalPrice
                    });
                }
            } catch (error) {
                console.error("Failed to load cart", error);
            }
        };

        fetchCart();
    }, [isLogin, setCartData]);

    return (
        <>
            <div className='headeWrapper'>
                <div className='top-strip bg-red'>
                    <div class="container">
                        <p className='mb-0 mt-0 text-center'>Due to the <b>COVID 19</b> epidemic, orders may be
                            processed with a slight delay</p>
                    </div>
                </div>

                <header className='header'>
                    <div className='row justify-content-start'>
                        <div className='logoWrapper d-flex align-items-center col-sm-2'>
                            <Link to={'/'}>
                                <img src={Logo} alt='Ecommerce store logo'/>
                            </Link>
                        </div>

                        <div className='col-sm-10 d-flex align-items-center part2'>
                            {countryList.length > 0 && <CountryDropDown/>}
                            <SearchBox/>

                            <div className='part3 d-flex align-items-center '>
                                {
                                    !isLogin ? (
                                        <Link to="/signIn">
                                            <Button className=' login-btn mr-2'>
                                                Sign In
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className='account-wrapper position-relative'>
                                            <Button className="account-btn d-flex align-items-center">
                                                <span className="user-icon">
                                                    <FaUser/>
                                                </span>

                                                <span className="user-name">AVIJIT</span>

                                                <FaChevronDown className="dropdown-icon"/>
                                            </Button>

                                            <AccountDropdown/>
                                        </div>
                                    )
                                }
                                {/*cart tab */}
                                <div className='ml-auto carttab d-flex align-items-center'>

                                    <div className='position-relative ml-2'>
                                        {
                                            isLogin ? (
                                                <Link to="/cart" className="text-decoration-none">
                                                    <Button className='d-flex align-items-center'>
                                                        <MdOutlineShoppingCart className="cart-icon"/>
                                                        <div className="cart-text">
                                                        <span className="cart-items">
                                                            {cartData.totalItems} item
                                                            {cartData.totalItems !== 1 && "s"}
                                                        </span>
                                                            <span className="cart-price">₹{cartData.totalPrice}</span>
                                                        </div>
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button className='cart-btn-disabled d-flex align-items-center'
                                                        disabled>
                                                    <MdOutlineShoppingCart className="cart-icon-disabled"/>
                                                    <div className="cart-text">
                                                        <span className="cart-disabled-text">My Cart</span>
                                                    </div>
                                                </Button>
                                            )}

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </header>

                <Navigation/>

            </div>
        </>
    );
}

export default Header;
