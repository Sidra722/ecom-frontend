import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import OrderTracking from '../components/OrderTracking';
import Promotions from '../components/Promotions';
import { formatRs } from '../utils/currency';

function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/orders/my'),
        ]);
        setProfile(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="page centered">Loading...</div>;
  }

  return (
    <div className="page dashboard-page">
      <h1>My Dashboard</h1>

      <section className="dashboard-section profile-summary">
        <h2>Profile</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt="" />
            ) : (
              <span>{profile?.name?.[0]?.toUpperCase() || '?'}</span>
            )}
          </div>
          <div className="profile-info">
            <strong>{profile?.name}</strong>
            <span>{profile?.email}</span>
          </div>
          <Link to="/profile" className="secondary-btn">Edit Profile</Link>
        </div>
      </section>

      <section className="dashboard-section wow-deals">
        <h2>🔥 WOW Deals</h2>
        <Promotions />
      </section>

      <section className="dashboard-section">
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="card order-card">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span className={`order-status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <OrderTracking status={order.status} />
                <ul className="order-items-list">
                  {order.items.map((item) => (
                    <li key={item._id} className="order-item">
                      <img
                        src={item.product?.imageUrl || 'https://placehold.co/40x40/e2e8f0/64748b?text=Pizza'}
                        alt={item.product?.name || 'Item'}
                        className="order-item-image"
                      />
                      <span>{item.product?.name || 'Pizza'} x {item.quantity}</span>
                      <span>{formatRs((item.product?.price || 0) * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="order-total">Total: {formatRs(order.totalPrice)}</p>
                <p className="order-meta">Deliver to: {order.deliveryAddress}</p>
                <p className="order-meta">Placed: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section cart-cta">
        <h2>Cart & Checkout</h2>
        <p>Continue shopping and checkout when ready.</p>
        <Link to="/#cart" className="primary-btn">View Cart & Checkout</Link>
      </section>

      <section className="dashboard-section account-settings">
        <h2>Account Settings</h2>
        <div className="settings-links">
          <Link to="/profile">Profile & Addresses</Link>
          <span>Payment methods (coming soon)</span>
        </div>
      </section>

      <section className="dashboard-section support">
        <h2>Support & Help</h2>
        <div className="faq-list">
          <details>
            <summary>How do I track my order?</summary>
            <p>Check the order card above for real-time status.</p>
          </details>
          <details>
            <summary>What are the delivery times?</summary>
            <p>We deliver within 30-45 minutes of order placement.</p>
          </details>
        </div>
        <a href="mailto:support@pizzahut.com" className="primary-btn">Contact Support</a>
      </section>
    </div>
  );
}

export default UserDashboard;
