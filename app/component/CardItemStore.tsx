'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Props {
  images: string | string[];
  name: string;
  price: number;
  address: string;
  wishlist: string;
  itemId: string;
}

const CardItemStore: React.FC<Props> = ({
  images,
  name,
  price,
  address,
  wishlist,
  itemId,
}) => {
  const [wishListStatus, setWishListStatus] = useState<boolean>(false);

  const handleWishListStatus = () => {
    setWishListStatus((prev) => !prev);
  };

  const handleAddToCart = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.post(`${process.env.API_URL}/api/cart/add`, {
        accessToken,
        itemStoreId: itemId,
        qty: 1,
      });

      if (response.data.success) {
        alert('Item added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  };

  return (
    <div className="card bg-white w-full shadow-xl relative">
      <figure className="relative h-[30vh] aspect-square overflow-hidden">
        <Image
          src={typeof images === 'string' ? images : images[0]}
          alt="Product Image"
          fill
          className="object-cover hover:scale-105 duration-200"
        />
      </figure>

      <div className="card-body h-[30vh] aspect-square">
        <h2 className="card-title">{name}</h2>
        <p>Rp. {price},-</p>
        <div className="text-xs flex items-center">
          <div className="txt-primary">
            <PlaceIcon />
          </div>
          {address}
        </div>
        <div className="card-actions justify-between">
          <button
            onClick={handleWishListStatus}
            className="active:scale-90 duration-200"
          >
            {wishListStatus ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>
          <button
            onClick={handleAddToCart}
            className="active:scale-90 duration-200 flex items-center"
          >
            <ShoppingCartOutlinedIcon className="mr-1" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardItemStore;
