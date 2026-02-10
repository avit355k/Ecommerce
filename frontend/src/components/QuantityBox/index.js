import React from "react";
import {FaMinus, FaPlus} from "react-icons/fa6";
import Button from "@mui/material/Button";

const QuantityBox = ({value, setValue, max}) => {

    const minus = () => {
        if (value <= 1) return;
        setValue(value - 1);
    };

    const plus = () => {
        if (max && value >= max) return;
        setValue(value + 1);
    };

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={minus}><FaMinus/></Button>
            <input type="text" readOnly value={value}/>
            <Button onClick={plus}><FaPlus/></Button>
        </div>
    );
};

export default QuantityBox;
