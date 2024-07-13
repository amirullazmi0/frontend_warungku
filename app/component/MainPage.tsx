import React, { ReactNode } from 'react'

interface MainPageProps {
    children: ReactNode;
}

const MainPage: React.FC<MainPageProps> = ({ children }) => {
    return (
        <div className='bgr-page w-full'>
            {children}
        </div>
    )
}

export default MainPage
