import React from 'react'
import EventCard from '../Events/EventCard'
import Container from '../../layout/Container'

const Events = () => {
    return (
        <div className='p-8'>
            <Container>
                <EventCard />
            </Container>
        </div>
    )
}

export default Events
