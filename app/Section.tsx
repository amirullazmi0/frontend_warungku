import React from 'react'
import Tron from './component/user/Tron'
import CardItemStore from './component/CardItemStore'


const Section = () => {
    return (
        <section>
            <Tron />
            <div className="card bg-white mt-4 shadow-lg">
                <div className="card-body grid grid-cols-4 gap-4">
                    <CardItemStore
                        name='Shoes'
                        address='Pontianak, Indonesia'
                        images={'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'}
                        price={154000}
                        wishlist=''
                    />
                    <CardItemStore
                        name='Kursi Kantor Gaming'
                        address='Pontianak, Indonesia'
                        images={'https://telkomschools.sch.id/wp-content/uploads/2020/06/1-3-1.jpg'}
                        price={50000}
                        wishlist=''
                    />
                    <CardItemStore
                        name='Table'
                        address='Pontianak, Indonesia'
                        images={'https://casamaria.co.uk/cdn/shop/products/RoomRoundHerringULegs_1200x.jpg?v=1669302813'}
                        price={500000}
                        wishlist=''
                    />
                </div>
            </div>
        </section>
    )
}

export default Section
