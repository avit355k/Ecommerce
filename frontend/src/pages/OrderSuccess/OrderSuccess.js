import {useContext, useEffect} from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {mycontext} from "../../App";
import Button from "@mui/material/Button";

const OrderSuccess = () => {
    const {setIsHeaderFooterVisible} = useContext(mycontext);
    useEffect(() => {
        setIsHeaderFooterVisible(false);
        return () => setIsHeaderFooterVisible(true);
    }, []);

    return (
        <div className="order-success-container">
            <div className="success-card">
                <CheckCircleIcon className="success-icon"/>
                <h5 className="thank-you-text">THANK YOU!</h5>
                <h2 className="order-title">YOUR ORDER IS CONFIRMED</h2>
                <p className="order-subtext">
                    Your payment is received Successfully!
                </p>
                <div className="d-flex align-items-center justify-content-center">
                    <Button
                        variant="contained"
                        className="view-orders-btn"
                        href="/my-orders"
                    >
                        View Orders
                    </Button>

                    <Button
                        variant="contained"
                        className="continue-shopping-btn ml-3"
                        href="/"
                    >
                        Continue Shopping
                    </Button>
                </div>

            </div>

        </div>
    );
};

export default OrderSuccess;