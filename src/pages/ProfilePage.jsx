import { useEffect, useState } from 'react';
import api from '../services/api';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/users/me', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page centered">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="page">
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <h1>My Profile</h1>
      <form className="auth-form" onSubmit={handleSave}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <input type="email" value={profile.email || ''} disabled />
        </label>
        <label>
          Phone
          <input
            type="tel"
            name="phone"
            value={profile.phone || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          Address
          <input
            type="text"
            name="address"
            value={profile.address || ''}
            onChange={handleChange}
            placeholder="Street, city"
          />
        </label>
        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default ProfilePage;

