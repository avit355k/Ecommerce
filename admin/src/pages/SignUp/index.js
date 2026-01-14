import React, {useContext, useEffect, useState} from "react";
import {MdEmail, MdLock, MdVerifiedUser} from "react-icons/md";
import {FaUser} from "react-icons/fa";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Link} from "react-router-dom";
import {Mycontext} from "../../App";

const Signup = () => {
    const context = useContext(Mycontext);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        context.setisHideSidebarHeader(true);
    }, [context]);

    return (
        <section className="signupSection">
            <div className="signupBox">

                {/* Logo */}
                <div className="logo text-center">
                    <img
                        src="/logo/Logo-removebg.png"
                        alt="App Logo"
                        className="loginLogo signupLogo"
                    />
                    <h5 className="fw-bold mt-2 text-white">
                        Register a New Account
                    </h5>
                </div>

                {/* Card */}
                <div className="wrapper p-4 mt-3">
                    <form>

                        {/* Name */}
                        <div className="form-group mb-3 inputBox">
                            <span className="icon"><FaUser/></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Your Name"
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group mb-3 inputBox">
                            <span className="icon"><MdEmail/></span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group mb-3 inputBox">
                            <span className="icon"><MdLock/></span>

                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Password"
                                autoComplete="new-password"
                            />

                            <span
                                className="eyeIcon"
                                role="button"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                {showPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
              </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group mb-3 inputBox">
                            <span className="icon"><MdVerifiedUser/></span>

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                            />

                            <span
                                className="eyeIcon"
                                role="button"
                                onClick={() =>
                                    setShowConfirmPassword(prev => !prev)
                                }
                            >
                {showConfirmPassword
                    ? <AiOutlineEyeInvisible/>
                    : <AiOutlineEye/>}
              </span>
                        </div>

                        {/* Terms */}
                        <FormControlLabel
                            control={<Checkbox color="success"/>}
                            label="Agree to all terms & Conditions"
                        />

                        {/* Sign Up */}
                        <Button
                            variant="contained"
                            fullWidth
                            className="mb-3 SignupBtn"
                        >
                            Sign Up
                        </Button>

                        {/* OR */}
                        <div className="orDivider">
                            <span></span>
                            <p>OR</p>
                            <span></span>
                        </div>

                        {/* Google Signup */}
                        <Button
                            variant="outlined"
                            fullWidth
                            className="googleBtn"
                        >
                            <img src="/google-icon.png" width="22" alt="google"/>
                            <span className="ms-2">Register with Google</span>
                        </Button>

                    </form>

                    {/* Footer */}
                    <div className="footer mt-3 p-3 text-center">
            <span>
              Already have an account?
              <Link to="/login" className="ms-1">
                Login
              </Link>
            </span>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Signup;
