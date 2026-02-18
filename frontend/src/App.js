import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header/index';
import {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import API from "./Services/api";

import Footer from './components/Footer';
import Listings from './pages/Listings';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Checkout from './pages/CheckOut';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";


const mycontext = createContext();

function App() {

    const [cityList, setCityList] = useState([]);
    const [isHeaderFooterVisible, setIsHeaderFooterVisible] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    //global cart state
    const [cartData, setCartData] = useState({
        totalItems: 0,
        totalPrice: 0
    });
    //global wishlist state
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistLoaded, setWishlistLoaded] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLogin(true);
        }
    }, []);


    useEffect(() => {
        getIndianCities();
    }, []);

    const getIndianCities = async () => {
        try {
            const response = await axios.post(
                "https://countriesnow.space/api/v0.1/countries/cities",
                {
                    country: "India"
                }
            );

            setCityList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching Indian cities:", error);
        }
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                const response = await API.get("/api/wishlist");

                const productIds = response.data.items.map(
                    item => item.product?._id || item.product
                );

                setWishlistItems(productIds);
                setWishlistLoaded(true);

            } catch (error) {
                console.error("Wishlist load error:", error);
            }
        };

        if (isLogin) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setWishlistLoaded(false);
        }

    }, [isLogin]);


    const toggleWishlist = async (productId) => {

        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            return;
        }

        const exists = wishlistItems.includes(productId);
        const previousState = [...wishlistItems];

        // Optimistic Update
        if (exists) {
            setWishlistItems(prev => prev.filter(id => id !== productId));
        } else {
            setWishlistItems(prev => [...prev, productId]);
        }

        try {
            await API.post("/api/wishlist/toggle", {productId});
        } catch (error) {
            console.error("Wishlist update failed:", error);
            setWishlistItems(previousState); // rollback
        }
    };


    return (
        <BrowserRouter>
            <mycontext.Provider
                value={{
                    cityList, isHeaderFooterVisible, setIsHeaderFooterVisible, isLogin, setIsLogin, cartData,
                    setCartData, wishlistItems, wishlistLoaded, toggleWishlist
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
                    <Route path="/my-account" exact={true} element={<MyAccount/>}/>
                    <Route path="/my-account/orders" exact={true} element={<MyOrders/>}/>
                    <Route path="/my-account/orders/order-details/:id" exact={true} element={<OrderDetails/>}/>
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