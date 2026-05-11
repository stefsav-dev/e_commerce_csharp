import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import AdminLayout from '../components/layout/AdminLayout';

const AdminRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    
    return <AdminLayout />;
};

export default AdminRoute;