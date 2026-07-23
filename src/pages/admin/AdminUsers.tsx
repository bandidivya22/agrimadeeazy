import { useState } from 'react';
import { Search, Edit2, Trash2, X, Shield, User as UserIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  joined: string;
  orders: number;
  avatar: string;
}

const sampleUsers: AdminUser[] = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: ['Rajesh Kumar', 'Suresh Patel', 'Lakshmi Devi', 'Mohammed Iqbal', 'Anita Sharma', 'Venkat Rao', 'Priya Singh', 'Gurpreet Singh', 'Arjun Mehta', 'Sunita Bai', 'Karthik Naidu', 'Fatima Begum', 'Ramesh Chandra', 'Deepak Yadav', 'Meena Iyer', 'Sanjay Gupta', 'Kavita Joshi', 'Naresh Reddy', 'Pooja Verma', 'Harish Patel'][i],
  email: `user${i + 1}@agrimadeeazy.com`,
  phone: `98${String(76543210 + i).slice(0, 8)}`,
  role: i === 0 ? 'admin' : 'user',
  status: i % 7 === 0 ? 'inactive' : 'active',
  joined: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
  orders: Math.floor(Math.random() * 15),
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
}));

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(sampleUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const filtered = users.filter(
    (u) => (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) && (!filterRole || u.role === filterRole)
  );

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    showToast('User deleted', 'success');
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u)));
    showToast('User status updated', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{users.length} users</p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input className="input-field pl-10" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-40" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden sm:table-cell">Orders</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-9 h-9 rounded-full" />
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${u.role === 'admin' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">{u.orders}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(u.id)} className={`badge text-xs ${u.status === 'active' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {u.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
