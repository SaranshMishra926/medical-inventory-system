const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../models/Medicine');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use your MongoDB Atlas connection string directly
    const mongoURI = 'mongodb+srv://Saransh:Saransh123@cluster0.hzpgrzt.mongodb.net/meditrack?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('📊 Connected to MongoDB Atlas for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

// Real medical inventory data
const medicines = [
  {
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    category: 'Over-the-Counter',
    manufacturer: 'Sun Pharma',
    batchNumber: 'PAR2024001',
    expiryDate: new Date('2025-12-31'),
    quantity: 1500,
    unit: 'tablets',
    unitPrice: 2.50,
    totalPrice: 3750.00,
    supplier: null, // Will be set after suppliers are created
    location: 'A-01-01',
    minimumStockLevel: 100,
    maximumStockLevel: 2000,
    description: 'Pain relief and fever reducer',
    status: 'active'
  },
  {
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'Cipla',
    batchNumber: 'AMX2024002',
    expiryDate: new Date('2025-08-15'),
    quantity: 800,
    unitPrice: 15.75,
    minStockLevel: 50,
    maxStockLevel: 1000,
    description: 'Broad spectrum antibiotic',
    storageLocation: 'B-02-03',
    status: 'active'
  },
  {
    name: 'Insulin Glargine',
    genericName: 'Insulin Glargine',
    category: 'Hormone',
    manufacturer: 'Novo Nordisk',
    batchNumber: 'INS2024003',
    expiryDate: new Date('2024-11-30'),
    quantity: 45,
    unitPrice: 450.00,
    minStockLevel: 20,
    maxStockLevel: 100,
    description: 'Long-acting insulin for diabetes',
    storageLocation: 'C-01-05',
    status: 'active'
  },
  {
    name: 'Metformin 500mg',
    genericName: 'Metformin HCl',
    category: 'Antidiabetic',
    manufacturer: 'Dr. Reddy\'s',
    batchNumber: 'MET2024004',
    expiryDate: new Date('2026-03-20'),
    quantity: 1200,
    unitPrice: 8.25,
    minStockLevel: 200,
    maxStockLevel: 1500,
    description: 'First-line treatment for type 2 diabetes',
    storageLocation: 'A-03-02',
    status: 'active'
  },
  {
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitor',
    manufacturer: 'Torrent Pharma',
    batchNumber: 'OME2024005',
    expiryDate: new Date('2025-09-10'),
    quantity: 600,
    unitPrice: 12.50,
    minStockLevel: 100,
    maxStockLevel: 800,
    description: 'Treatment for acid reflux and ulcers',
    storageLocation: 'B-01-04',
    status: 'active'
  },
  {
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Statin',
    manufacturer: 'Lupin',
    batchNumber: 'ATO2024006',
    expiryDate: new Date('2025-07-25'),
    quantity: 900,
    unitPrice: 18.75,
    minStockLevel: 150,
    maxStockLevel: 1200,
    description: 'Cholesterol-lowering medication',
    storageLocation: 'A-02-06',
    status: 'active'
  },
  {
    name: 'Salbutamol Inhaler',
    genericName: 'Salbutamol',
    category: 'Bronchodilator',
    manufacturer: 'GSK',
    batchNumber: 'SAL2024007',
    expiryDate: new Date('2025-05-15'),
    quantity: 75,
    unitPrice: 125.00,
    minStockLevel: 25,
    maxStockLevel: 150,
    description: 'Relief for asthma and COPD',
    storageLocation: 'C-02-01',
    status: 'active'
  },
  {
    name: 'Aspirin 75mg',
    genericName: 'Acetylsalicylic Acid',
    category: 'Antiplatelet',
    manufacturer: 'Bayer',
    batchNumber: 'ASP2024008',
    expiryDate: new Date('2026-01-30'),
    quantity: 2000,
    unitPrice: 1.25,
    minStockLevel: 500,
    maxStockLevel: 3000,
    description: 'Cardiovascular protection',
    storageLocation: 'A-01-08',
    status: 'active'
  },
  {
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    category: 'ACE Inhibitor',
    manufacturer: 'Zydus',
    batchNumber: 'LIS2024009',
    expiryDate: new Date('2025-10-20'),
    quantity: 750,
    unitPrice: 22.50,
    minStockLevel: 100,
    maxStockLevel: 1000,
    description: 'Blood pressure management',
    storageLocation: 'B-03-05',
    status: 'active'
  },
  {
    name: 'Warfarin 5mg',
    genericName: 'Warfarin Sodium',
    category: 'Anticoagulant',
    manufacturer: 'Abbott',
    batchNumber: 'WAR2024010',
    expiryDate: new Date('2025-06-12'),
    quantity: 300,
    unitPrice: 35.00,
    minStockLevel: 50,
    maxStockLevel: 500,
    description: 'Blood thinner for clot prevention',
    storageLocation: 'C-03-07',
    status: 'active'
  }
];

const suppliers = [
  {
    name: 'MediCare Distributors',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@medicare.com',
    phone: '+91-9876543210',
    address: {
      street: '123 Medical Hub',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    licenseNumber: 'LIC001',
    gstNumber: 'GST001',
    paymentTerms: 'Net 30',
    rating: 4.5,
    status: 'active',
    specialties: ['Cardiology', 'Diabetes', 'General Medicine']
  },
  {
    name: 'Pharma Solutions Ltd',
    contactPerson: 'Priya Sharma',
    email: 'priya@pharmasolutions.com',
    phone: '+91-8765432109',
    address: {
      street: '456 Pharma Plaza',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    licenseNumber: 'LIC002',
    gstNumber: 'GST002',
    paymentTerms: 'Net 15',
    rating: 4.8,
    status: 'active',
    specialties: ['Antibiotics', 'Pain Management', 'Respiratory']
  },
  {
    name: 'Global Health Supplies',
    contactPerson: 'Amit Patel',
    email: 'amit@globalhealth.com',
    phone: '+91-7654321098',
    address: {
      street: '789 Health Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    },
    licenseNumber: 'LIC003',
    gstNumber: 'GST003',
    paymentTerms: 'Net 45',
    rating: 4.2,
    status: 'active',
    specialties: ['Specialty Medicines', 'Vaccines', 'Critical Care']
  },
  {
    name: 'MediCorp International',
    contactPerson: 'Sunita Reddy',
    email: 'sunita@medicorp.com',
    phone: '+91-6543210987',
    address: {
      street: '321 Corporate Park',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India'
    },
    licenseNumber: 'LIC004',
    gstNumber: 'GST004',
    paymentTerms: 'Net 30',
    rating: 4.6,
    status: 'active',
    specialties: ['Oncology', 'Neurology', 'Endocrinology']
  }
];

const orders = [
  {
    orderNumber: 'ORD-2024-001',
    supplier: null, // Will be set after supplier creation
    medicines: [], // Will be populated after medicine creation
    orderDate: new Date('2024-01-15'),
    expectedDeliveryDate: new Date('2024-01-22'),
    status: 'delivered',
    totalAmount: 15750.00,
    notes: 'Regular monthly order for common medicines'
  },
  {
    orderNumber: 'ORD-2024-002',
    supplier: null,
    medicines: [],
    orderDate: new Date('2024-02-10'),
    expectedDeliveryDate: new Date('2024-02-17'),
    status: 'delivered',
    totalAmount: 22500.00,
    notes: 'Emergency order for insulin and diabetes medications'
  },
  {
    orderNumber: 'ORD-2024-003',
    supplier: null,
    medicines: [],
    orderDate: new Date('2024-03-05'),
    expectedDeliveryDate: new Date('2024-03-12'),
    status: 'pending',
    totalAmount: 18750.00,
    notes: 'Quarterly order for cardiovascular medications'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Medicine.deleteMany({});
    await Supplier.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create suppliers
    const createdSuppliers = await Supplier.insertMany(suppliers);
    console.log(`✅ Created ${createdSuppliers.length} suppliers`);

    // Create medicines with required fields
    const medicinesWithRequiredFields = medicines.map((medicine, index) => {
      const supplier = createdSuppliers[index % createdSuppliers.length];
      
      // Map categories to valid enum values
      const categoryMap = {
        'Analgesic': 'Over-the-Counter',
        'Antibiotic': 'Prescription',
        'Antacid': 'Over-the-Counter',
        'Statin': 'Prescription',
        'Bronchodilator': 'Prescription',
        'Antiplatelet': 'Prescription',
        'ACE Inhibitor': 'Prescription',
        'Anticoagulant': 'Prescription',
        'Diabetes': 'Prescription',
        'Pain Relief': 'Over-the-Counter'
      };
      
      return {
        ...medicine,
        supplier: supplier._id,
        unit: medicine.unit || 'tablets',
        totalPrice: medicine.unitPrice * medicine.quantity,
        location: medicine.location || medicine.storageLocation || 'A-01-01',
        minimumStockLevel: medicine.minimumStockLevel || medicine.minStockLevel || 10,
        maximumStockLevel: medicine.maximumStockLevel || medicine.maxStockLevel || 1000,
        category: categoryMap[medicine.category] || 'Prescription'
      };
    });

    const createdMedicines = await Medicine.insertMany(medicinesWithRequiredFields);
    console.log(`✅ Created ${createdMedicines.length} medicines`);

    // Create orders with proper references
    const ordersWithReferences = orders.map((order, index) => {
      const supplier = createdSuppliers[index % createdSuppliers.length];
      const orderMedicines = createdMedicines.slice(index * 3, (index + 1) * 3);
      
      // Map status to valid enum values
      const statusMap = {
        'pending': 'Pending',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'approved': 'Approved',
        'ordered': 'Ordered',
        'shipped': 'Shipped'
      };
      
      return {
        ...order,
        supplier: supplier._id,
        status: statusMap[order.status] || 'Pending',
        items: orderMedicines.map(med => ({
          medicine: med._id,
          quantity: Math.floor(Math.random() * 100) + 50,
          unitPrice: med.unitPrice,
          totalPrice: med.unitPrice * Math.floor(Math.random() * 100) + 50
        }))
      };
    });

    const createdOrders = await Order.insertMany(ordersWithReferences);
    console.log(`✅ Created ${createdOrders.length} orders`);

    // Update medicine quantities based on orders
    for (const order of createdOrders) {
      for (const orderMed of order.items) {
        await Medicine.findByIdAndUpdate(
          orderMed.medicine,
          { $inc: { quantity: orderMed.quantity } }
        );
      }
    }

    console.log('📊 Database seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`- Suppliers: ${createdSuppliers.length}`);
    console.log(`- Medicines: ${createdMedicines.length}`);
    console.log(`- Orders: ${createdOrders.length}`);
    
    console.log('\n🔍 Sample Medicine Data:');
    createdMedicines.slice(0, 3).forEach(med => {
      console.log(`- ${med.name}: ${med.quantity} units (₹${med.unitPrice} each)`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
connectDB().then(() => {
  seedDatabase();
});
