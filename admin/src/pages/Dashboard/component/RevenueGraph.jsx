import React, { useEffect } from "react";
import Chart from "react-apexcharts";

const RevenueGraph = () => {

    useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event("resize"));
        };

        // Trigger resize after sidebar animation
        const timeout = setTimeout(handleResize, 300);

        return () => clearTimeout(timeout);
    }, []); useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event("resize"));
        };

        // Trigger resize after sidebar animation
        const timeout = setTimeout(handleResize, 300);

        return () => clearTimeout(timeout);
    }, []);

    const series = [
        {
            name: "Revenue",
            data: [12000, 18000, 15000, 22000, 27000, 32000, 30000, 35000, 40000, 42000, 46000, 50000]
        },
        {
            name: "Avg Revenue",
            data: [10000, 14000, 13000, 17000, 21000, 25000, 24000, 26000, 30000, 32000, 35000, 38000]
        }
    ];

    const options = {
        chart: {
            type: "area",
            height: 300,
            toolbar: { show: false }
        },

        stroke: {
            curve: "smooth",
            width: 3
        },

        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1
            }
        },

        dataLabels: {
            enabled: false
        },

        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ]
        },

        tooltip: {
            theme: "dark"
        },

        colors: ["#4CAF50", "#2196F3"],

        legend: {
            position: "top",
            fontWeight: 600
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 220
                    }
                }
            }
        ]
    };

    return (
        <div className="revenueCard card shadow border-0 p-3">
            <h4 className="mb-3">Monthly Revenue</h4>

            <Chart
                options={options}
                series={series}
                type="area"
                height={250}
                width="100%"
            />

            <div className="revenueData d-flex flex-row mt-4">
                <p style={{ color: "#4cb04f" }}>
                    Total: <b style={{ color: "black" }}>₹573</b>
                </p>
                <p style={{ color: "#2294f2" }}>
                    Avg / month: <b style={{ color: "black" }}>₹450</b>
                </p>
            </div>
        </div>
    );
};

export default RevenueGraph;