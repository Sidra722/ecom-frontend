import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import BrandStory from '../components/BrandStory';
import Promotions from '../components/Promotions';
import { CATEGORIES, CATEGORY_IDS } from '../constants/categories';
import { formatRs } from '../utils/currency';

function HomePage({ user }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const placeOrder = async () => {
    if (!user) {
      setMessage('Please login to place an order.');
      return;
    }
    if (cart.length === 0) return;

    if (!address || address.trim().length < 5) {
      setMessage('Please enter a delivery address.');
      return;
    }

    try {
      const items = cart.map((c) => ({ product: c.product._id, quantity: c.quantity }));
      await api.post('/orders', { items, deliveryAddress: address });
      setCart([]);
      setAddress('');
      setMessage('Order placed successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to place order.');
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const getProductsByCategory = (cat) =>
    products.filter((p) => {
      const c = p.category || 'Pizzas';
      return c === cat || (cat === 'Pizzas' && (c === 'Pizza' || c === 'Pizzas'));
    });

  return (
    <div className="page">
      <HeroSection />
      <section id="promotions" className="section-promotions">
        <Promotions />
      </section>
      <section id="menu" className="section-menu">
        <h1 className="section-title">Our Menu</h1>
        {loading ? (
          <p>Loading menu...</p>
        ) : (
          <>
            {CATEGORIES.map((cat) => {
              const catProducts = getProductsByCategory(cat);
              if (catProducts.length === 0) return null;
              const sectionId = CATEGORY_IDS[cat] || cat.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={cat} id={sectionId} className="menu-section">
                  <h2 className="menu-section-title">{cat}</h2>
                  <div className="products-grid">
                    {catProducts.map((p) => (
                      <ProductCard key={p._id} product={p} onAddToCart={addToCart} />
                    ))}
                  </div>
                </div>
              );
            })}
            {products.length > 0 && products.every((p) => !CATEGORIES.includes(p.category || 'Pizzas')) && (
              <div id="pizzas" className="menu-section">
                <h2 className="menu-section-title">All Items</h2>
                <div className="products-grid">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="section-brand">
        <BrandStory />
      </section>

      <div id="cart" className="cart">
        <h2>Your Cart</h2>
        {cart.length === 0 && <p>No items in cart.</p>}
        {cart.map((item) => (
          <div key={item.product._id} className="cart-item">
            <img
              src={item.product.imageUrl || 'https://placehold.co/48x48/e2e8f0/64748b?text=Pizza'}
              alt={item.product.name}
              className="cart-item-image"
            />
            <span className="cart-item-info">
              {item.product.name} x {item.quantity}
            </span>
            <span>{formatRs(item.product.price * item.quantity)}</span>
          </div>
        ))}
        {cart.length > 0 && (
          <>
            <div className="cart-total">Total: {formatRs(totalPrice)}</div>
            <label className="cart-address">
              Delivery address
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Where should we deliver?"
              />
            </label>
            <button className="primary-btn" onClick={placeOrder}>
              Place Order
            </button>
          </>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default HomePage;
