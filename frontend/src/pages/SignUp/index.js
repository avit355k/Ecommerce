import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import {FcGoogle} from "react-icons/fc";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebook} from '@fortawesome/free-brands-svg-icons';

import Logo from '../../assets/images/Logo1.jpg';

import {mycontext} from '../../App';
import API from '../../Services/api';

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {firebaseApp} from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
    const {setIsHeaderFooterVisible} = useContext(mycontext);
    const {setIsLogin} = useContext(mycontext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsHeaderFooterVisible(false);
        return () => setIsHeaderFooterVisible(true);
    }, [setIsHeaderFooterVisible]);

    // handle input change
    const handelChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    // handle form submit
    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const {data} = await API.post('/api/user/signup', formData);

            console.log("Signup response:", data);

            if (data.success) {
                alert(data.message);
                navigate('/signIn');
            }
        } catch (error) {
            alert(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    //google Auth
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const fields = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL || "https://res.cloudinary.com/dw2gks8uv/image/upload/v1771607674/user-png_vhg2dz.png",
                phone: user.phoneNumber,
            };

            const {data} = await API.post("/api/user/authWithGoogle", fields);

            if (data.success) {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("_id", data.user._id);
                sessionStorage.setItem("user", JSON.stringify(data.user));

                setIsLogin(true);
                alert("Google Login successful");
                navigate("/");
            }

        } catch (error) {
            console.error(error);
            alert("Google login failed");
        }
    };

    return (
        <section className="section signin-page">
            <div className='shape-button'>
                <svg
                    viewBox="0 0 1921 820"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="url(#gradient)"
                        d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
                    ></path>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#d8363a"/>
                            <stop offset="100%" stopColor="#dd3675"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="container">
                <div className='box card shadow border-0'>
                    <div className='text-center mt-2'>
                        <img src={Logo} alt='logo' style={{width: '180px'}}/>
                    </div>

                    <form className='mt-0' onSubmit={handelSubmit}>
                        <h2>Sign Up</h2>

                        <div className='row mb-3'>
                            <div className='col-md-6'>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name='name'
                                    value={formData.name}
                                    onChange={handelChange}
                                    type="text"
                                    variant="standard"
                                    required
                                    className='w-100'
                                />
                            </div>
                            <div className='col-md-6'>
                                <TextField
                                    fullWidth
                                    label="Phone No"
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handelChange}
                                    type="number"
                                    variant="standard"
                                    required
                                    className='w-100'
                                />
                            </div>
                        </div>
                        <div className='form-group mb-3'>
                            <TextField
                                fullWidth
                                label="Email"
                                name='email'
                                value={formData.email}
                                onChange={handelChange}
                                type="email"
                                variant="standard"
                                required
                                className='w-100'
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <TextField
                                fullWidth
                                label="Password"
                                name='password'
                                value={formData.password}
                                onChange={handelChange}
                                type="password"
                                variant="standard"
                                required
                                className='w-100'
                            />
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{mt: 2, fontWeight: "bold", bgcolor: "#ed184a"}}
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>

                        <p className='txt text-center mt-3'>
                            Already Registered? <Link to="/signIn" className=" cursor">Sign In</Link>
                        </p>

                        <h5 className='mt-3 text-center font-weight-bold'>Or continue with social account</h5>

                        <ul className='list list-inline mt-3 mb-3 socials text-center'>
                            <li className='list-inline-item mx-2'>
                                <Button
                                    onClick={signInWithGoogle}
                                >
                                    <FcGoogle size={35}/>
                                </Button>
                            </li>
                            <li className='list-inline-item mx-2'>
                                <Button>
                                    <FontAwesomeIcon icon={faFacebook} size="2x"/>
                                </Button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignUp;