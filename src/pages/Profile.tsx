import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    showToast('Profile updated successfully', 'success');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    const result = await changePassword(passwords.current, passwords.new);
    showToast(result.message, result.success ? 'success' : 'error');
    if (result.success) setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">My Profile</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          <div>
            <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className={`badge mt-2 ${user.role === 'admin' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
              {user.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
        {(['profile', 'password'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 font-medium text-sm capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary-600 text-primary-700 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {t === 'password' ? 'Change Password' : 'Edit Profile'}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleSaveProfile} className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input className="input-field pl-10" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input className="input-field pl-10" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="9876543210" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Address</label>
            <textarea className="input-field" rows={2} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Your farm address" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">City</label>
              <input className="input-field" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">State</label>
              <input className="input-field" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Pincode</label>
              <input className="input-field" value={profile.pincode} onChange={(e) => setProfile({ ...profile, pincode: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangePassword} className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Current Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" required className="input-field pl-10" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" required className="input-field pl-10" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} placeholder="Min 6 characters" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" required className="input-field pl-10" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Update Password
          </button>
        </form>
      )}
    </div>
  );
}
