import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiCheck, FiArrowRight, FiRotateCcw, FiShoppingBag, FiStar } from 'react-icons/fi';
import { addToCart } from '../store/slices/cartSlice';

const QUESTIONS = [
  {
    id: 'vibe',
    title: 'What aura do you wish to project?',
    subtitle: 'Step 1 of 3 — Olfactory Personality',
    options: [
      { id: 'mystery', label: 'Nocturne Velvet', desc: 'Magnetic, deep, enigmatic warmth for late hours', icon: '🌙' },
      { id: 'fresh', label: 'Sunlit Riviera', desc: 'Crisp, invigorating, sparkling citrus and sea salt', icon: '☀️' },
      { id: 'regal', label: 'Imperial Majesty', desc: 'Commanding amber, smoky oudh, rich powdered woods', icon: '👑' },
      { id: 'sensual', label: 'Whispering Silk', desc: 'Creamy vanilla, soft lavender, close-to-skin intimacy', icon: '🕊️' },
    ],
  },
  {
    id: 'note',
    title: 'Which heart accords resonate most with you?',
    subtitle: 'Step 2 of 3 — Core Botanical Affinity',
    options: [
      { id: 'vanilla', label: 'Warm Amber & Madagascar Vanilla', desc: 'Gourmand sweetness grounded in golden resins', icon: '🍯' },
      { id: 'citrus', label: 'Italian Bergamot & Crisp Neroli', desc: 'Clean, luminous and awakening top notes', icon: '🍊' },
      { id: 'lavender', label: 'French Lavender & Herbal Woods', desc: 'Classic Parisian sophistication with powdery drydown', icon: '🌿' },
      { id: 'woods', label: 'Smoky Sandalwood & Roasted Tonka', desc: 'Earth-born strength with long-lasting trail', icon: '🪵' },
    ],
  },
  {
    id: 'occasion',
    title: 'What is your primary wearing occasion?',
    subtitle: 'Step 3 of 3 — Sillage & Projection',
    options: [
      { id: 'daily', label: 'Daily Signature Statement', desc: 'Versatile, refined, memorable yet non-intrusive', icon: '✨' },
      { id: 'evening', label: 'Gala & High-Stakes Evening', desc: 'Maximum projection, rich density, 16h longevity', icon: '🍸' },
      { id: 'romance', label: 'Intimate Rendezvous', desc: 'Sensual warmth that draws people closer', icon: '🌹' },
      { id: 'creative', label: 'Artistic & Non-Conformist', desc: 'Unique niche accord that stands out in any room', icon: '🎨' },
    ],
  },
];

const PERFUME_DATABASE = [
  {
    _id: 'mock-1',
    name: 'Only For You',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    price: 185,
    matchScore: 98,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    headline: 'Your Flawless Signature Identity',
    topNotes: 'Italian Bergamot, Sweet Mandarin',
    heartNotes: 'Madagascar Bourbon Vanilla, French Lavender',
    baseNotes: 'Warm Amber, Roasted Tonka, Powdery Woods',
    character: 'Warm Amber Gourmand',
    longevity: '16+ Hours',
  },
  {
    _id: 'mock-2',
    name: 'Santorini Breeze',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    price: 165,
    matchScore: 94,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    headline: 'Luminous Aegean Sunlight & Saline Air',
    topNotes: 'Calabrian Lemon, Sea Salt Mist',
    heartNotes: 'White Neroli, Mediterranean Fig Leaf',
    baseNotes: 'Sun-Bleached Cedar, Driftwood, Clean Musk',
    character: 'Crisp Oceanic Citrus',
    longevity: '12+ Hours',
  },
  {
    _id: 'mock-3',
    name: 'Velvet Midnight',
    brand: 'Ediot Breeze',
    category: 'Pure Perfume Oil',
    price: 210,
    matchScore: 96,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    headline: 'Hypnotic Smoked Resin & Damascus Rose',
    topNotes: 'Black Pepper, Cardamom Pods',
    heartNotes: 'Midnight Damascus Rose, Incense Smoke',
    baseNotes: 'Cambodian Agarwood, Patchouli, Dark Amber',
    character: 'Smoky Oriental Wood',
    longevity: '20+ Hours',
  },
];

const FragranceFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const dispatch = useDispatch();

  const handleSelectOption = (optionId) => {
    const questionId = QUESTIONS[currentStep].id;
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Compute best match
      if (newAnswers.vibe === 'fresh' || newAnswers.note === 'citrus') {
        setResult(PERFUME_DATABASE[1]);
      } else if (newAnswers.vibe === 'regal' || newAnswers.note === 'woods') {
        setResult(PERFUME_DATABASE[2]);
      } else {
        setResult(PERFUME_DATABASE[0]);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleAddToCart = () => {
    if (result) {
      dispatch(addToCart({ ...result, qty: 1 }));
    }
  };

  const activeQuestion = QUESTIONS[currentStep];

  return (
    <section id="finder" style={{
      padding: '160px 0',
      background: 'var(--color-warm-white)',
      position: 'relative',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '640px', margin: '0 auto 60px', textAlign: 'center' }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 600,
            marginBottom: '16px',
          }}>
            Olfactory Diagnosis
          </div>
          <h2 style={{ marginBottom: '20px' }}>
            Find Your Signature Scent
          </h2>
          <p className="text-large" style={{ color: 'var(--color-grey)', lineHeight: '1.6' }}>
            Answer three bespoke questions to reveal the exact composition that amplifies your natural chemistry.
          </p>
        </div>

        {/* Profiler Card */}
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '28px',
          padding: 'clamp(24px, 5vw, 56px) clamp(18px, 4vw, 48px)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.06)',
          border: '0.5px solid rgba(0,0,0,0.04)',
        }}>
          {!result ? (
            <div>
              {/* Progress Steps */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '40px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--color-beige)',
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {activeQuestion.subtitle}
                  </div>
                  <h3 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 600, marginTop: '4px' }}>
                    {activeQuestion.title}
                  </h3>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  background: 'var(--color-cream)',
                  padding: '6px 14px',
                  borderRadius: '980px',
                  border: '1px solid var(--color-beige)',
                }}>
                  {currentStep + 1} / 3
                </div>
              </div>

              {/* Options Grid */}
              <div
                className="finder-options-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '18px',
                }}
              >
                {activeQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '24px',
                      borderRadius: '20px',
                      border: '1px solid var(--color-beige)',
                      background: 'var(--color-cream)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--color-gold)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(184, 149, 106, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--color-beige)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{option.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '17px',
                        fontWeight: 600,
                        color: 'var(--color-black)',
                        marginBottom: '6px',
                      }}>
                        {option.label}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'var(--color-grey)',
                        lineHeight: '1.5',
                      }}>
                        {option.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Reveal View */
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--color-beige)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'var(--color-gold)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '6px 14px',
                    borderRadius: '980px',
                  }}>
                    {result.matchScore}% Match Found
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-grey)' }}>
                    Personalized formulation based on your profile
                  </span>
                </div>

                <button
                  onClick={handleReset}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    color: 'var(--color-grey)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <FiRotateCcw /> Retake Diagnosis
                </button>
              </div>

              <div
                className="finder-result-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr',
                  gap: '40px',
                  alignItems: 'center',
                }}
              >
                {/* Result Image */}
                <div style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'var(--color-cream)',
                  height: '340px',
                }}>
                  <img
                    src={result.image}
                    alt={result.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Result Details */}
                <div>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '6px' }}>
                    {result.category}
                  </div>
                  <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 32px)', marginBottom: '12px' }}>{result.name}</h2>
                  <p style={{ color: 'var(--color-grey)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                    {result.headline}
                  </p>

                  <div style={{
                    background: 'var(--color-cream)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '13px',
                  }}>
                    <div>
                      <strong style={{ color: 'var(--color-black)' }}>Top:</strong> {result.topNotes}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-black)' }}>Heart:</strong> {result.heartNotes}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-black)' }}>Base:</strong> {result.baseNotes}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-gold)' }}>
                      ${result.price}
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="btn btn-primary"
                      style={{ padding: '14px 28px' }}
                    >
                      <FiShoppingBag /> Add to Bag
                    </button>
                    <Link to={`/product/${result._id}`} className="btn btn-secondary" style={{ padding: '14px 28px' }}>
                      Explore Details <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FragranceFinder;
