import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { InventoryProvider } from './context/InventoryContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './index.css';

// Get the Clerk publishable key from environment variables
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key. Please add REACT_APP_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <UserProvider>
        <InventoryProvider>
          <Router>
            <div className="min-h-screen bg-background-primary text-text-primary dashboard-container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                
                {/* Protected Routes with Layout */}
                <Route path="/dashboard" element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />
                <Route path="/inventory" element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Inventory />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />
                <Route path="/orders" element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Orders />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />
                <Route path="/suppliers" element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Suppliers />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />
                <Route path="/reports" element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Reports />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />
                <Route path="/settings" element={
                  <>
                    <SignedIn>
                      <Layout>
                        <Settings />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </InventoryProvider>
      </UserProvider>
    </ClerkProvider>
  );
}

export default App;