import { useState, useEffect } from 'react';

function Promotions() {
  const [unlocked, setUnlocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 500);
  };

  const unlockDeal = () => {
    if (!unlocked) {
      setUnlocked(true);
      triggerConfetti();
    }
  };

  return (
    <div className="promotions">
      <h2 className="promotions-title">🔥 WOW Deals</h2>
      <div className="promo-cards">
        <div className={`promo-card ${unlocked ? 'unlocked' : ''}`} onClick={unlockDeal}>
          <span className="promo-label">Limited Time</span>
          <h3>2 Large Pizzas</h3>
          <p>Get 2 large pizzas at Rs. 999 only!</p>
          <div className="promo-countdown">Ends in 2d 14h</div>
          {unlocked && <span className="promo-unlocked">Unlocked! 🎉</span>}
        </div>
        <div className="promo-card">
          <span className="promo-label">Seasonal</span>
          <h3>Combo Deal</h3>
          <p>Pizza + Drink + Fries at Rs. 599</p>
        </div>
      </div>
      {showConfetti && <Confetti />}
    </div>
  );
}

function Confetti() {
  useEffect(() => {
    const colors = ['#d32f2f', '#ffc107', '#fff', '#000'];
    const confetti = [];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(el);
      confetti.push(el);
    }
    const t = setTimeout(() => confetti.forEach((e) => e.remove()), 2500);
    return () => clearTimeout(t);
  }, []);
  return null;
}

export default Promotions;
