import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    ShoppingBagIcon, 
    UsersIcon,
    ChartBarIcon,
    TagIcon,
    ClipboardDocumentListIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

const AdminLayout = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
        { path: '/admin/products', label: 'Products', icon: <ShoppingBagIcon className="h-5 w-5" /> },
        { path: '/admin/orders', label: 'Orders', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
        { path: '/admin/users', label: 'Users', icon: <UsersIcon className="h-5 w-5" /> },
        { path: '/admin/categories', label: 'Categories', icon: <TagIcon className="h-5 w-5" /> },
        { path: '/admin/reports', label: 'Reports', icon: <ChartBarIcon className="h-5 w-5" /> },
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Panel
                    </h2>
                </div>
                
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                    
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        Logout
                    </button>
                </nav>
            </aside>
            
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;