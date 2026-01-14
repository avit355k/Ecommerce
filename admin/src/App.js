import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard/index';
import Header from './components/Header/index';
import Sidebar from './components/Sidebar';
import {createContext, useEffect, useState} from 'react';
import Login from './pages/Login';
import Signup from "./pages/SignUp";

const Mycontext = createContext();

function App() {

    const [isToggleSidebar, setIsToggleSidebar] = useState(true);
    const [isLogin, setisLogin] = useState(false);
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
                        </Routes>
                    </div>
                </div>
            </Mycontext.Provider>
        </BrowserRouter>
    );
}

export default App;
export {Mycontext};
