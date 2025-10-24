const BaseModel = require('./BaseModel');

class Order extends BaseModel {
  constructor() {
    super('orders');
  }

  // Create a new order
  async createOrder(orderData) {
    const data = {
      order_number: orderData.orderNumber || await this.generateOrderNumber(),
      supplier_id: orderData.supplier,
      items: orderData.items,
      total_amount: orderData.totalAmount,
      status: orderData.status || 'Pending',
      order_date: orderData.orderDate || new Date().toISOString(),
      expected_delivery_date: orderData.expectedDeliveryDate,
      actual_delivery_date: orderData.actualDeliveryDate,
      notes: orderData.notes,
      created_by: orderData.createdBy,
      approved_by: orderData.approvedBy,
      updated_by: orderData.updatedBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await this.create(data);
  }

  // Generate unique order number
  async generateOrderNumber() {
    const count = await this.count();
    return `ORD-${String(count + 1).padStart(6, '0')}`;
  }

  // Find order by order number
  async findByOrderNumber(orderNumber) {
    return await this.findOne({ order_number: orderNumber });
  }

  // Find orders by supplier
  async findBySupplier(supplierId) {
    return await this.find({ supplier_id: supplierId });
  }

  // Find orders by status
  async findByStatus(status) {
    return await this.find({ status });
  }

  // Find orders by date range
  async findByDateRange(startDate, endDate) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('order_date', startDate)
      .lte('order_date', endDate)
      .order('order_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get orders with supplier and medicine information
  async findWithDetails(conditions = {}) {
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
      `);
    
    if (error) throw error;
    return data;
  }

  // Update order status
  async updateStatus(orderId, newStatus, updatedBy = null) {
    const updateData = { 
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    if (updatedBy) {
      updateData.updated_by = updatedBy;
    }
    
    // Set delivery date if status is 'Delivered'
    if (newStatus === 'Delivered' && !updateData.actual_delivery_date) {
      updateData.actual_delivery_date = new Date().toISOString();
    }
    
    return await this.updateById(orderId, updateData);
  }

  // Approve order
  async approveOrder(orderId, approvedBy) {
    return await this.updateStatus(orderId, 'Approved', approvedBy);
  }

  // Cancel order
  async cancelOrder(orderId, updatedBy) {
    return await this.updateStatus(orderId, 'Cancelled', updatedBy);
  }

  // Mark order as delivered
  async markDelivered(orderId, updatedBy) {
    return await this.updateStatus(orderId, 'Delivered', updatedBy);
  }

  // Calculate total amount for order items
  calculateTotalAmount(items) {
    return items.reduce((total, item) => total + (item.totalPrice || 0), 0);
  }

  // Get order statistics
  async getOrderStats() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('status, total_amount, order_date');
    
    if (error) throw error;
    
    const stats = {
      totalOrders: data.length,
      totalValue: data.reduce((sum, order) => sum + (order.total_amount || 0), 0),
      statusCounts: {},
      monthlyStats: {}
    };
    
    data.forEach(order => {
      // Count by status
      const status = order.status || 'Unknown';
      stats.statusCounts[status] = (stats.statusCounts[status] || 0) + 1;
      
      // Count by month
      if (order.order_date) {
        const month = order.order_date.substring(0, 7); // YYYY-MM
        if (!stats.monthlyStats[month]) {
          stats.monthlyStats[month] = { count: 0, value: 0 };
        }
        stats.monthlyStats[month].count++;
        stats.monthlyStats[month].value += order.total_amount || 0;
      }
    });
    
    return stats;
  }

  // Get pending orders
  async getPendingOrders() {
    return await this.find({ status: 'Pending' });
  }

  // Get orders requiring attention (pending for more than 7 days)
  async getOrdersRequiringAttention() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'Pending')
      .lte('order_date', sevenDaysAgo.toISOString());
    
    if (error) throw error;
    return data;
  }

  // Get order age in days
  getOrderAge(orderDate) {
    const now = new Date();
    const order = new Date(orderDate);
    return Math.ceil((now - order) / (1000 * 60 * 60 * 24));
  }
}

module.exports = new Order();
