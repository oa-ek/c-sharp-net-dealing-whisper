import { useEffect, useState, useCallback } from "react";
import agentService from "../api/agent"; 
import { AdminDashboard } from "../features/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

const AdminPage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

    const fetchStats = useCallback(async () => {
        try {
        const res = await agentService.Admin.getDashboardData();
        setData(res);
        setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
        console.error("Admin error:", err);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();

        const interval = setInterval(() => {
        fetchStats();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchStats]);

    if (loading) {
        return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#f9fafb]">
            <Loader2 className="w-10 h-10 text-[#348F96] animate-spin" />
        </div>
        );
    }

    if (!data) {
        return (
        <div className="h-screen flex items-center justify-center text-red-500 font-bold">
            Access Denied
        </div>
        );
    }

    return <AdminDashboard data={data} lastUpdated={lastUpdated} />;
};

export default AdminPage;