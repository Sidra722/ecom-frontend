import { useEffect, useState } from 'react';
import api from '../services/api';
import { CATEGORIES } from '../constants/categories';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Pizzas',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const loadAll = async () => {
    try {
      const [pRes, uRes, oRes] = await Promise.all([
        api.get('/products'),
        api.get('/admin/users'),
        api.get('/admin/orders'),
      ]);
      setProducts(pRes.data);
      setUsers(uRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        imageUrl: newProduct.imageUrl || undefined,
        category: newProduct.category,
      });
      setNewProduct({ name: '', description: '', price: '', imageUrl: '', category: 'Pizzas' });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.put(`/products/${editingProduct._id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        imageUrl: editingProduct.imageUrl || undefined,
        category: editingProduct.category || 'Pizzas',
      });
      setEditingProduct(null);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      if (editingProduct?._id === id) setEditingProduct(null);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBlockUser = async (id, isBlocked) => {
    try {
      await api.put(`/admin/users/${id}/block`, { isBlocked });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const changeOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page admin-page">
      <h1>Admin Panel</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="admin-grid">
          <section>
            <h2>Products</h2>
            <form className="admin-form" onSubmit={createProduct}>
              <input
                name="name"
                placeholder="Name"
                value={newProduct.name}
                onChange={handleProductChange}
                required
              />
              <input
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleProductChange}
              />
              <input
                name="imageUrl"
                placeholder="Image URL (e.g. https://...)"
                value={newProduct.imageUrl}
                onChange={handleProductChange}
              />
              <select
                name="category"
                value={newProduct.category}
                onChange={handleProductChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleProductChange}
                required
              />
              <button className="primary-btn" type="submit">
                Add Product
              </button>
            </form>
            <ul className="admin-product-list">
              {products.map((p) => (
                <li key={p._id} className="admin-product-item">
                  <img
                    src={p.imageUrl || 'https://placehold.co/48x48/e2e8f0/64748b?text=Pizza'}
                    alt={p.name}
                    className="admin-product-thumb"
                  />
                  <span>{p.name} - Rs. {p.price.toFixed(2)}</span>
                  <span className="admin-product-actions">
                    <button className="secondary-btn" onClick={() => setEditingProduct({ ...p })}>
                      Edit
                    </button>
                    <button className="secondary-btn" onClick={() => deleteProduct(p._id)}>
                      Delete
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            {editingProduct && (
              <form className="admin-form admin-edit-form" onSubmit={updateProduct}>
                <h3>Edit Product</h3>
                <input
                  name="name"
                  placeholder="Name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
                <input
                  name="imageUrl"
                  placeholder="Image URL"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                />
                <select
                  value={editingProduct.category || 'Pizzas'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  required
                />
                <div className="admin-edit-buttons">
                  <button className="primary-btn" type="submit">
                    Save
                  </button>
                  <button className="secondary-btn" type="button" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          <section>
            <h2>Users</h2>
            <ul>
              {users.map((u) => (
                <li key={u._id} className={u.isBlocked ? 'user-blocked' : ''}>
                  {u.name} ({u.email}) - {u.role}
                  {u.isBlocked && ' [Blocked]'}{' '}
                  <span className="admin-user-actions">
                    <button onClick={() => toggleBlockUser(u._id, !u.isBlocked)}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    {u.role === 'user' ? (
                      <button onClick={() => changeUserRole(u._id, 'admin')}>Make Admin</button>
                    ) : (
                      <button onClick={() => changeUserRole(u._id, 'user')}>Make User</button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Orders</h2>
            <ul>
              {orders.map((o) => (
                <li key={o._id}>
                  #{o._id.slice(-6)} - {o.user?.email} - {o.status}{' '}
                  <select
                    value={o.status}
                    onChange={(e) => changeOrderStatus(o._id, e.target.value)}
                  >
                    <option value="pending">pending</option>
                    <option value="preparing">preparing</option>
                    <option value="on-the-way">on-the-way</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

