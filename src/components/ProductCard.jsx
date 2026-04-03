import { formatRs } from '../utils/currency';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={product.imageUrl || 'https://placehold.co/300x200/e2e8f0/64748b?text=Pizza'}
          alt={product.name}
          className="product-card-image"
        />
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="product-card-desc">{product.description || 'Delicious'}</p>
        <p className="product-card-price">{formatRs(product.price)}</p>
        <button className="primary-btn" onClick={() => onAddToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
