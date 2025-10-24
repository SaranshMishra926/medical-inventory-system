# Supabase Migration Guide

This guide will help you migrate from MongoDB to Supabase for your Medical Inventory System.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your existing project files

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `medical-inventory-system`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `backend/supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create all the necessary tables:
- `users` - User accounts and permissions
- `suppliers` - Medicine suppliers
- `medicines` - Medicine inventory
- `orders` - Purchase orders

## Step 3: Get Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

## Step 4: Update Environment Variables

1. Copy `backend/env.example` to `backend/.env`
2. Update the Supabase configuration:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## Step 5: Install Dependencies

Run the following command in your backend directory:

```bash
cd backend
npm install
```

This will install the Supabase client library and remove MongoDB dependencies.

## Step 6: Seed the Database (Optional)

To populate your database with sample data:

```bash
npm run seed
```

This will create sample users, suppliers, medicines, and orders.

## Step 7: Start the Server

```bash
npm run dev
```

Your server should now be running with Supabase instead of MongoDB!

## Key Changes Made

### Database Models
- Replaced Mongoose schemas with Supabase-compatible classes
- Updated field names to use snake_case (PostgreSQL convention)
- Added proper foreign key relationships

### API Routes
- Updated all route handlers to use the new Supabase models
- Changed `_id` references to `id` (Supabase uses UUID primary keys)
- Updated field names to match the new schema

### Authentication
- Updated middleware to work with Supabase user records
- Maintained Clerk authentication integration
- Updated permission checking logic

## Database Schema Differences

| MongoDB Field | Supabase Field | Notes |
|---------------|----------------|-------|
| `_id` | `id` | UUID instead of ObjectId |
| `clerkId` | `clerk_id` | Snake case |
| `firstName` | `first_name` | Snake case |
| `isActive` | `is_active` | Snake case |
| `createdAt` | `created_at` | Snake case |
| `updatedAt` | `updated_at` | Snake case |

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure your IP is not blocked by Supabase

### Permission Errors
- Check that RLS policies are set up correctly
- Verify your service role key has proper permissions
- Review the database schema for any missing constraints

### Data Migration
If you have existing MongoDB data, you'll need to:
1. Export your MongoDB data
2. Transform field names to match the new schema
3. Import the data into Supabase using the API or SQL

## Benefits of Supabase

- **Real-time subscriptions**: Get live updates when data changes
- **Built-in authentication**: Optional alternative to Clerk
- **Automatic API generation**: REST and GraphQL APIs
- **PostgreSQL**: More robust than MongoDB for relational data
- **Better performance**: Optimized for complex queries
- **ACID compliance**: Better data consistency

## Next Steps

1. Test all API endpoints to ensure they work correctly
2. Update your frontend to handle any API response changes
3. Set up proper RLS policies for production
4. Configure backups and monitoring
5. Consider setting up real-time subscriptions for live updates

## Support

If you encounter any issues:
1. Check the Supabase documentation
2. Review the error logs in your server console
3. Verify your database schema matches the expected structure
4. Test with the sample data first before migrating production data
