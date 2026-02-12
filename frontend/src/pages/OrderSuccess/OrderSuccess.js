import Button from "@mui/material/Button";
import {useContext, useEffect} from 'react';
import {mycontext} from "../../App";

const OrderSuccess = () => {
    const {setIsHeaderFooterVisible} = useContext(mycontext);
    useEffect(() => {
        setIsHeaderFooterVisible(false);
        return () => setIsHeaderFooterVisible(true);
    }, []);
    return (
        <div className="text-center mt-5">
            <h2>🎉 Order Placed Successfully!</h2>
            <p>Your payment was successful.</p>
            <Button href="/my-orders">
                View Orders
            </Button>
        </div>
    );
};

export default OrderSuccess;