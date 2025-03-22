import React from 'react';
import { 
  Home, 
  Settings, 
  BarChart, 
  Users, 
  HelpCircle,
  Leaf,
  Calendar,
  FileText,
} from 'lucide-react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  key: string;
}
// @ts-ignore
function SideBar(stateVariables){
    // @ts-ignore
    const [activeSidebarItem, setActiveSidebarItem] = {stateVariables};
    // Sidebar navigation items
    const sidebarItems: SidebarItem[] = [
        { icon: <Home size={20} />, label: 'Most Suitable Crop', key: 'home' },
        { icon: <BarChart size={20} />, label: 'Expected Yield', key: 'analytics' },
        { icon: <Leaf size={20} />, label: 'Detect Nutrient Leaching', key: 'plants' },
        { icon: <Calendar size={20} />, label: 'AgriAI', key: 'schedule' },
        { icon: <FileText size={20} />, label: 'Reports', key: 'reports' },
        { icon: <Users size={20} />, label: 'Users', key: 'users' },
        { icon: <Settings size={20} />, label: 'Settings', key: 'settings' },
        { icon: <HelpCircle size={20} />, label: 'Help', key: 'help' },
    ];
    return (
        <div className="w-64 bg-black bg-opacity-40 backdrop-blur-lg border-r border-green-950 text-white mt-20">
            <div className="py-4">
                {sidebarItems.map((item) => (
                <button
                    key={item.key}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeSidebarItem === item.key
                        ? 'bg-green-900 bg-opacity-30 border-l-4 border-green-500'
                        : 'hover:bg-neutral-800'
                    }`}
                    onClick={() => setActiveSidebarItem(item.key)}
                >
                    <span className={activeSidebarItem === item.key ? 'text-green-400' : ''}>
                    {item.icon}
                    </span>
                    <span className={activeSidebarItem === item.key ? 'font-medium text-green-400' : ''}>
                    {item.label}
                    </span>
                </button>
                ))}
            </div>
        </div>
    )
}

export default SideBar