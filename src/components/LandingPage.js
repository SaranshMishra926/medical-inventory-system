import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  BarChart3,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Real-time stock monitoring with automated alerts for low inventory levels.'
    },
    {
      icon: AlertTriangle,
      title: 'Expiry Alerts',
      description: 'Never miss an expiry date with smart notifications and batch tracking.'
    },
    {
      icon: ShoppingCart,
      title: 'Order Management',
      description: 'Streamline your ordering process with automated supplier management.'
    },
    {
      icon: BarChart3,
      title: 'Supplier Insights',
      description: 'Track supplier performance and optimize your procurement strategy.'
    }
  ];

  const testimonials = [
    {
      name: 'MR SARANSH MISHRA',
      role: 'Chief Pharmacist',
      company: 'CityCare Pharmacy',
      content: 'MediTrack has revolutionized our inventory management. We\'ve reduced waste by 40% and never run out of critical medicines.',
      avatar: 'SJ',
      rating: 5
    },
    {
      name: 'MR SURESH BYALLA',
      role: 'Hospital Administrator',
      company: 'Metro General Hospital',
      content: 'The analytics dashboard gives us insights we never had before. Our procurement team is now data-driven.',
      avatar: 'MC',
      rating: 5
    },
    {
      name: 'MR AARUSH GAUR',
      role: 'Pharmacy Manager',
      company: 'HealthPlus Chain',
      content: 'The expiry alerts have saved us thousands in expired medicine costs. Highly recommended!',
      avatar: 'PN',
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-purple-primary rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MediTrack</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-300 hover:text-white transition-colors">Features</button>
              <button className="text-gray-300 hover:text-white transition-colors">Pricing</button>
              <button className="text-gray-300 hover:text-white transition-colors">About</button>
              <button className="text-gray-300 hover:text-white transition-colors">Contact</button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-purple-primary text-white rounded-xl hover:bg-purple-secondary transition-colors"
              >
                Sign Up
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-dark-border"
            >
              <div className="flex flex-col space-y-4 pt-4">
                <button className="text-gray-300 hover:text-white transition-colors text-left">Features</button>
                <button className="text-gray-300 hover:text-white transition-colors text-left">Pricing</button>
                <button className="text-gray-300 hover:text-white transition-colors text-left">About</button>
                <button className="text-gray-300 hover:text-white transition-colors text-left">Contact</button>
                <div className="flex flex-col space-y-2 pt-2">
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-left"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-purple-primary text-white rounded-xl hover:bg-purple-secondary transition-colors text-left"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <div className="space-y-8">
              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-6xl font-bold leading-tight"
              >
                Simplify Your{' '}
                <span className="text-purple-primary">Medicine</span>{' '}
                Inventory Management
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 leading-relaxed"
              >
                Track stock, monitor expiry dates, and manage suppliers — all in one smart dashboard designed for pharmacies and hospitals.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-purple-primary text-white rounded-xl font-semibold hover:bg-purple-secondary transition-colors flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight size={20} className="ml-2" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border border-gray-600 text-white rounded-xl font-semibold hover:border-purple-primary hover:text-purple-primary transition-colors"
                >
                  Learn More
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-primary">500+</div>
                  <div className="text-gray-400">Pharmacies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-primary">50K+</div>
                  <div className="text-gray-400">Medicines Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-primary">99.9%</div>
                  <div className="text-gray-400">Uptime</div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-400">MediTrack Dashboard</div>
                </div>
                
                {/* Mock Dashboard Content */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-primary/10 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-purple-primary">1,250</div>
                      <div className="text-sm text-gray-400">Total Medicines</div>
                    </div>
                    <div className="bg-orange-500/10 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-orange-400">35</div>
                      <div className="text-sm text-gray-400">Low Stock</div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-bg p-4 rounded-xl">
                    <div className="h-32 bg-gradient-to-r from-purple-primary/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 size={48} className="text-purple-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to manage your medicine inventory efficiently</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-purple-primary/50 transition-all duration-300"
              >
                <div className="p-3 bg-purple-primary/10 rounded-xl w-fit mb-4">
                  <feature.icon size={24} className="text-purple-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold mb-4">See Trends in Real Time</h2>
              <p className="text-xl text-gray-300 mb-8">
                Get instant insights into your inventory patterns, supplier performance, and order trends with our advanced analytics dashboard.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>Real-time stock monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>Predictive analytics for demand</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>Automated reporting</span>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <div className="h-64 bg-gradient-to-br from-purple-primary/20 via-blue-500/20 to-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={64} className="text-purple-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-300">Join hundreds of satisfied pharmacies and hospitals</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-primary/10 to-blue-500/10 border border-purple-primary/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Pharmacy?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of healthcare professionals who trust MediTrack for their inventory management needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-purple-primary text-white rounded-xl font-semibold hover:bg-purple-secondary transition-colors"
            >
              Create Free Account
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-primary rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white">MediTrack</span>
              </div>
              <p className="text-gray-400">
                Simplifying medicine inventory management for pharmacies and hospitals worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button className="block text-gray-400 hover:text-white transition-colors text-left">Features</button>
                <button className="block text-gray-400 hover:text-white transition-colors text-left">Pricing</button>
                <button className="block text-gray-400 hover:text-white transition-colors text-left">About</button>
                <button className="block text-gray-400 hover:text-white transition-colors text-left">Contact</button>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <button className="block text-gray-400 hover:text-white transition-colors text-left">Help Center</button>
                <button className="block text-gray-400 hover:text-white transition-colors text-left">Documentation</button>
                <button className="block text-gray-400 hover:text-white transition-colors text-left">API Reference</button>
                <button className="block text-gray-400 hover:text-white transition-colors text-left">Status</button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-gray-400">hello@meditrack.com</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
                <div className="flex space-x-4 mt-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-purple-primary transition-colors cursor-pointer">
                    <Users size={16} />
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-purple-primary transition-colors cursor-pointer">
                    <Shield size={16} />
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-purple-primary transition-colors cursor-pointer">
                    <Zap size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-border mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MediTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
