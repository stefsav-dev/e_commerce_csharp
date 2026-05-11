import { useAppSelector } from "../../store/hooks.ts";

const AdminProduct = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div>
            <h2 className="font-extrabold">Halaman Product Admin</h2>
        </div>
    )
}

export default AdminProduct;