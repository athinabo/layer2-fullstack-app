import { ProductCategoryDto, ProductDto, SupplierDto } from '../../types/dtos/product.dto';

export const MOCK_SUPPLIERS: SupplierDto[] = [
    {
        id: '5a77e001-0000-0000-0000-000000000001',
        name: 'TechPro Electronics',
        contactEmail: 'sales@techpro.com',
        contactPhone: '+1-555-0100',
        address: {
            country: 'USA',
            city: 'San Francisco',
            county: 'San Francisco County',
            streetAddress: '123 Tech Street'
        }
    },
    {
        id: '5a77e002-0000-0000-0000-000000000002',
        name: 'Global Gadgets Ltd',
        contactEmail: 'info@globalgadgets.co.uk',
        contactPhone: '+44-20-7946-0958',
        address: {
            country: 'United Kingdom',
            city: 'London',
            county: 'Greater London',
            streetAddress: '45 Innovation Way'
        }
    },
    {
        id: '5a77e003-0000-0000-0000-000000000003',
        name: 'Fashion First Textiles',
        contactEmail: 'contact@fashionfirst.it',
        contactPhone: '+39-02-1234-5678',
        address: {
            country: 'Italy',
            city: 'Milan',
            county: 'Milan',
            streetAddress: 'Via della Moda 12'
        }
    },
    {
        id: '5a77e004-0000-0000-0000-000000000004',
        name: 'Urban Wear Co',
        contactEmail: 'sales@urbanwear.de',
        contactPhone: '+49-30-12345678',
        address: {
            country: 'Germany',
            city: 'Berlin',
            county: 'Berlin',
            streetAddress: 'Hauptstrasse 88'
        }
    },
    {
        id: '5a77e005-0000-0000-0000-000000000005',
        name: 'HomeComfort Solutions',
        contactEmail: 'info@homecomfort.nl',
        contactPhone: '+31-20-123-4567',
        address: {
            country: 'Netherlands',
            city: 'Amsterdam',
            county: 'North Holland',
            streetAddress: 'Keizersgracht 100'
        }
    },
    {
        id: '5a77e006-0000-0000-0000-000000000006',
        name: 'GreenLife Garden Supply',
        contactEmail: 'contact@greenlife.fr',
        contactPhone: '+33-1-23-45-67-89',
        address: {
            country: 'France',
            city: 'Paris',
            county: 'Île-de-France',
            streetAddress: '25 Rue du Jardin'
        }
    },
    {
        id: '5a77e007-0000-0000-0000-000000000007',
        name: 'ActiveLife Sports',
        contactEmail: 'sales@activelife.ca',
        contactPhone: '+1-416-555-0199',
        address: {
            country: 'Canada',
            city: 'Toronto',
            county: 'Ontario',
            streetAddress: '789 Sports Avenue'
        }
    },
    {
        id: '5a77e008-0000-0000-0000-000000000008',
        name: 'FitGear International',
        contactEmail: 'info@fitgear.com.au',
        contactPhone: '+61-2-9876-5432',
        address: {
            country: 'Australia',
            city: 'Sydney',
            county: 'New South Wales',
            streetAddress: '56 Fitness Road'
        }
    }
];

export const MOCK_CATEGORIES: ProductCategoryDto[] = [
    {
        id: 'cat-1',
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
    },
    {
        id: 'cat-2',
        name: 'Clothing',
        description: 'Apparel and fashion items'
    },
    {
        id: 'cat-3',
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies'
    },
    {
        id: 'cat-4',
        name: 'Sports',
        description: 'Sports equipment and accessories'
    }
];

export const MOCK_PRODUCTS: ProductDto[] = [
    {
        id: 'prod-1',
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 149.99,
        weight: 0.25,
        category: MOCK_CATEGORIES[0],
        supplier: MOCK_SUPPLIERS[0], // TechPro Electronics
        imageUrl: 'https://picsum.photos/seed/headphones/400/300'
    },
    {
        id: 'prod-2',
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 299.99,
        weight: 0.05,
        category: MOCK_CATEGORIES[0],
        supplier: MOCK_SUPPLIERS[1], // Global Gadgets Ltd
        imageUrl: 'https://picsum.photos/seed/smartwatch/400/300'
    },
    {
        id: 'prod-3',
        name: 'Bluetooth Speaker',
        description: 'Portable bluetooth speaker with deep bass',
        price: 79.99,
        weight: 0.5,
        category: MOCK_CATEGORIES[0],
        supplier: MOCK_SUPPLIERS[0], // TechPro Electronics
        imageUrl: 'https://picsum.photos/seed/speaker/400/300'
    },
    {
        id: 'prod-4',
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 24.99,
        weight: 0.2,
        category: MOCK_CATEGORIES[1],
        supplier: MOCK_SUPPLIERS[2], // Fashion First Textiles
        imageUrl: 'https://picsum.photos/seed/tshirt/400/300'
    },
    {
        id: 'prod-5',
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans',
        price: 59.99,
        weight: 0.6,
        category: MOCK_CATEGORIES[1],
        supplier: MOCK_SUPPLIERS[3], // Urban Wear Co
        imageUrl: 'https://picsum.photos/seed/jeans/400/300'
    },
    {
        id: 'prod-6',
        name: 'Garden Hose',
        description: 'Durable 50ft garden hose with spray nozzle',
        price: 34.99,
        weight: 2.5,
        category: MOCK_CATEGORIES[2],
        supplier: MOCK_SUPPLIERS[4], // HomeComfort Solutions
        imageUrl: 'https://picsum.photos/seed/hose/400/300'
    },
    {
        id: 'prod-7',
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with multiple brightness levels',
        price: 44.99,
        weight: 0.8,
        category: MOCK_CATEGORIES[2],
        supplier: MOCK_SUPPLIERS[5], // GreenLife Garden Supply
        imageUrl: 'https://picsum.photos/seed/lamp/400/300'
    },
    {
        id: 'prod-8',
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with carrying strap',
        price: 29.99,
        weight: 1.2,
        category: MOCK_CATEGORIES[3],
        supplier: MOCK_SUPPLIERS[6], // ActiveLife Sports
        imageUrl: 'https://picsum.photos/seed/yogamat/400/300'
    },
    {
        id: 'prod-9',
        name: 'Running Shoes',
        description: 'Lightweight running shoes with cushioned sole',
        price: 89.99,
        weight: 0.7,
        category: MOCK_CATEGORIES[3],
        supplier: MOCK_SUPPLIERS[7], // FitGear International
        imageUrl: 'https://picsum.photos/seed/shoes/400/300'
    },
    {
        id: 'prod-10',
        name: 'Fitness Tracker',
        description: 'Water-resistant fitness tracker with heart rate monitor',
        price: 69.99,
        weight: 0.03,
        category: MOCK_CATEGORIES[3],
        supplier: MOCK_SUPPLIERS[6], // ActiveLife Sports
        imageUrl: 'https://picsum.photos/seed/tracker/400/300'
    }
];
