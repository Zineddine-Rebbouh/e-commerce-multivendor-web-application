import React from 'react'
import Card from '../components/Card/card'
import Transactions from './Transactions'
import Chart from '../components/Chart/chart'
import Rightbar from '../components/Rightbar/Rightbar'

const Dashboard = () => {
    return (
        <div className='grid grid-cols-5 gap-5 mt-5 min-h-screen'>
            <div className='grid col-span-4 gap-5'>
                <div className='flex gap-5 justify-between'>
                    <Card type={ 'Total Customers' } amount={ '10' } parcentage={ 60 } />
                    <Card type={ 'Total Sellers' } amount={ '10' } parcentage={ 60 } />
                    <Card type={ 'Total Orders' } amount={ '10' } parcentage={ 60 } />
                    <Card type={ 'Total Requests' } amount={ '10' } parcentage={ 60 } />
                </div>
                <Transactions />
                <Chart />
            </div>
            <div className='col-span-1'>
                <Rightbar />
            </div>
        </div>
    )
}

export default Dashboard
