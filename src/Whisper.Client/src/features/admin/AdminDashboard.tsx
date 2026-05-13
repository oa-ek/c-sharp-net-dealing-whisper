import { useMemo } from "react";
import { 
    Users, Zap, MessageSquare, Smartphone, 
    TrendingUp, Activity, ArrowUpRight 
} from "lucide-react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar 
    } from 'recharts';

interface StatPoint {
    label: string;
    value: number;
}

interface AdminDashboardProps {
    data: {
        totalUsers: number;
        onlineNow: number;
        totalMessages: number;
        activeDevices: number;
        registrationStats: StatPoint[];
        messageStats: StatPoint[];
    };
    lastUpdated: string;
}

const StatCard = ({ title, value, icon: Icon, hexColor }: any) => (
    <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700" 
        style={{ backgroundColor: hexColor }}
        />
        <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: `${hexColor}15` }}>
            <Icon className="w-6 h-6" style={{ color: hexColor }} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#348F96] transition-colors" />
        </div>
        <div className="relative z-10">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-4xl font-black text-[#111] tracking-tighter">{value}</h3>
        </div>
    </div>
);

export const AdminDashboard = ({ data, lastUpdated }: AdminDashboardProps) => {
    const sortedRegStats = useMemo(() => [...data.registrationStats].reverse(), [data.registrationStats]);
    const sortedMsgStats = useMemo(() => [...data.messageStats], [data.messageStats]);

    return (
        <div className="flex-1 bg-[#f9fafb] p-8 min-h-screen overflow-y-auto">
        <div className="mb-12 flex justify-between items-end">
            <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#64B59D] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Admin Live Control • 15s Sync</span>
            </div>
            <h1 className="text-5xl font-black text-[#111] tracking-tighter uppercase italic leading-none">
                Insights <span className="text-[#348F96]">Core</span>
            </h1>
            </div>
            <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Останнє оновлення</p>
            <p className="text-sm font-black text-[#2D6BA3]">{lastUpdated}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Users" value={data.totalUsers} icon={Users} hexColor="#348F96" />
            <StatCard title="Online Now" value={data.onlineNow} icon={Zap} hexColor="#64B59D" />
            <StatCard title="Messages" value={data.totalMessages} icon={MessageSquare} hexColor="#2D6BA3" />
            <StatCard title="Devices" value={data.activeDevices} icon={Smartphone} hexColor="#f97316" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Аналітика</p>
                <h4 className="text-xl font-black text-[#111] tracking-tight">Реєстрації</h4>
                </div>
                <TrendingUp className="w-5 h-5 text-[#348F96] opacity-20" />
            </div>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedRegStats}>
                    <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#348F96" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#348F96" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#348F96" strokeWidth={4} fill="url(#colorReg)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </div>


            <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Активність</p>
                <h4 className="text-xl font-black text-[#111] tracking-tight">Потік повідомлень</h4>
                </div>
                <Activity className="w-5 h-5 text-[#64B59D] opacity-20" />
            </div>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedMsgStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#64B59D" radius={[10, 10, 10, 10]} barSize={30} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.5em]">
            Whisper Protocol Dashboard
            </p>
        </div>
        </div>
    );
};