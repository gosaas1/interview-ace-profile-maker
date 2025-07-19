import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  User,
  ChevronDown,
  CreditCard,
  Crown,
  Star,
  Zap,
  Award,
  TrendingUp,
  Brain,
  Send,
  Sparkles
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My CVs', href: '/cvs', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Interview Coach', href: '/interview-coach', icon: MessageSquare },
  { name: 'One-Click Apply', href: '/apply', icon: Send },
];

export function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [userTier, setUserTier] = useState<string>('free');
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load user usage stats and tier
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUsageStats();
    }
  }, [isAuthenticated, user]);

  const loadUsageStats = async () => {
    try {
      const response = await fetch('/api/analytics/usage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const stats = await response.json();
        setUsageStats(stats);
        setUserTier(stats.tier);
      }
    } catch (error) {
      console.error('Error loading usage stats:', error);
    }
  };

  const getTierInfo = (tier: string) => {
    const tierInfo = {
      free: { name: 'Free', limit: 1, color: 'bg-gray-100 text-gray-800', icon: <Star className="h-3 w-3" /> },
      starter: { name: 'Starter', limit: 3, color: 'bg-blue-100 text-blue-800', icon: <Zap className="h-3 w-3" /> },
      pro: { name: 'Pro', limit: 10, color: 'bg-purple-100 text-purple-800', icon: <Award className="h-3 w-3" /> },
      career_pro: { name: 'Career Pro', limit: 25, color: 'bg-emerald-100 text-emerald-800', icon: <TrendingUp className="h-3 w-3" /> },
      elite_exec: { name: 'Elite', limit: 100, color: 'bg-yellow-100 text-yellow-800', icon: <Crown className="h-3 w-3" /> }
    };
    return tierInfo[tier as keyof typeof tierInfo] || tierInfo.free;
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredNavigation = isAuthenticated 
    ? navigation 
    : navigation.filter(item => item.href === '/');

  const handleOneClickApply = () => {
    if (isAuthenticated) {
      navigate('/apply');
    } else {
      navigate('/auth?redirect=/apply');
    }
  };

  return (
    <motion.nav 
      className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/60 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and primary navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">ApplyAce</h1>
                </motion.div>
                {isAuthenticated && userTier && (
                  <Badge className={`${getTierInfo(userTier).color} text-xs`}>
                    {getTierInfo(userTier).icon}
                    <span className="ml-1">{getTierInfo(userTier).name}</span>
                  </Badge>
                )}
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:space-x-6">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                        isActivePath(item.href)
                          ? 'text-blue-600 bg-blue-50 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Auth buttons */}
            {!user ? (
              <>
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50"
                  >
                    Sign In
                  </button>
                </motion.div>
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                {/* Upgrade Button - Right side */}
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-purple-500 hover:text-purple-600 hover:bg-purple-25 border border-purple-100/50 hover:border-purple-200/50"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade
                  </button>
                </motion.div>

                {/* User menu */}
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split('@')[0]}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                </motion.div>
              </>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
        >
          {/* Mobile menu items */}
          <div className="px-4 py-2 space-y-1">
            {user ? (
              <>
                {/* Upgrade Button in mobile menu */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/pricing');
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200/50 hover:border-purple-300/50 transition-colors"
                >
                  <Sparkles className="h-5 w-5 mr-3" />
                  Upgrade
                </button>

                <Link
                  to="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  One-Click Apply
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/cvs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  My CVs
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  Analytics
                </Link>
                <Link
                  to="/interview-coach"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  Interview Coach
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  One-Click Apply
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200/50">
              <div className="px-4 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900">
                    {user?.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
} 