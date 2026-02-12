import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header/index';
import {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import Footer from './components/Footer';
import Listings from './pages/Listings';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Checkout from './pages/CheckOut';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';


const mycontext = createContext();

function App() {

    const [countryList, setCountryList] = useState([]);
    const [isHeaderFooterVisible, setIsHeaderFooterVisible] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    //global cart state
    const [cartData, setCartData] = useState({
        totalItems: 0,
        totalPrice: 0
    });
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLogin(true);
        }
    }, []);


    useEffect(() => {
        getCountry("https://countriesnow.space/api/v0.1/countries/");
    }, []);

    const getCountry = async (url) => {
        try {
            const response = await axios.get(url);
            setCountryList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching country data:", error);
        }
    };

    return (
        <BrowserRouter>
            <mycontext.Provider
                value={{
                    countryList, isHeaderFooterVisible, setIsHeaderFooterVisible, isLogin, setIsLogin, cartData,
                    setCartData
                }}>
                {
                    isHeaderFooterVisible && <Header/>
                }
                <Routes>
                    <Route path="/" exact={true} element={<Home/>}/>
                    <Route path="/category/:slug" exact={true} element={<Listings/>}/>
                    <Route path="/product/:id" exact={true} element={<ProductDetails/>}/>
                    <Route path="/cart" exact={true} element={<Cart/>}/>
                    <Route path="/checkout" exact={true} element={<Checkout/>}/>
                    <Route path="/order-success" element={<OrderSuccess/>}/>
                    <Route path="/signIn" exact={true} element={<SignIn/>}/>
                    <Route path="/signUp" exact={true} element={<SignUp/>}/>
                </Routes>
                {
                    isHeaderFooterVisible && <Footer/>
                }

            </mycontext.Provider>
        </BrowserRouter>

    );
}

export default App;
export {mycontext};