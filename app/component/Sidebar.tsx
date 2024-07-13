import React, { ReactNode } from 'react'

interface SidebarProps {
    children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    return (
        <div className='bg-white w-[20%] p-4'>
            {children}
        </div>
    )
}

export default Sidebar
