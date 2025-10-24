const BaseModel = require('./BaseModel');

class Supplier extends BaseModel {
  constructor() {
    super('suppliers');
  }

  // Create a new supplier
  async createSupplier(supplierData) {
    const data = {
      name: supplierData.name,
      contact_person: supplierData.contactPerson,
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address,
      website: supplierData.website,
      license_number: supplierData.licenseNumber,
      gst_number: supplierData.gstNumber,
      payment_terms: supplierData.paymentTerms || 'Net 30',
      rating: supplierData.rating || 3,
      is_active: supplierData.isActive !== undefined ? supplierData.isActive : true,
      notes: supplierData.notes,
      created_by: supplierData.createdBy,
      updated_by: supplierData.updatedBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await this.create(data);
  }

  // Find supplier by name
  async findByName(name) {
    return await this.findOne({ name });
  }

  // Find supplier by email
  async findByEmail(email) {
    return await this.findOne({ email: email.toLowerCase() });
  }

  // Find supplier by license number
  async findByLicenseNumber(licenseNumber) {
    return await this.findOne({ license_number: licenseNumber });
  }

  // Find supplier by GST number
  async findByGstNumber(gstNumber) {
    return await this.findOne({ gst_number: gstNumber });
  }

  // Get active suppliers
  async getActiveSuppliers() {
    return await this.find({ is_active: true });
  }

  // Search suppliers
  async search(searchTerm) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }

  // Get suppliers with medicine count
  async getSuppliersWithMedicineCount() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        medicines!supplier_id (
          id,
          name,
          quantity
        )
      `)
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Process the data to add medicine count
    return data.map(supplier => ({
      ...supplier,
      medicine_count: supplier.medicines ? supplier.medicines.length : 0,
      total_medicine_quantity: supplier.medicines ? 
        supplier.medicines.reduce((sum, med) => sum + (med.quantity || 0), 0) : 0
    }));
  }

  // Update supplier rating
  async updateRating(supplierId, newRating) {
    if (newRating < 1 || newRating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    return await this.updateById(supplierId, { 
      rating: newRating,
      updated_at: new Date().toISOString()
    });
  }

  // Get suppliers by rating
  async getSuppliersByRating(minRating = 1) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('rating', minRating)
      .eq('is_active', true)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get supplier statistics
  async getSupplierStats() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('rating, payment_terms, is_active');
    
    if (error) throw error;
    
    const stats = {
      totalSuppliers: data.length,
      activeSuppliers: data.filter(s => s.is_active).length,
      inactiveSuppliers: data.filter(s => !s.is_active).length,
      averageRating: 0,
      paymentTerms: {}
    };
    
    if (data.length > 0) {
      stats.averageRating = data.reduce((sum, s) => sum + (s.rating || 0), 0) / data.length;
      
      data.forEach(supplier => {
        const term = supplier.payment_terms || 'Unknown';
        stats.paymentTerms[term] = (stats.paymentTerms[term] || 0) + 1;
      });
    }
    
    return stats;
  }
}

module.exports = new Supplier();
