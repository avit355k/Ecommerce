import React, { useContext, useEffect } from 'react';
import { mycontext } from '../../App';
import Logo from '../../assets/images/Logo1.jpg';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const SignUp = () => {
  const { setIsHeaderFooterVisible } = useContext(mycontext);

  useEffect(() => {
    setIsHeaderFooterVisible(false);
    return () => setIsHeaderFooterVisible(true);
  }, [setIsHeaderFooterVisible]);

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
              <stop offset="0%" stopColor="#d8363a" />
              <stop offset="100%" stopColor="#dd3675" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container">
        <div className='box card shadow border-0'>
          <div className='text-center mt-2'>
            <img src={Logo} alt='logo' style={{ width: '180px' }} />
          </div>

          <form className='mt-0'>
            <h2 >Sign Up</h2>

            <div className='row mb-3'>
              <div className='col-md-6'>
                <TextField
                  fullWidth
                  label="Name"
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
              sx={{ mt: 2, fontWeight: "bold", bgcolor: "#ed184a" }}
            >
              Register
            </Button>

            <p className='txt text-center mt-3'>
              Already Registered? <Link to="/signIn" className="border-effect cursor">Sign In</Link>
            </p>

            <h5 className='mt-3 text-center font-weight-bold'>Or continue with social account</h5>

            <ul className='list list-inline mt-3 mb-3 socials text-center'>
              <li className='list-inline-item mx-2'>
                <Link to="#"><FcGoogle size={40} /></Link>
              </li>
              <li className='list-inline-item mx-2'>
                <Link to="#"><FontAwesomeIcon icon={faFacebook} size="2x" /></Link>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
