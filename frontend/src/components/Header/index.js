
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom';
import CountryDropDown from '../CountryDropDown';
import { FaUser } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import Button from '@mui/material/Button';
import SearchBox from './SearchBox';
import Navigation from './Navigations';
import { useContext } from 'react';
import { mycontext } from '../../App';
import { use } from 'react';

const Header = () => {
    const { countryList, isLogin } = useContext(mycontext);

    return (
        <>
            <div className='headeWrapper'>
                <div className='top-strip bg-red'>
                    <div class="container">
                        <p className='mb-0 mt-0 text-center'>Due to the <b>COVID 19</b> epidemic, orders may be processed with a slight delay</p>
                    </div>
                </div>

                <header className='header'>
                    <div className='container'>
                        <div className='row justify-content-start'>
                            <div className='logoWrapper d-flex align-items-center col-sm-2'>
                                <Link to={'/'}>
                                    <img src={Logo} alt='Logo' />
                                </Link>
                            </div>
                            <div className='col-sm-10 d-flex align-items-center part2'>
                                {countryList.length > 0 && <CountryDropDown />}
                                <SearchBox />

                                <div className='part3 d-flex align-items-center ml-auto'>
                                    {
                                        !isLogin ? (
                                            <Link to="/signIn" >
                                                <Button className='btn-red btn-mid mr-3'>
                                                    Sign In
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button className='circle mr-3'>
                                                <FaUser />
                                            </Button>
                                        )
                                    }

                                    <div className='ml-auto carttab d-flex align-items-center'>
                                        <span className='price'>₹100</span>
                                        <div className='position-relative ml-2'>
                                            <Button className='circle'> <FaShoppingBag /></Button>
                                            <span className='cart-count d-flex align-items-center justify-content-center' >1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <Navigation />

            </div >
        </>
    );
}

export default Header;
