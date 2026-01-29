import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard/index';
import Header from './components/Header/index';
import Sidebar from './components/Sidebar';
import {createContext, useEffect, useState} from 'react';
import Login from './pages/Login';
import Signup from "./pages/SignUp";
import ProductDetails from "./pages/ProductDetails";
import Productupload from "./pages/Productupload";
import CategoryAdd from "./pages/CategoryAdd";
import CategoryList from "./pages/CategoryList";

const Mycontext = createContext();

function App() {

    const [isToggleSidebar, setIsToggleSidebar] = useState(true);
    const [isLogin, setisLogin] = useState(true);
    const [isHideSidebarHeader, setisHideSidebarHeader] = useState(false);

    const values = {
        isToggleSidebar,
        setIsToggleSidebar,
        isLogin,
        setisLogin,
        isHideSidebarHeader,
        setisHideSidebarHeader
    };

    useEffect(() => {
        console.log(isToggleSidebar);
    }, [isToggleSidebar]);

    return (
        <BrowserRouter>

            <Mycontext.Provider value={values}>
                {
                    isHideSidebarHeader !== true &&
                    <Header/>
                }
                <div className='main d-flex'>
                    {
                        isHideSidebarHeader !== true &&
                        <div className={`sidebarWrapper ${!isToggleSidebar ? 'toggle' : ''}`}>
                            <Sidebar/>
                        </div>

                    }
                    <div
                        className={`content ${isHideSidebarHeader === true && 'full'} ${!isToggleSidebar ? 'toggle' : ''}`}>
                        <Routes>
                            <Route path="/" exact={true} element={<Dashboard/>}/>
                            <Route path="/login" exact={true} element={<Login/>}/>
                            <Route path="/sign-up" exact={true} element={<Signup/>}/>
                            <Route path="/category/list" exact={true} element={<CategoryList/>}/>
                            <Route path="/category/add" exact={true} element={<CategoryAdd/>}/>
                            <Route path="/product/details" exact={true} element={<ProductDetails/>}/>
                            <Route path="/product/upload" exact={true} element={<Productupload/>}/>
                        </Routes>
                    </div>
                </div>
            </Mycontext.Provider>
        </BrowserRouter>
    );
}

export default App;
export {Mycontext};
