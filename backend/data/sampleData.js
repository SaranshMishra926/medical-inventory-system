// Sample medical inventory data for backend fallback
const sampleData = {
  medicines: [
    {
      _id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      manufacturer: 'Cipla Ltd.',
      batchNumber: 'PC001',
      expiryDate: '2025-12-31T00:00:00.000Z',
      quantity: 1500,
      unit: 'tablets',
      unitPrice: 2.50,
      supplier: '1',
      location: 'A1-B2',
      minimumStockLevel: 200,
      maximumStockLevel: 2000,
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      manufacturer: 'Sun Pharma',
      batchNumber: 'AM002',
      expiryDate: '2025-06-30T00:00:00.000Z',
      quantity: 800,
      unit: 'capsules',
      unitPrice: 15.75,
      supplier: '2',
      location: 'B1-C3',
      minimumStockLevel: 100,
      maximumStockLevel: 1000,
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '3',
      name: 'Insulin Glargine',
      genericName: 'Insulin',
      category: 'Diabetes',
      manufacturer: 'Lupin Limited',
      batchNumber: 'IN003',
      expiryDate: '2024-11-15T00:00:00.000Z',
      quantity: 45,
      unit: 'vials',
      unitPrice: 450.00,
      supplier: '3',
      location: 'C1-D2',
      minimumStockLevel: 10,
      maximumStockLevel: 100,
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '4',
      name: 'Metformin 500mg',
      genericName: 'Metformin Hydrochloride',
      category: 'Diabetes',
      manufacturer: 'Dr. Reddy\'s Laboratories',
      batchNumber: 'MF004',
      expiryDate: '2026-03-20T00:00:00.000Z',
      quantity: 1200,
      unit: 'tablets',
      unitPrice: 8.25,
      supplier: '1',
      location: 'A2-B3',
      minimumStockLevel: 150,
      maximumStockLevel: 1500,
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '5',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'Antacid',
      manufacturer: 'Cadila Healthcare',
      batchNumber: 'OM005',
      expiryDate: '2025-09-10T00:00:00.000Z',
      quantity: 600,
      unit: 'capsules',
      unitPrice: 12.50,
      supplier: '2',
      location: 'B2-C4',
      minimumStockLevel: 80,
      maximumStockLevel: 800,
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  suppliers: [
    {
      _id: '1',
      name: 'MediCare Distributors',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh.kumar@medicare.in',
      phone: '+91-9876543210',
      address: {
        street: '101, Pharma Tower',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400051',
        country: 'India'
      },
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      name: 'Pharma Solutions Ltd',
      contactPerson: 'Priya Sharma',
      email: 'priya.sharma@pharmasolutions.in',
      phone: '+91-9911223344',
      address: {
        street: 'Unit 205, Health Hub',
        city: 'Gurugram',
        state: 'Haryana',
        zipCode: '122008',
        country: 'India'
      },
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '3',
      name: 'Global Health Supplies',
      contactPerson: 'Amit Patel',
      email: 'amit.patel@globalhealth.in',
      phone: '+91-8800112233',
      address: {
        street: '50, Biotech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560100',
        country: 'India'
      },
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  orders: [
    {
      _id: '1',
      orderNumber: 'ORD001',
      supplier: '1',
      items: [
        { medicine: '1', quantity: 100, price: 2.50 },
        { medicine: '2', quantity: 50, price: 15.75 }
      ],
      totalAmount: 1037.50,
      orderDate: '2024-01-10T00:00:00.000Z',
      expectedDeliveryDate: '2024-01-15T00:00:00.000Z',
      status: 'delivered',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      orderNumber: 'ORD002',
      supplier: '2',
      items: [
        { medicine: '4', quantity: 200, price: 8.25 },
        { medicine: '3', quantity: 30, price: 450.00 }
      ],
      totalAmount: 15150.00,
      orderDate: '2024-02-01T00:00:00.000Z',
      expectedDeliveryDate: '2024-02-07T00:00:00.000Z',
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: '3',
      orderNumber: 'ORD003',
      supplier: '3',
      items: [
        { medicine: '5', quantity: 150, price: 12.50 },
        { medicine: '1', quantity: 100, price: 2.50 }
      ],
      totalAmount: 2125.00,
      orderDate: '2024-03-05T00:00:00.000Z',
      expectedDeliveryDate: '2024-03-12T00:00:00.000Z',
      status: 'delivered',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
};

module.exports = sampleData;
