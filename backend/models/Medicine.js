const BaseModel = require('./BaseModel');

class Medicine extends BaseModel {
  constructor() {
    super('medicines');
  }

  // Create a new medicine
  async createMedicine(medicineData) {
    const data = {
      name: medicineData.name,
      generic_name: medicineData.genericName,
      category: medicineData.category,
      manufacturer: medicineData.manufacturer,
      batch_number: medicineData.batchNumber,
      expiry_date: medicineData.expiryDate,
      quantity: medicineData.quantity,
      unit: medicineData.unit,
      unit_price: medicineData.unitPrice,
      total_price: medicineData.totalPrice,
      supplier_id: medicineData.supplier,
      location: medicineData.location,
      minimum_stock_level: medicineData.minimumStockLevel || 10,
      maximum_stock_level: medicineData.maximumStockLevel || 1000,
      description: medicineData.description,
      barcode: medicineData.barcode,
      is_active: medicineData.isActive !== undefined ? medicineData.isActive : true,
      created_by: medicineData.createdBy,
      updated_by: medicineData.updatedBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await this.create(data);
  }

  // Find medicine by name
  async findByName(name) {
    return await this.findOne({ name });
  }

  // Find medicines by category
  async findByCategory(category) {
    return await this.find({ category });
  }

  // Find medicines by supplier
  async findBySupplier(supplierId) {
    return await this.find({ supplier_id: supplierId });
  }

  // Find low stock medicines
  async findLowStock() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .filter('quantity', 'lte', this.supabase.raw('minimum_stock_level'))
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }

  // Find expired medicines
  async findExpired() {
    const today = new Date().toISOString().split('T')[0];
    return await this.find({ 
      expiry_date: { lte: today },
      is_active: true 
    });
  }

  // Find medicines expiring soon (within 30 days)
  async findExpiringSoon(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .filter('expiry_date', 'lte', futureDateStr)
      .filter('expiry_date', 'gte', new Date().toISOString().split('T')[0])
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }

  // Update stock quantity
  async updateStock(medicineId, newQuantity, updatedBy = null) {
    const updateData = { 
      quantity: newQuantity,
      updated_at: new Date().toISOString()
    };
    
    if (updatedBy) {
      updateData.updated_by = updatedBy;
    }
    
    return await this.updateById(medicineId, updateData);
  }

  // Add stock
  async addStock(medicineId, quantityToAdd, updatedBy = null) {
    const medicine = await this.findById(medicineId);
    if (!medicine) throw new Error('Medicine not found');
    
    const newQuantity = medicine.quantity + quantityToAdd;
    return await this.updateStock(medicineId, newQuantity, updatedBy);
  }

  // Remove stock
  async removeStock(medicineId, quantityToRemove, updatedBy = null) {
    const medicine = await this.findById(medicineId);
    if (!medicine) throw new Error('Medicine not found');
    
    if (medicine.quantity < quantityToRemove) {
      throw new Error('Insufficient stock');
    }
    
    const newQuantity = medicine.quantity - quantityToRemove;
    return await this.updateStock(medicineId, newQuantity, updatedBy);
  }

  // Search medicines
  async search(searchTerm) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%`)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }

  // Get medicines with supplier information
  async findWithSupplier(conditions = {}) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        suppliers (
          id,
          name,
          contact_person,
          email,
          phone
        )
      `)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }

  // Get total inventory value
  async getTotalInventoryValue() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('total_price')
      .eq('is_active', true);
    
    if (error) throw error;
    return data.reduce((total, medicine) => total + (medicine.total_price || 0), 0);
  }

  // Get inventory statistics
  async getInventoryStats() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('quantity, total_price, category')
      .eq('is_active', true);
    
    if (error) throw error;
    
    const stats = {
      totalItems: data.length,
      totalQuantity: data.reduce((sum, item) => sum + (item.quantity || 0), 0),
      totalValue: data.reduce((sum, item) => sum + (item.total_price || 0), 0),
      categories: {}
    };
    
    data.forEach(item => {
      if (!stats.categories[item.category]) {
        stats.categories[item.category] = { count: 0, quantity: 0, value: 0 };
      }
      stats.categories[item.category].count++;
      stats.categories[item.category].quantity += item.quantity || 0;
      stats.categories[item.category].value += item.total_price || 0;
    });
    
    return stats;
  }
}

module.exports = new Medicine();
