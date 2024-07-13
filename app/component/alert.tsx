import React from 'react'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';

const AlertSuccess: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className='h-screen w-screen fixed top-0 left-0 flex justify-center items-center z-50 bgr-transparant'>
            <div className="card bg-white shadow-xl max-w-[80%]">
                <div className="card-body flex justify-center items-center">
                    <div className="">
                        <DoneOutlineOutlinedIcon sx={{ fontSize: 100 }} color='success' />
                    </div>
                    {/* <Image src={DoneOutlineOutlinedIcon} alt='icon-success' height={100} width={200} /> */}
                    <div className="m-4 text-center">{message}</div>
                    <CircularProgress color="success" />
                </div>
            </div>
        </div>
    )
}

export { AlertSuccess }
