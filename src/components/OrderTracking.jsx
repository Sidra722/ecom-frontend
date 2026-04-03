const STATUS_FLOW = ['pending', 'preparing', 'on-the-way', 'delivered'];
const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  'on-the-way': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const STATUS_ICONS = {
  pending: '⏳',
  preparing: '🍳',
  'on-the-way': '🚚',
  delivered: '✅',
  cancelled: '❌',
};

function OrderTracking({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="order-tracking cancelled">
        <span className="track-icon">{STATUS_ICONS.cancelled}</span>
        <span>{STATUS_LABELS.cancelled}</span>
      </div>
    );
  }

  const idx = STATUS_FLOW.indexOf(status);
  return (
    <div className="order-tracking">
      {STATUS_FLOW.map((s, i) => (
        <div
          key={s}
          className={`track-step ${i <= idx ? 'active' : ''} ${i < idx ? 'done' : ''}`}
        >
          <span className="track-dot">{i < idx ? '✓' : STATUS_ICONS[s]}</span>
          <span className="track-label">{STATUS_LABELS[s]}</span>
          {i < STATUS_FLOW.length - 1 && <span className="track-line" />}
        </div>
      ))}
    </div>
  );
}

export default OrderTracking;
