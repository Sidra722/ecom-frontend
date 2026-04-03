function HeroSection() {
  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'hero-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <section className="hero hero-pizza">
      <div className="hero-pizza-bg" />
      <div className="hero-overlay" />

      <div className="hero-content hero-centered">
        <h1 className="hero-title">Bringing flavor to every moment</h1>
        <p className="hero-tagline">Fresh ingredients, unforgettable taste</p>
        <a href="#menu" className="hero-btn hero-btn-grab" onClick={handleRipple}>
          Grab Your Slice
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
