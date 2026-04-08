import React, { useEffect} from 'react'

const DashboardBox = (props) => {
    useEffect(() => {
        console.log(props.color);
    }, [props.color]);

    return (
        <>
            <div className='dashboardBox' style={{
                backgroundImage: `linear-gradient(to right, ${props.color[0]}, ${props.color[1]})`,
            }}>
                <div className='d-flex justify-content-between w-100 align-items-center'>
                    <div className='col1'>
                        <h4 className='text-white'>{props.title}</h4>
                        <span className='text-white'>{props.value}</span>
                    </div>
                    <div className='ml-auto'>
                        <span className='icon'>
                            {props.icon}
                        </span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default DashboardBox;