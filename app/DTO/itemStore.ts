export interface itemStore {
    id: string;
    name: string;
    qty: number;
    price: number;
    desc: string;
    createdAt: Date;
    updatedAt: Date;

    store: {
        id: string,
        name: string
    }

    itemStorageImage: {
        path: string;
    }[];

    wishlist: boolean;

    storeAddress: {
        kota: string;
        provinsi: string;
    };

    categories: {
        id: string,
        name: string
    }[]
}

export interface CategoryDTO {
    id: string
    name: string
  }
  