import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../../layout/Container';

const ShopDetail = () => {

    const { id } = useParams()

    const shop =
    {
        name: "Example Shop 1",
        userId: "60e5d8c6e9564a1234567890", // Replace with a valid ObjectId for the user
        email: "shop1@example.com",
        description: "This is a sample description for Shop 1.",
        address: "123 Main St, City, Country",
        phoneNumber: 1234567890,
        avatar: "https://example.com/avatar1.jpg",
        zipCode: 12345,
        Balance: 1000,
        transections: [], // Assuming no transactions initially
        createdAt: new Date(), // Current date and time
    }
    return (
        <div className="p-8">
            <Container>
                <div>photo</div>
                <div>
                    <nav>
                        <ul>
                            <li>Shop infos</li>
                            <li>Products</li>
                            <li>New arrivals</li>
                            <li>Reviews</li>
                        </ul>
                    </nav>
                    <div>
                        content
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ShopDetail;
