import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Chart } from "react-google-charts";

const filterOptions = ["Last Day", "Last Week", "Last Month", "Last Year"];

const pieData = [
    ["Year", "Sales"],
    ["2013", 2580],
    ["2014", 3030],
    ["2015", 1710],
    ["2016", 1030],
];

const pieOptions = {
    legend: {
        position: "right",
        textStyle: { color: "#fff", fontSize: 12 },
    },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
    chartArea: { width: "90%", height: "80%" },
};

const ITEM_HEIGHT = 48;

const Graphbox = ({ color }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState("Last Month");

    return (
        <div
            className="graphBox"
            style={{
                backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
            }}
        >
            {/* Header */}
            <div className="graphBoxHeader">
                <div>
                    <h4>Total Sales</h4>
                    <h2>$3,787,681.00</h2>
                    <p>$3,578.90 in last month</p>
                </div>

                <Button
                    className="toogleIcon"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <HiDotsVertical />
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                        },
                    }}
                >
                    {filterOptions.map((option) => (
                        <MenuItem
                            key={option}
                            selected={option === selectedOption}
                            onClick={() => {
                                setSelectedOption(option);
                                setAnchorEl(null);
                            }}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>

            {/* Chart */}
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="100%"
                    data={pieData}
                    options={pieOptions}
                />
            </div>
        </div>
    );
};

export default Graphbox;
