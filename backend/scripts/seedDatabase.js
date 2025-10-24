// Load environment variables first
require('dotenv').config();

const { connectDB, getSupabaseClient } = require('../config/database');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');

// Connect to Supabase
const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log('📊 Connected to Supabase for seeding');
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
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
    batchNumber: 'SP2024001',
    expiryDate: '2025-12-31',
    quantity: 500,
    unit: 'tablets',
    unitPrice: 0.5,
    totalPrice: 250,
    location: 'Shelf A1',
    minimumStockLevel: 50,
    maximumStockLevel: 1000,
    description: 'Pain relief and fever reducer'
  },
  {
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    category: 'Prescription',
    manufacturer: 'Cipla',
    batchNumber: 'CP2024002',
    expiryDate: '2025-06-30',
    quantity: 200,
    unit: 'capsules',
    unitPrice: 2.5,
    totalPrice: 500,
    location: 'Shelf B2',
    minimumStockLevel: 25,
    maximumStockLevel: 500,
    description: 'Antibiotic for bacterial infections'
  },
  {
    name: 'Insulin Glargine',
    genericName: 'Insulin Glargine',
    category: 'Controlled Substance',
    manufacturer: 'Novo Nordisk',
    batchNumber: 'NN2024003',
    expiryDate: '2024-12-15',
    quantity: 50,
    unit: 'vials',
    unitPrice: 25,
    totalPrice: 1250,
    location: 'Refrigerator',
    minimumStockLevel: 10,
    maximumStockLevel: 100,
    description: 'Long-acting insulin for diabetes management'
  },
  {
    name: 'Blood Pressure Monitor',
    genericName: 'Digital Sphygmomanometer',
    category: 'Medical Device',
    manufacturer: 'Omron',
    batchNumber: 'OM2024004',
    expiryDate: '2026-03-31',
    quantity: 15,
    unit: 'units',
    unitPrice: 45,
    totalPrice: 675,
    location: 'Device Storage',
    minimumStockLevel: 3,
    maximumStockLevel: 30,
    description: 'Digital blood pressure monitoring device'
  },
  {
    name: 'Surgical Gloves',
    genericName: 'Latex Examination Gloves',
    category: 'Supplies',
    manufacturer: 'Ansell',
    batchNumber: 'AN2024005',
    expiryDate: '2025-09-30',
    quantity: 1000,
    unit: 'boxes',
    unitPrice: 8,
    totalPrice: 8000,
    location: 'Supply Room',
    minimumStockLevel: 100,
    maximumStockLevel: 2000,
    description: 'Sterile surgical gloves'
  }
];

const suppliers = [
  {
    name: 'MediSupply Solutions',
    contactPerson: 'Dr. Rajesh Kumar',
    email: 'rajesh@medisupply.com',
    phone: '+91-9876543210',
    address: {
      street: '123 Medical Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    website: 'https://medisupply.com',
    licenseNumber: 'MS001',
    gstNumber: '27ABCDE1234F1Z5',
    paymentTerms: 'Net 30',
    rating: 4,
    notes: 'Reliable supplier for prescription medicines'
  },
  {
    name: 'PharmaDirect',
    contactPerson: 'Ms. Priya Sharma',
    email: 'priya@pharmadirect.in',
    phone: '+91-9876543211',
    address: {
      street: '456 Pharma Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    website: 'https://pharmadirect.in',
    licenseNumber: 'PD002',
    gstNumber: '07ABCDE1234F2Z6',
    paymentTerms: 'Net 15',
    rating: 5,
    notes: 'Fast delivery and competitive prices'
  },
  {
    name: 'Medical Equipment Hub',
    contactPerson: 'Mr. Amit Patel',
    email: 'amit@medequip.com',
    phone: '+91-9876543212',
    address: {
      street: '789 Equipment Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    },
    website: 'https://medequip.com',
    licenseNumber: 'ME003',
    gstNumber: '29ABCDE1234F3Z7',
    paymentTerms: 'Net 45',
    rating: 3,
    notes: 'Specialized in medical devices and equipment'
  }
];

const users = [
  {
    clerkId: 'user_2abc123def456ghi',
    email: 'admin@meditrack.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: 'Administrator',
    profileImageUrl: null
  },
  {
    clerkId: 'user_2def456ghi789jkl',
    email: 'pharmacist@meditrack.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    fullName: 'Dr. Sarah Johnson',
    role: 'Pharmacist',
    profileImageUrl: null
  },
  {
    clerkId: 'user_2ghi789jkl012mno',
    email: 'inventory@meditrack.com',
    firstName: 'Mike',
    lastName: 'Chen',
    fullName: 'Mike Chen',
    role: 'Inventory Manager',
    profileImageUrl: null
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    const supabase = getSupabaseClient();
    
    // Delete in reverse order of dependencies
    await supabase.from('orders').delete().neq('id', 0);
    await supabase.from('medicines').delete().neq('id', 0);
    await supabase.from('suppliers').delete().neq('id', 0);
    await supabase.from('users').delete().neq('id', 0);

    // Seed users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.createUser(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.full_name}`);
    }

    // Seed suppliers
    console.log('🏢 Seeding suppliers...');
    const createdSuppliers = [];
    for (const supplierData of suppliers) {
      const supplier = await Supplier.createSupplier({
        ...supplierData,
        createdBy: createdUsers[0].id
      });
      createdSuppliers.push(supplier);
      console.log(`✅ Created supplier: ${supplier.name}`);
    }

    // Seed medicines
    console.log('💊 Seeding medicines...');
    const createdMedicines = [];
    for (let i = 0; i < medicines.length; i++) {
      const medicineData = medicines[i];
      const supplierIndex = i % createdSuppliers.length;
      
      const medicine = await Medicine.createMedicine({
        ...medicineData,
        supplier: createdSuppliers[supplierIndex].id,
        createdBy: createdUsers[0].id
      });
      createdMedicines.push(medicine);
      console.log(`✅ Created medicine: ${medicine.name}`);
    }

    // Seed sample orders
    console.log('📦 Seeding orders...');
    const sampleOrders = [
      {
        supplier: createdSuppliers[0].id,
        items: [
          {
            medicine: createdMedicines[0].id,
            quantity: 100,
            unitPrice: 0.5,
            totalPrice: 50
          },
          {
            medicine: createdMedicines[1].id,
            quantity: 50,
            unitPrice: 2.5,
            totalPrice: 125
          }
        ],
        totalAmount: 175,
        status: 'Delivered',
        notes: 'Regular monthly order',
        createdBy: createdUsers[1].id
      },
      {
        supplier: createdSuppliers[1].id,
        items: [
          {
            medicine: createdMedicines[2].id,
            quantity: 20,
            unitPrice: 25,
            totalPrice: 500
          }
        ],
        totalAmount: 500,
        status: 'Pending',
        notes: 'Urgent insulin restock',
        createdBy: createdUsers[2].id
      }
    ];

    for (const orderData of sampleOrders) {
      const order = await Order.createOrder(orderData);
      console.log(`✅ Created order: ${order.order_number}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Suppliers: ${createdSuppliers.length}`);
    console.log(`   - Medicines: ${createdMedicines.length}`);
    console.log(`   - Orders: ${sampleOrders.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
const runSeeding = async () => {
  await initializeDatabase();
  await seedDatabase();
  process.exit(0);
};

runSeeding();