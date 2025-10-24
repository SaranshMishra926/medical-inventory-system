const { getSupabaseClient } = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  get supabase() {
    return getSupabaseClient();
  }

  // Create a new record
  async create(data) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Find a record by ID
  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Find records with conditions
  async find(conditions = {}, options = {}) {
    let query = this.supabase.from(this.tableName).select('*');

    // Apply conditions
    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    // Apply options
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Find one record with conditions
  async findOne(conditions = {}) {
    const results = await this.find(conditions, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  // Update a record by ID
  async updateById(id, data) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Update records with conditions
  async update(conditions, data) {
    let query = this.supabase
      .from(this.tableName)
      .update({ ...data, updated_at: new Date().toISOString() });

    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data: result, error } = await query.select();
    if (error) throw error;
    return result;
  }

  // Delete a record by ID
  async deleteById(id) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Delete records with conditions
  async delete(conditions) {
    let query = this.supabase.from(this.tableName).delete();

    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { error } = await query;
    if (error) throw error;
    return true;
  }

  // Count records with conditions
  async count(conditions = {}) {
    let query = this.supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  // Execute raw query
  async query(sql, params = []) {
    const { data, error } = await this.supabase.rpc('exec_sql', { 
      sql_query: sql, 
      params: params 
    });
    
    if (error) throw error;
    return data;
  }
}

module.exports = BaseModel;
