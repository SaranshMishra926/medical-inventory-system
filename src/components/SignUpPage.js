import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Check,
  ArrowRight,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const roles = [
    'Administrator',
    'Pharmacist',
    'Staff'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Mock registration - in real app, this would make an API call
    setToastMessage('Account created successfully! Redirecting to login...');
    setToastType('success');
    setShowToast(true);
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
    setTermsAccepted(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      {/* Success Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 ${
            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          <div className="flex items-center">
            {toastType === 'success' ? (
              <Check size={20} className="mr-2" />
            ) : (
              <AlertCircle size={20} className="mr-2" />
            )}
            {toastMessage}
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Illustration/Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-primary rounded-xl flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-white">MediTrack</span>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Start Managing Your Inventory in Minutes.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join thousands of healthcare professionals who trust MediTrack for their inventory management needs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
                <span className="text-gray-300">Free 30-day trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
                <span className="text-gray-300">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
                <span className="text-gray-300">24/7 customer support</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-purple-primary rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MediTrack</span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Your MediTrack Account</h2>
              <p className="text-gray-400">Start managing your inventory in minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3 bg-dark-bg border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-200 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-dark-border'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-3 bg-dark-bg border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-dark-border'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Create a password"
                    className={`w-full pl-12 pr-12 py-3 bg-dark-bg border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-dark-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3 bg-dark-bg border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-dark-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-dark-bg border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-200 appearance-none ${
                      errors.role ? 'border-red-500 focus:ring-red-500' : 'border-dark-border'
                    }`}
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
                {errors.role && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.role}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-purple-primary bg-dark-bg border-dark-border rounded focus:ring-purple-primary focus:ring-2 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-300">
                    I agree to the{' '}
                    <button className="text-purple-primary hover:text-purple-secondary transition-colors">
                      Terms and Conditions
                    </button>{' '}
                    and{' '}
                    <button className="text-purple-primary hover:text-purple-secondary transition-colors">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.terms && (
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.terms}
                  </div>
                )}
              </div>

              {/* Create Account Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-purple-primary text-white font-semibold rounded-xl hover:bg-purple-secondary transition-colors flex items-center justify-center"
              >
                Create Account
                <ArrowRight size={20} className="ml-2" />
              </motion.button>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-gray-400">Already have an account? </span>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-purple-primary hover:text-purple-secondary transition-colors font-medium"
                >
                  Login here
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
