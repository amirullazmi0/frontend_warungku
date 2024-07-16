'use client'
import React, { useState } from 'react'
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface props {
    images: string | string[]
    name: string
    price: number
    address: string
    wishlist: string
}

const CardItemStore: React.FC<props> = ({ images, name, price, address, wishlist }) => {
    const [WishListStatus, setWishListStatus] = useState<boolean>(false)
    const handleWishListStatus = () => {
        const set = WishListStatus ? false : true
        setWishListStatus(set)
    }
    return (
        <div className="card bg-white w-full shadow-xl relative">
            <figure className='h-[30vh] aspect-square overflow-hidden'>
                <img
                    className='object-cover object-center h-full w-full hover:scale-105 duration-200'
                    src={`${images}`}
                    alt="Shoes" />
            </figure>
            <div className="card-body h-[30vh] aspect-square">
                <h2 className="card-title">
                    {name}
                    {/* <div className="badge badge-secondary">NEW</div> */}
                </h2>
                <p>Rp. {price},- </p>
                <div className='text-xs flex items-center'>
                    <div className="txt-primary"><PlaceIcon /></div>
                    {address}
                </div>
                <div className="card-actions justify-end">
                    <button onClick={handleWishListStatus} className='active:scale-90 duration-200'>
                        {WishListStatus ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardItemStore
