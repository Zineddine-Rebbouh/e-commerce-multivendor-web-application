import React, { useEffect } from 'react'
import Container from '../../layout/Container'
import Banner from '../Hero/Banner'
import BestDeals from './BestDeals'
import FeaturedProducts from './FeaturedProducts'
import EventCard from '../Events/EventCard'
import { useDispatch } from 'react-redux'
import { getUserCartItems } from '../../redux/actions/cart'
import { useSelector } from 'react-redux'
import { getUserWhilistItems } from '../../redux/actions/wishlist'
import { getAllOrdersOfUser } from '../../redux/actions/order'



const Home = () => {


    const { user } = useSelector( state => state.user )
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( getAllOrdersOfUser( user?._id ) );
    }, [ user?._id ] )

    return (
        <div className='p-8'>
            <Container>
                <div>
                    <Banner />
                    <BestDeals />
                    <EventCard />
                    <FeaturedProducts />
                </div>
            </Container>
        </div>
    )
}

export default Home
