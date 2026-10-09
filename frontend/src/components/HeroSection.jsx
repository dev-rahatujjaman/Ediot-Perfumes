import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const VIDEOS = ['/videos/hero-video-1.mp4', '/videos/hero-video-2.mp4'];

// ─── WebGL Vertex Shader ───────────────────────────────────────────────────
const vertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// ─── WebGL Fragment Shader with Ultra-Smooth Ink Marbling Fluid Mask ────────
const fragmentShader = `
  precision highp float;

  uniform sampler2D u_texture1; // Front video
  uniform sampler2D u_texture2; // Behind video
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_radius;
  uniform float u_speed;
  uniform float u_videoAspect1;
  uniform float u_videoAspect2;
  uniform float u_turbulenceIntensity;

  varying vec2 v_uv;

  // 3D hash
  vec3 hash33(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.zxy, p.yxz + 19.27);
    return fract(vec3(p.x * p.y, p.z * p.x, p.y * p.z));
  }

  // Simplex Noise
  float simplex_noise(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K2 * 2.0);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);
    
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(d0, hash33(i) * 2.0 - 1.0),
      dot(d1, hash33(i + i1) * 2.0 - 1.0),
      dot(d2, hash33(i + i2) * 2.0 - 1.0),
      dot(d3, hash33(i + 1.0) * 2.0 - 1.0)
    );
    
    return 0.5 + 0.5 * 31.0 * dot(n, vec4(1.0));
  }

  // Curl noise for organic liquid motion
  vec2 curl(vec2 p, float time) {
    const float eps = 0.002;
    float n1 = simplex_noise(vec3(p.x, p.y + eps, time));
    float n2 = simplex_noise(vec3(p.x, p.y - eps, time));
    float n3 = simplex_noise(vec3(p.x + eps, p.y, time));
    float n4 = simplex_noise(vec3(p.x - eps, p.y, time));
    float x = (n2 - n1) / (2.0 * eps);
    float y = (n4 - n3) / (2.0 * eps);
    return vec2(x, y);
  }

  // Ink marbling fluid dynamics
  float inkMarbling(vec2 p, float time, float intensity) {
    float result = 0.0;
    
    // Large fluid eddies
    vec2 flow1 = curl(p * 1.4, time * 0.08) * intensity * 1.8;
    vec2 p1 = p + flow1 * 0.25;
    result += simplex_noise(vec3(p1 * 1.8, time * 0.12)) * 0.55;
    
    // Medium silky swirls
    vec2 flow2 = curl(p * 2.6 + vec2(sin(time * 0.15), cos(time * 0.12)), time * 0.16) * intensity;
    vec2 p2 = p + flow2 * 0.18;
    result += simplex_noise(vec3(p2 * 3.5, time * 0.2)) * 0.3;
    
    // Golden harmonic spiral
    float dist = length(p - vec2(0.5));
    float angle = atan(p.y - 0.5, p.x - 0.5);
    float spiral = sin(dist * 12.0 - angle * 2.0 + time * 0.25) * 0.5 + 0.5;
    
    result = mix(result, spiral, 0.3);
    return result * 0.5 + 0.5;
  }

  // UV cover aspect ratio calculation (no stretching)
  vec2 getCoverUV(vec2 uv, float screenAspect, float mediaAspect) {
    vec2 s = vec2(1.0);
    if (screenAspect > mediaAspect) {
      s = vec2(1.0, screenAspect / mediaAspect);
    } else {
      s = vec2(mediaAspect / screenAspect, 1.0);
    }
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = v_uv;
    float screenAspect = u_resolution.x / u_resolution.y;

    // Aspect-ratio cover mapping for both videos
    vec2 uv1 = getCoverUV(uv, screenAspect, u_videoAspect1);
    vec2 uv2 = getCoverUV(uv, screenAspect, u_videoAspect2);

    // Aspect-corrected distance from mouse
    vec2 correctedUV = uv;
    correctedUV.x *= screenAspect;
    vec2 correctedMouse = u_mouse;
    correctedMouse.x *= screenAspect;

    float dist = distance(correctedUV, correctedMouse);

    // Organic fluid marbling displacement
    float marbleEffect = inkMarbling(uv * 2.0 + u_time * u_speed * 0.06, u_time, u_turbulenceIntensity * 1.8);
    float jaggedDist = dist + (marbleEffect - 0.5) * u_turbulenceIntensity * 1.8;

    // Feathered fluid mask edge for ultra-smooth transition
    float edge = 0.085;
    float mask = u_radius > 0.001 ? smoothstep(u_radius, u_radius - edge, jaggedDist) : 0.0;

    // Subtle chromatic dispersion at the liquid boundary
    float maskR = u_radius > 0.001 ? smoothstep(u_radius + 0.008, u_radius - edge + 0.008, jaggedDist) : 0.0;
    float maskB = u_radius > 0.001 ? smoothstep(u_radius - 0.008, u_radius - edge - 0.008, jaggedDist) : 0.0;

    vec4 col1 = texture2D(u_texture1, uv1);
    vec4 col2 = texture2D(u_texture2, uv2);

    // Luminous 24K gold caustic rim along the fluid perimeter
    float rim = u_radius > 0.001 ? smoothstep(0.045, 0.0, abs(jaggedDist - u_radius)) : 0.0;
    vec3 goldCaustic = vec3(0.96, 0.84, 0.58) * rim * 0.75;

    // Blend color channels with subtle liquid dispersion
    vec3 finalColor;
    finalColor.r = mix(col1.r, col2.r, maskR);
    finalColor.g = mix(col1.g, col2.g, mask);
    finalColor.b = mix(col1.b, col2.b, maskB);
    finalColor += goldCaustic;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const HeroSection = () => {
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const [webglReady, setWebglReady] = useState(false);

  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    uniforms: null,
    targetMouse: new THREE.Vector2(0.5, 0.5),
    lerpedMouse: new THREE.Vector2(0.5, 0.5),
    radiusTween: null,
    animId: null,
    isInView: true,
  });

  useEffect(() => {
    const container = canvasContainerRef.current;
    const v1 = videoRef1.current;
    const v2 = videoRef2.current;
    if (!container || !v1 || !v2) return;

    // Ensure videos are playing smoothly
    const playVideos = () => {
      v1.play().catch(() => {});
      v2.play().catch(() => {});
    };
    playVideos();
    document.addEventListener('click', playVideos, { once: true });
    document.addEventListener('touchstart', playVideos, { once: true });

    // Create Three.js VideoTextures
    const texture1 = new THREE.VideoTexture(v1);
    const texture2 = new THREE.VideoTexture(v2);
    texture1.minFilter = THREE.LinearFilter;
    texture1.magFilter = THREE.LinearFilter;
    texture2.minFilter = THREE.LinearFilter;
    texture2.magFilter = THREE.LinearFilter;

    if (THREE.SRGBColorSpace) {
      texture1.colorSpace = THREE.SRGBColorSpace;
      texture2.colorSpace = THREE.SRGBColorSpace;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      u_texture1: { value: texture1 },
      u_texture2: { value: texture2 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_radius: { value: 0.0 },
      u_speed: { value: 0.65 },
      u_videoAspect1: { value: 16 / 9 },
      u_videoAspect2: { value: 16 / 9 },
      u_turbulenceIntensity: { value: 0.18 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      setWebglReady(true);
    } catch (err) {
      console.warn('WebGL init fallback:', err);
      return;
    }

    threeRef.current.scene = scene;
    threeRef.current.camera = camera;
    threeRef.current.renderer = renderer;
    threeRef.current.uniforms = uniforms;

    // Update video aspect ratios once loaded
    const updateAspects = () => {
      if (v1.videoWidth && v1.videoHeight) {
        uniforms.u_videoAspect1.value = v1.videoWidth / v1.videoHeight;
      }
      if (v2.videoWidth && v2.videoHeight) {
        uniforms.u_videoAspect2.value = v2.videoWidth / v2.videoHeight;
      }
    };
    v1.addEventListener('loadedmetadata', updateAspects);
    v2.addEventListener('loadedmetadata', updateAspects);

    // Super smooth render loop with exponential damping
    let lastTime = performance.now();
    const render = (now) => {
      threeRef.current.animId = requestAnimationFrame(render);
      if (!threeRef.current.isInView) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Silky smooth mouse interpolation
      threeRef.current.lerpedMouse.lerp(threeRef.current.targetMouse, 0.085);
      uniforms.u_mouse.value.copy(threeRef.current.lerpedMouse);
      uniforms.u_time.value += delta * 1.1;

      renderer.render(scene, camera);
    };
    threeRef.current.animId = requestAnimationFrame(render);

    // Pause animation when scrolled out of view (zero GPU usage)
    const observer = new IntersectionObserver(
      ([entry]) => {
        threeRef.current.isInView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) observer.unobserve(containerRef.current);
      cancelAnimationFrame(threeRef.current.animId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      texture1.dispose();
      texture2.dispose();
    };
  }, []);

  // Handle Mouse Move & Touch
  const handleMouseMove = (e) => {
    if (!containerRef.current || !threeRef.current.uniforms) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    const x = (clientX - rect.left) / rect.width;
    const y = 1.0 - (clientY - rect.top) / rect.height;

    threeRef.current.targetMouse.set(
      Math.max(0, Math.min(1, x)),
      Math.max(0, Math.min(1, y))
    );
  };

  const handleMouseEnter = (e) => {
    handleMouseMove(e);
    if (threeRef.current.radiusTween) threeRef.current.radiusTween.kill();
    threeRef.current.radiusTween = gsap.to(threeRef.current.uniforms.u_radius, {
      value: 0.38,
      duration: 0.75,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    if (threeRef.current.radiusTween) threeRef.current.radiusTween.kill();
    threeRef.current.radiusTween = gsap.to(threeRef.current.uniforms.u_radius, {
      value: 0.0,
      duration: 0.65,
      ease: 'power3.inOut',
    });
  };

  return (
    <section
      ref={containerRef}
      className="hero-video-section"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      <style>{`
        /* Canvas Layer */
        .hero-shader-canvas-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .hero-shader-canvas-wrap canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        /* Native Video Texture Sources */
        .hero-native-video-source {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* ─── LIVE VIDEO ELEMENTS IN DOM (Active playback decoded by browser) ─── */}
      <video
        ref={videoRef1}
        src={VIDEOS[0]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hero-native-video-source"
        style={{ opacity: webglReady ? 0.001 : 1 }}
      />
      <video
        ref={videoRef2}
        src={VIDEOS[1]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hero-native-video-source"
        style={{ opacity: webglReady ? 0.001 : 0 }}
      />

      {/* ─── WEBGL INK-MARBLING SHADER CANVAS ───────────────────────── */}
      <div ref={canvasContainerRef} className="hero-shader-canvas-wrap" />

      {/* ─── CINEMATIC GRADIENT VIGNETTES ───────────────────────────── */}
      <div className="hero-video-overlay" style={{ pointerEvents: 'none', zIndex: 3 }} />
      <div className="hero-video-gradient" style={{ pointerEvents: 'none', zIndex: 3 }} />
    </section>
  );
};

export default HeroSection;
