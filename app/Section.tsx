'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tron from './component/user/Tron';
import CardItemStore from './component/CardItemStore';

interface IItemStore {
  id: string;
  name: string;
  qty: number;
  price: number;
  desc: string | null;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  storeAddress: {
    kota: string | null;
    provinsi: string | null;
  } | null;
  itemStorageImage: {
    path: string | null;
  } | null;
}

const Section = () => {
  const [items, setItems] = useState<IItemStore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItemStores = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          data: { record: number; item: IItemStore[] };
        }>(`${process.env.API_URL}/api/store/item-store`);

        if (response.data.success) {
          setItems(response.data.data.item);
        }
      } catch (error) {
        console.error('Failed to fetch item stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemStores();
  }, []);

  if (loading) {
    return <div>Loading items...</div>;
  }

  return (
    <section>
      <Tron />
      <div className="card bg-white mt-4 shadow-lg">
        <div className="card-body grid grid-cols-4 gap-4">
          {items.map((item) => (
            <CardItemStore
              key={item.id}
              name={item.name}
              address={
                item.storeAddress?.kota
                  ? item.storeAddress.kota
                  : 'Unknown address'
              }
              images={
                item.itemStorageImage?.path
                  ? item.itemStorageImage.path
                  : 'https://cdnpro.eraspace.com/media/catalog/product/m/a/macbook_air_m1_space_gray_1.jpg'
              }
              price={item.price}
              wishlist=""
              itemId={item.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section;
