import { Link } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../../store/hooks';

const Navbar = () => {
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-gray-900">
          E-Commerce
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingBagIcon className="h-6 w-6" />
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Account"
          >
            <UserIcon className="h-6 w-6" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
