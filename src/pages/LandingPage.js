import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle,
  BarChart3, 
  Package, 
  Users,
  Bell,
  Shield,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Play,
  Star,
  Award,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const demoRef = useRef(null);
  const contactRef = useRef(null);
  
  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Intersection observers for animations
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const demoInView = useInView(demoRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Demo login handler
  const handleDemoLogin = () => {
    localStorage.setItem('meditrack-user', JSON.stringify({
      email: 'demo@meditrack.com',
      name: 'Demo User',
      role: 'Administrator',
      loginTime: new Date().toISOString()
    }));
    navigate('/dashboard');
  };

  // Feature data with icons and descriptions
  const features = [
    {
      icon: Package,
      title: 'Real-Time Stock Tracking',
      description: 'Monitor inventory levels across multiple locations with instant updates and automated alerts.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: Bell,
      title: 'Expiry Alerts',
      description: 'Never miss expiring medications with smart notifications and automated reorder suggestions.',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50'
    },
    {
      icon: Users,
      title: 'Supplier Management',
      description: 'Streamline supplier relationships with order tracking, communication tools, and performance analytics.',
      color: 'from-primary-400 to-primary-500',
      bgColor: 'bg-primary-50'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Make data-driven decisions with comprehensive reports, trends analysis, and predictive insights.',
      color: 'from-secondary-400 to-secondary-500',
      bgColor: 'bg-secondary-50'
    },
    {
      icon: Shield,
      title: 'Compliance & Security',
      description: 'HIPAA-compliant platform with enterprise-grade security and audit trails for regulatory compliance.',
      color: 'from-primary-600 to-primary-700',
      bgColor: 'bg-primary-50'
    },
    {
      icon: TrendingUp,
      title: 'Cost Optimization',
      description: 'Reduce waste and optimize purchasing with intelligent forecasting and budget management tools.',
      color: 'from-secondary-600 to-secondary-700',
      bgColor: 'bg-secondary-50'
    }
  ];

  // Stats data for about section
  const stats = [
    { number: '500+', label: 'Healthcare Facilities', icon: Award },
    { number: '99.9%', label: 'System Uptime', icon: Clock },
    { number: '$2M+', label: 'Cost Savings', icon: TrendingUp },
    { number: '24/7', label: 'Support Available', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30" />
        
        {/* Floating geometric shapes */}
        <motion.div 
          style={{ y }}
          className="absolute top-20 right-20 w-32 h-32 bg-blue-100/40 rounded-full blur-xl"
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-20%']) }}
          className="absolute top-40 left-20 w-24 h-24 bg-green-100/40 rounded-full blur-xl"
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '15%']) }}
          className="absolute bottom-20 right-1/3 w-40 h-40 bg-blue-100/30 rounded-full blur-xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MediTrack</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'About', 'Demo', 'Contact'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {item}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDemoLogin}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg transition-all duration-300 font-medium"
              >
                Try Demo
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0, 
              height: isMenuOpen ? 'auto' : 0 
            }}
            className="md:hidden overflow-hidden bg-white rounded-lg shadow-lg mt-2"
          >
            <div className="py-4 space-y-4">
              {['Features', 'About', 'Demo', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2 px-6"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 px-6 space-y-2 border-t border-gray-200">
                <button
                  onClick={() => navigate('/login')}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={handleDemoLogin}
                  className="block w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg py-2 font-medium"
                >
                  Try Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main heading with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Medical Inventory
              <motion.span 
                className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Management System
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Manage medical supplies efficiently with real-time tracking and analytics. 
              Streamline your healthcare facility's inventory operations with our comprehensive platform.
            </motion.p>
          </motion.div>

          {/* CTA Buttons with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('features')}
              className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('demo')}
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Learn More</span>
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center items-center gap-8 text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>Enterprise Security</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Healthcare Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline medical inventory management and improve patient care.
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="relative py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Healthcare
                <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Facilities Worldwide
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our Medical Inventory Management System has revolutionized how hospitals, clinics, and pharmacies 
                manage their supplies. With real-time tracking, automated alerts, and comprehensive analytics, 
                healthcare facilities can focus on what matters most - patient care.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={aboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="inline-flex p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mb-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Visual element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 border border-gray-200">
                <div className="space-y-6">
                  {[
                    { label: 'Inventory Tracking', status: 'Active', color: 'green' },
                    { label: 'Expiry Monitoring', status: 'Active', color: 'green' },
                    { label: 'Supplier Management', status: 'Active', color: 'green' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-gray-900 font-medium">{item.label}</div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`}></div>
                          <span className="text-gray-600 text-sm">{item.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" ref={demoRef} className="relative py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={demoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              See It In Action
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Live Demo
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our platform with a hands-on demo. See how easy it is to manage your medical inventory.
            </p>
          </motion.div>

          {/* Demo placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={demoInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Mock browser header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1 bg-gray-200 rounded-lg px-4 py-2 mx-4">
                  <span className="text-gray-500 text-sm">meditrack.com/dashboard</span>
                </div>
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-green-50 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Preview</h3>
                <p className="text-gray-600 mb-6">Real-time inventory tracking and analytics</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDemoLogin}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  Launch Full Demo
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="relative py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Medical Inventory?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of healthcare facilities already using our platform to streamline operations and improve patient care.
            </p>
          </motion.div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Mail, title: 'Email Support', content: 'support@meditrack.com', color: 'from-primary-500 to-primary-600' },
              { icon: Phone, title: 'Phone Support', content: '+1 (555) 123-4567', color: 'from-secondary-500 to-secondary-600' },
              { icon: MapPin, title: 'Office Location', content: 'San Francisco, CA', color: 'from-primary-400 to-secondary-500' }
            ].map((contact, index) => {
              const Icon = contact.icon;
              return (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                >
                  <div className={`inline-flex p-4 bg-gradient-to-r ${contact.color} rounded-xl mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-gray-600">{contact.content}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-12 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl font-bold text-xl transition-all duration-300 shadow-lg"
            >
              Request a Demo
            </motion.button>
            <p className="text-gray-500 mt-4">Free 30-day trial • No setup fees • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">MediTrack</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The leading Medical Inventory Management System for healthcare facilities. 
                Streamline operations, reduce costs, and improve patient care.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['Features', 'About', 'Demo', 'Contact'].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <button className="block text-gray-400 hover:text-white transition-colors">Help Center</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Documentation</button>
                <button className="block text-gray-400 hover:text-white transition-colors">API Reference</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Status</button>
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MediTrack. All rights reserved. Built with React, Tailwind CSS, and ❤️
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;