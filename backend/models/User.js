const BaseModel = require('./BaseModel');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  // Create a new user
  async createUser(userData) {
    const data = {
      clerk_id: userData.clerkId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      full_name: userData.fullName,
      profile_image_url: userData.profileImageUrl,
      role: userData.role || 'Staff',
      permissions: userData.permissions || this.getDefaultPermissions(userData.role || 'Staff'),
      notifications: userData.notifications || this.getDefaultNotifications(),
      is_active: userData.isActive !== undefined ? userData.isActive : true,
      last_login_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await this.create(data);
  }

  // Find user by Clerk ID
  async findByClerkId(clerkId) {
    return await this.findOne({ clerk_id: clerkId });
  }

  // Find user by email
  async findByEmail(email) {
    return await this.findOne({ email: email.toLowerCase() });
  }

  // Update user permissions based on role
  async updatePermissionsByRole(userId, role) {
    const permissions = this.getRolePermissions(role);
    return await this.updateById(userId, { permissions });
  }

  // Update last login time
  async updateLastLogin(userId) {
    return await this.updateById(userId, { 
      last_login_at: new Date().toISOString() 
    });
  }

  // Get role permissions
  getRolePermissions(role) {
    const permissions = {
      Administrator: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: true,
        reports: true,
        settings: true
      },
      Pharmacist: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: false,
        reports: true,
        settings: false
      },
      'Inventory Manager': {
        dashboard: true,
        inventory: true,
        orders: false,
        suppliers: true,
        reports: true,
        settings: false
      },
      Staff: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: false,
        reports: false,
        settings: false
      },
      Viewer: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: true,
        reports: true,
        settings: false
      }
    };
    return permissions[role] || permissions.Viewer;
  }

  // Get default permissions for a role
  getDefaultPermissions(role) {
    return this.getRolePermissions(role);
  }

  // Get default notifications
  getDefaultNotifications() {
    return {
      order_updates: true,
      low_stock_alerts: true,
      expiry_reminders: true,
      supplier_messages: false,
      system_updates: true
    };
  }

  // Check if user has permission for a specific page
  hasPermission(user, page) {
    return user.permissions && user.permissions[page] === true;
  }

  // Get all active users
  async getActiveUsers() {
    return await this.find({ is_active: true });
  }

  // Get users by role
  async getUsersByRole(role) {
    return await this.find({ role });
  }
}

module.exports = new User();
