import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiDroplet, FiSun, FiShield, FiAward, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

gsap.registerPlugin(ScrollTrigger);

const SHADER_FRAMES = [
  {
    id: 'shader-1',
    title: 'Grasse Rose Centifolia Dawn',
    subtitle: 'Pre-Dawn Cryo-Harvest • 04:45 AM',
    desc: 'Volatile monoterpenes frozen at peak biological vibration before solar heat initiates evaporation.',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=85',
    tag: 'Haute Botanical',
    notes: 'May Rose • Calone • Pink Pepper',
    price: 195,
  },
  {
    id: 'shader-2',
    title: 'Cap d’Antibes Solar Citrus',
    subtitle: 'Cold-Expressed Calabrian Bergamot',
    desc: 'Luminous sparkling top notes distilled under nitrogen cushion to prevent enzymatic oxidation.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&q=85',
    tag: 'Solar Extraction',
    notes: 'Bergamot • Neroli • Sea Salt',
    price: 185,
  },
  {
    id: 'shader-3',
    title: 'Normandy Crystal Annealing',
    subtitle: '480g Mouth-Blown Flacon Mass',
    desc: 'Optically pure mineral glass cooled over 72 hours and sealed with hand-engraved 24K gold zamak collar.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=85',
    tag: 'Artisan Glass',
    notes: 'Mineral Crystal • 24K Gold Closure',
    price: 245,
  },
  {
    id: 'shader-4',
    title: 'Place Vendôme Dark Maceration',
    subtitle: '90-Day Light-Sealed Oak Vaults',
    desc: 'Unbroken silence in Limousin oak casks fusing natural ambergris with roasted Madagascar tonka.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=85',
    tag: 'Grand Cru Vault',
    notes: 'Bourbon Amber • Tonka • Limousin Oak',
    price: 225,
  },
  {
    id: 'shader-5',
    title: 'The Sovereign Sillage Aura',
    subtitle: '35% Pure Extrait Density',
    desc: 'Over 16 hours of continuous olfactory projection that evolves intimately with individual skin chemistry.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&q=85',
    tag: 'Eternal Projection',
    notes: 'Ambergris • Sandalwood • Iris',
    price: 275,
  },
];

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vUvCover;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;

  void main(){
    vUv = uv;

    // "cover" mapping to preserve aspect ratio
    float texR = uTextureSize.x / uTextureSize.y;
    float quadR = uQuadSize.x / uQuadSize.y;
    vec2 s = vec2(1.0);
    if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }
    vUvCover = vUv * s + (1.0 - s) * 0.5;

    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  uniform float uTime;
  uniform float uScrollVelocity;   // signed -1..1
  uniform float uVelocityStrength; // 0..1, decays to 0

  varying vec2 vUv;
  varying vec2 vUvCover;

  void main() {
    vec2 texCoords = vUvCover;

    // drive distortion amount from scroll velocity strength
    float amt = 0.038 * uVelocityStrength;

    // organic fluid wave that does not depend on mouse
    float t = uTime * 0.85;
    texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
    texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.65;

    // directional chromatic aberration: push R/G/B differently by scroll direction
    float dir = sign(uScrollVelocity);
    if (abs(dir) < 0.001) dir = 1.0;
    vec2 tc = texCoords;

    float r = texture2D(uTexture, tc + vec2( amt * 0.55 * dir, 0.0)).r;
    float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
    float b = texture2D(uTexture, tc + vec2(-amt * 0.40 * dir, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const VelocityShaderGallery = () => {
  const containerRef = useRef(null);
  const frameRefs = useRef([]);
  const scenesRef = useRef([]);
  const [addedMap, setAddedMap] = useState({});
  const dispatch = useDispatch();

  const handleAddToCart = (frame) => {
    dispatch(
      addToCart({
        _id: frame.id,
        name: `Ediot Breeze - ${frame.title} (50ML)`,
        image: frame.image,
        price: frame.price,
        countInStock: 10,
        qty: 1,
      })
    );
    setAddedMap((prev) => ({ ...prev, [frame.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [frame.id]: false }));
    }, 2200);
  };

  useEffect(() => {
    // Shared velocity proxy for all WebGL canvases
    const velocityProxy = { v: 0, s: 0 };
    const clamp = gsap.utils.clamp(-2000, 2000);

    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate(self) {
        const raw = clamp(self.getVelocity());
        const norm = raw / 1000;
        const strength = Math.min(1, Math.abs(norm));

        if (Math.abs(strength) > Math.abs(velocityProxy.s)) {
          velocityProxy.v = norm;
          velocityProxy.s = strength;
          gsap.to(velocityProxy, {
            v: 0,
            s: 0,
            duration: 0.8,
            ease: 'sine.inOut',
            overwrite: true,
          });
        }
      },
    });

    const instances = [];

    frameRefs.current.forEach((frameEl, idx) => {
      if (!frameEl) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Append canvas inside frame
      frameEl.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geom = new THREE.PlaneGeometry(2, 2);

      const uniforms = {
        uTexture: { value: null },
        uTextureSize: { value: new THREE.Vector2(1, 1) },
        uQuadSize: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uVelocityStrength: { value: 0 },
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      // Load texture
      const url = SHADER_FRAMES[idx].image;
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        uniforms.uTexture.value = tex;
        uniforms.uTextureSize.value.set(tex.image.width || 1200, tex.image.height || 800);
        layout();
      });

      function layout() {
        if (!frameEl) return;
        const rect = frameEl.getBoundingClientRect();
        const w = rect.width || 600;
        const h = rect.height || 360;
        renderer.setSize(w, h, false);
        uniforms.uQuadSize.value.set(w, h);
      }

      layout();
      window.addEventListener('resize', layout);

      let last = performance.now();
      function tick(now) {
        const dt = (now - last) * 0.001;
        last = now;
        uniforms.uTime.value += dt;
        uniforms.uScrollVelocity.value = velocityProxy.v;
        uniforms.uVelocityStrength.value = velocityProxy.s;
        renderer.render(scene, camera);
      }

      gsap.ticker.add(tick);

      instances.push({
        renderer,
        scene,
        geom,
        mat,
        tick,
        layout,
        frameEl,
      });
    });

    scenesRef.current = instances;

    return () => {
      st.kill();
      instances.forEach((inst) => {
        window.removeEventListener('resize', inst.layout);
        gsap.ticker.remove(inst.tick);
        if (inst.mat?.uniforms?.uTexture?.value) {
          inst.mat.uniforms.uTexture.value.dispose();
        }
        inst.geom.dispose();
        inst.mat.dispose();
        inst.renderer.dispose();
        if (inst.renderer.domElement && inst.renderer.domElement.parentNode) {
          inst.renderer.domElement.parentNode.removeChild(inst.renderer.domElement);
        }
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="shader-gallery"
      style={{
        padding: '140px 0 160px',
        background: 'var(--color-cream, #FDFCFA)',
        color: '#1D1D1F',
        position: 'relative',
        borderTop: '1px solid rgba(184, 149, 106, 0.2)',
        borderBottom: '1px solid rgba(184, 149, 106, 0.2)',
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 80px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '999px',
              background: 'rgba(184, 149, 106, 0.1)',
              border: '1px solid rgba(184, 149, 106, 0.3)',
              color: '#B8956A',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <span>✦</span>
            <span>Fluid Velocity Shader Gallery • WebGL Refraction</span>
            <span>✦</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(34px, 4.5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#1D1D1F',
              fontFamily: 'var(--font-display)',
              marginBottom: '18px',
              lineHeight: 1.15,
            }}
          >
            Velocity-Reactive <span style={{ color: '#B8956A', fontStyle: 'italic' }}>Shader Optics</span>
          </h2>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#6E6E73',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Each editorial canvas is powered by an active Three.js WebGL shader. Scroll with speed to observe
            live liquid wave deformation and chromatic aberration refraction in real time.
          </p>
        </div>

        {/* Vertical Editorial Frames Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '100px', maxWidth: '980px', margin: '0 auto' }}>
          {SHADER_FRAMES.map((frame, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={frame.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '1.4fr 1fr' : '1fr 1.4fr',
                  alignItems: 'center',
                  gap: '48px',
                }}
                className="shader-card-row"
              >
                {/* Visual Canvas Frame (order depends on isEven) */}
                <div
                  style={{
                    order: isEven ? 1 : 2,
                    position: 'relative',
                  }}
                >
                  <div
                    ref={(el) => (frameRefs.current[idx] = el)}
                    className="shader-frame"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/10',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      background: '#EAE6E1',
                      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(184, 149, 106, 0.3)',
                    }}
                  >
                    {/* Top Floating Glass Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        zIndex: 5,
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid rgba(184, 149, 106, 0.3)',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#1D1D1F',
                      }}
                    >
                      0{idx + 1} • {frame.tag}
                    </div>

                    {/* Bottom Floating Dynamic Velocity Indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        zIndex: 5,
                        background: 'rgba(29, 29, 31, 0.85)',
                        backdropFilter: 'blur(12px)',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: '#FDFCFA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ color: '#D4B895' }}>✦</span> GLSL Velocity Active
                    </div>
                  </div>
                </div>

                {/* Narrative & Flacon Reservation Panel */}
                <div
                  style={{
                    order: isEven ? 2 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#B8956A',
                      fontWeight: 700,
                      marginBottom: '10px',
                    }}
                  >
                    {frame.subtitle}
                  </div>

                  <h3
                    style={{
                      fontSize: 'clamp(24px, 2.5vw, 34px)',
                      fontWeight: 700,
                      lineHeight: 1.25,
                      marginBottom: '14px',
                      color: '#1D1D1F',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {frame.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '15.5px',
                      lineHeight: 1.7,
                      color: '#6E6E73',
                      marginBottom: '20px',
                    }}
                  >
                    {frame.desc}
                  </p>

                  {/* Olfactory Note Capsule */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: 'rgba(184, 149, 106, 0.08)',
                      border: '1px solid rgba(184, 149, 106, 0.25)',
                      fontSize: '12px',
                      color: '#4A4A4E',
                      fontWeight: 600,
                      marginBottom: '28px',
                      width: 'fit-content',
                    }}
                  >
                    <FiDroplet style={{ color: '#B8956A' }} />
                    <span>{frame.notes}</span>
                  </div>

                  {/* Price and Reservation Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        Reserve Price
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#1D1D1F' }}>
                        ${frame.price} <span style={{ fontSize: '12px', fontWeight: 500, color: '#8E8E93' }}>USD</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(frame)}
                      style={{
                        padding: '12px 26px',
                        borderRadius: '999px',
                        background: addedMap[frame.id]
                          ? 'linear-gradient(135deg, #2E6F40 0%, #1E4E2C 100%)'
                          : 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '13px',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      {addedMap[frame.id] ? (
                        <>
                          <FiCheck />
                          <span>Reserved in Bag</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingBag />
                          <span>Reserve Flacon</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .shader-frame canvas {
          position: absolute;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          display: block;
        }
        @media (max-width: 868px) {
          .shader-card-row {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .shader-card-row > div {
            order: 1 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default VelocityShaderGallery;
