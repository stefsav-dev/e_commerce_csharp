import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChartBarIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
          E-Commerce
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cart"
          >
            <ShoppingBagIcon className="h-6 w-6" />
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white animate-pulse">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Wishlist Button (only for authenticated users) */}
          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Wishlist"
            >
              <HeartIcon className="h-6 w-6" />
            </Link>
          )}

          {/* Auth Section */}
          {!isAuthenticated ? (
            // Not logged in - show Login & Register buttons
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Login
              </button>
              <button
                onClick={handleRegister}
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <UserPlusIcon className="h-5 w-5" />
                Register
              </button>
            </div>
          ) : (
            // Logged in - show user menu dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Account menu"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <span className="text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      My Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                      My Orders
                    </Link>
                    
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HeartIcon className="h-5 w-5" />
                      Wishlist
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <ChartBarIcon className="h-5 w-5" />
                      Dashboard
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
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;