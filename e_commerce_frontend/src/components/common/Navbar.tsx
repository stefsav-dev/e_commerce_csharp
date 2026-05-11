// src/components/common/Navbar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChartBarIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  ShoppingBagIcon as ProductIcon,
  TagIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Cek apakah user adalah admin
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Navigation links for non-admin users
  const navLinks = [
    { path: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/products', label: 'Products', icon: <ProductIcon className="h-5 w-5" /> },
    { path: '/deals', label: 'Deals', icon: <TagIcon className="h-5 w-5" /> },
    { path: '/about', label: 'About', icon: <InformationCircleIcon className="h-5 w-5" /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Jika admin login, tampilkan navbar minimal dengan avatar saja
  if (isAdmin) {
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? 'border-b border-gray-200 bg-white shadow-lg' : 'border-b border-gray-200 bg-white/95 backdrop-blur'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
        {/* Admin Dropdown Menu - Posisi Kanan */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Admin menu"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <span className="hidden md:inline text-sm font-medium">
              {user?.name?.split(' ')[0] || 'Admin'}
            </span>
            <svg 
              className={`hidden sm:block w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-slide-down">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                <p className="text-xs text-indigo-600 mt-1">Administrator</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <ChartBarIcon className="h-5 w-5" />
                  Admin Dashboard
                </Link>
                
                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Manage Products
                </Link>
                
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                  Manage Orders
                </Link>
                
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UsersIcon className="h-5 w-5" />
                  Manage Users
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  My Profile
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  Settings
                </Link>
              </div>

              {/* Logout Button */}
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

  // Untuk non-admin (user biasa atau belum login), tampilkan navbar lengkap
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-gray-200 bg-white shadow-lg' : 'border-b border-gray-200 bg-white/95 backdrop-blur'
      }`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            E-Commerce
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === link.path
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Desktop Search Bar */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              </form>
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white animate-pulse">
                  {totalQuantity > 9 ? '9+' : totalQuantity}
                </span>
              )}
            </Link>

            {/* Wishlist Button */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="hidden sm:block rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
              >
                <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            )}

            {/* Auth Section */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Register
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <span className="text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <svg 
                    className={`hidden sm:block w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-slide-down">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                        <UserIcon className="h-5 w-5" />
                        My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                        <ClipboardDocumentListIcon className="h-5 w-5" />
                        My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                        <HeartIcon className="h-5 w-5" />
                        Wishlist
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                        <Cog6ToothIcon className="h-5 w-5" />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 px-4 border-t border-gray-100 animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div ref={mobileMenuRef} className="absolute right-0 top-16 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-4 space-y-6">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-3">Welcome to E-Commerce!</p>
                    <div className="flex gap-3">
                      <button onClick={handleLogin} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Login
                      </button>
                      <button onClick={handleRegister} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        <UserPlusIcon className="h-4 w-4" />
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      <span className="text-lg font-semibold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>

              {isAuthenticated && (
                <div className="space-y-1">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                    <HeartIcon className="h-5 w-5" />
                    Wishlist
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                    <UserIcon className="h-5 w-5" />
                    My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;