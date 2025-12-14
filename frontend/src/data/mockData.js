export const CATEGORIES = [
    { id: '1', name: 'Vehicles', icon: 'DirectionsCar', color: '#ffecb3' },
    { id: '2', name: 'Properties', icon: 'Home', color: '#e1bee7' },
    { id: '3', name: 'Electronics', icon: 'Smartphone', color: '#bbdefb' },
    { id: '4', name: 'Furniture', icon: 'Weekend', color: '#c8e6c9' },
    { id: '5', name: 'Services', icon: 'Build', color: '#f8bbd0' },
    { id: '6', name: 'Fashion', icon: 'Checkroom', color: '#ffe0b2' },
    { id: '7', name: 'Health', icon: 'FitnessCenter', color: '#b2dfdb' },
    { id: '8', name: 'Jobs', icon: 'Work', color: '#d1c4e9' },
];

export const LISTINGS = [
    {
        id: '101',
        title: 'Toyota Camry 2018 Clean Title',
        category: 'Vehicles',
        price: 4500000,
        currency: 'KES',
        location: 'Nairobi, Kilimani',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=500',
        postedAt: '2 hours ago',
        vendor: {
            name: 'John Motors',
            phone: '+254700000000',
            whatsapp: '254700000000'
        },
        description: 'Clean foreign used Toyota Camry 2018. Low mileage, accident free. Buy and drive.'
    },
    {
        id: '102',
        title: 'iPhone 13 Pro Max 256GB',
        category: 'Electronics',
        price: 120000,
        currency: 'KES',
        location: 'Mombasa, CBD',
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=500',
        postedAt: '1 day ago',
        vendor: {
            name: 'Gadget World',
            phone: '+254711111111',
            whatsapp: '254711111111'
        },
        description: 'UK used iPhone 13 Pro Max, 256GB. Battery health 95%. Comes with charger.'
    },
    {
        id: '103',
        title: 'Modern 3 Bedroom Apartment',
        category: 'Properties',
        price: 85000,
        currency: 'KES/mo',
        location: 'Kiambu, Ruaka',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500',
        postedAt: '3 days ago',
        vendor: {
            name: 'Real Homes Agencies',
            phone: '+254722222222',
            whatsapp: '254722222222'
        },
        description: 'Spacious 3 bedroom apartment in Ruaka. Master ensuite, high speed lifts, borehole water.'
    },
    {
        id: '104',
        title: 'L-Shaped Sofa Grey',
        category: 'Furniture',
        price: 35000,
        currency: 'KES',
        location: 'Nairobi, Westlands',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=500',
        postedAt: '5 hours ago',
        vendor: {
            name: 'Sarah Interiors',
            phone: '+254733333333',
            whatsapp: '254733333333'
        },
        description: 'Comfortable L-shaped sofa, grey fabric. good condition.'
    },
    {
        id: '105',
        title: 'Web Development Services',
        category: 'Services',
        price: 0,
        currency: 'Contact',
        location: 'Remote',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=500',
        postedAt: '1 week ago',
        vendor: {
            name: 'Dev Solutions',
            phone: '+254744444444',
            whatsapp: '254744444444'
        },
        description: 'Professional web development services. React, Django, Node.js.'
    }
];
