import { useAppSelector } from "../../store/hooks";

const AdminDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <p>Welcome back, {user?.name}!</p> */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm">Total Products</h3>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">567</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">890</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm">Revenue</h3>
                    <p className="text-3xl font-bold mt-2">$12,345</p>
                </div>  
            </div>
        </div>
    );
};

export default AdminDashboard;