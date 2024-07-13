import React from 'react'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
const SidebarItem = () => {
    return (
        <div>
            <div className="sticky flex justify-center items-end">
                <div className="txt-primary"><ShoppingBagIcon sx={{ fontSize: 50 }} /></div>
                <div className="font-bold txt-primary text-2xl">
                    Warung Ku
                </div>
            </div>
        </div>
    )
}

export default SidebarItem
