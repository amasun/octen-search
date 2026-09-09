/**
 * Octen Hero 3D Orbiting Dots Engine with Realtime Control Panel
 * High-performance Software 3D Perspective Projection via Canvas 2D
 */

(function () {
  function initHeroOrbit() {
    const hero = document.getElementById('hero');
    // Support both dual-canvas 3D Sandwich mode, DOM frosted glass lens mode, and fallback
    const canvasBack = document.getElementById('heroOrbitCanvasBack') || document.getElementById('heroOrbitCanvas');
    const lensesFront = document.getElementById('heroOrbitLensesFront');
    const canvasFront = document.getElementById('heroOrbitCanvasFront');
    if (!hero || !canvasBack) return;

    const ctxBack = canvasBack.getContext('2d');
    const ctxFront = canvasFront ? canvasFront.getContext('2d') : null;
    if (!ctxBack) return;

    const isSandwich = Boolean(lensesFront || ctxFront);

    // --- Configuration Parameters ---
    const config = {
      count: 11,                    // Number of orbiting particles
      baseRadiusX: 435,             // Orbital horizontal semi-axis
      baseRadiusY: 225,             // Orbital vertical semi-axis
      tiltXDeg: 44,                 // Pitch (X) in degrees
      tiltX: 44 * Math.PI / 180,    // Pitch in radians
      tiltYDeg: -17,                // Yaw (Y) in degrees
      tiltY: -17 * Math.PI / 180,   // Yaw in radians
      tiltZDeg: -6,                 // Roll (Z) in degrees
      tiltZ: -6 * Math.PI / 180,    // Roll in radians
      curvature: 0.58,              // Saddle curvature factor (z depth)
      centerYRatio: 0.39,           // Vertical center relative to hero height (0 ~ 1)
      perspective: 2000,            // Camera focal distance
      dotSize: 34,                  // Base dot size in pixels
      speed: 0.00011,               // Orbital revolution speed
      dotColor: '#409148',          // Forest green dot color (no radial gradient)
      dofStrength: 14.5,            // Max background blur intensity in px
      dofMinAlpha: 0.18,            // Deepest background dot alpha
      introDuration: 1.8,           // Entrance transition in seconds
      zSplitOffset: 0,              // 3D Sandwich split threshold (Z offset relative to title plane)
      depthMode: 'sandwich',        // 'sandwich' (3D 穿插), 'behind' (全前置), 'front' (全后置)
      glassBlur: 10,                // Frosted glass backdrop blur in px
      glassSaturate: 135,           // Backdrop saturation in %
    };

    // Pre-allocated pool of DOM glass orbs with realtime backdrop blur
    const orbPool = [];
    function setupOrbPool(count) {
      if (!lensesFront) return;
      lensesFront.innerHTML = '';
      orbPool.length = 0;
      for (let i = 0; i < count; i++) {
        const orb = document.createElement('div');
        orb.className = 'hero-glass-orb';
        orb.style.display = 'none';
        lensesFront.appendChild(orb);
        orbPool.push(orb);
      }
    }
    setupOrbPool(config.count);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let angle = -0.7;
    let animFrameId = null;
    let isVisible = true;
    let startTime = performance.now();
    let lastTime = performance.now();
    let scaleRatio = 1;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // 3D Orbit Parametric Curve with dynamic Euler tilt (Pitch tX, Yaw tY, Roll tZ)
    function compute3D(theta, radiusX, radiusY, tX, tY, tZ) {
      const x0 = Math.cos(theta) * radiusX;
      const y0 = Math.sin(theta) * radiusY;
      const z0 = Math.sin(theta) * radiusY * config.curvature;

      const cosX = Math.cos(tX);
      const sinX = Math.sin(tX);
      const cosY = Math.cos(tY);
      const sinY = Math.sin(tY);
      const cosZ = Math.cos(tZ);
      const sinZ = Math.sin(tZ);

      // Rotate around X (Pitch)
      const y1 = y0 * cosX - z0 * sinX;
      const z1 = y0 * sinX + z0 * cosX;

      // Rotate around Y (Yaw)
      const x2 = x0 * cosY + z1 * sinY;
      const z2 = -x0 * sinY + z1 * cosY;

      // Rotate around Z (Roll)
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    }

    // Pinhole Perspective Camera Projection
    function project(p3d, cx, cy) {
      const fov = config.perspective / Math.max(10, config.perspective - p3d.z);
      return {
        x: cx + p3d.x * fov,
        y: cy + p3d.y * fov,
        z: p3d.z,
        fov: fov
      };
    }

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvasBack.width = width * dpr;
      canvasBack.height = height * dpr;
      ctxBack.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (ctxFront && canvasFront) {
        canvasFront.width = width * dpr;
        canvasFront.height = height * dpr;
        ctxFront.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      scaleRatio = Math.min(1, Math.max(0.48, width / 1200));
    }

    function render(now) {
      if (!isVisible) return;

      const delta = Math.min(50, now - lastTime);
      lastTime = now;

      ctxBack.clearRect(0, 0, width, height);
      if (ctxFront) {
        ctxFront.clearRect(0, 0, width, height);
      }

      const cx = width / 2;
      const cy = height * config.centerYRatio;
      const rx = config.baseRadiusX * scaleRatio;
      const ry = config.baseRadiusY * scaleRatio;

      // 1. Compute Intro Expansion Progress
      const elapsed = (now - startTime) / 1000;
      const introProgress = Math.min(1, elapsed / config.introDuration);
      const easeIntro = 1 - Math.pow(1 - introProgress, 3);

      // 2. Compute Orbiting Particles
      const dots = [];
      const twoPi = Math.PI * 2;

      for (let i = 0; i < config.count; i++) {
        const dotAngle = angle + (i / config.count) * twoPi;
        const p3d = compute3D(dotAngle, rx, ry, config.tiltX, config.tiltY, config.tiltZ);
        const p2d = project(p3d, cx, cy);

        // Depth span
        const depthSpan = ry * 2.2;
        const normZ = Math.max(0, Math.min(1, (p3d.z + ry * 1.1) / depthSpan));

        // Scale dot with distance and perspective
        const dotScale = (0.52 + normZ * 0.85) * p2d.fov * 0.5 * scaleRatio;
        const radius = Math.max(3, (config.dotSize * dotScale * 0.5) * easeIntro);

        // Depth-of-Field Blur
        const dofFactor = Math.pow(1 - normZ, 1.4);
        const blurPx = dofFactor * config.dofStrength;

        // Opacity gradient
        const alpha = config.dofMinAlpha + normZ * (1 - config.dofMinAlpha);

        dots.push({
          x: p2d.x,
          y: p2d.y,
          z: p3d.z,
          radius,
          normZ,
          alpha: alpha * easeIntro,
          blur: blurPx
        });
      }

      // 3. Painters Algorithm (Far to near)
      dots.sort((a, b) => a.z - b.z);

      // 4. Render Dots across 3D Sandwich Layers
      const zThreshold = config.zSplitOffset || 0;
      let frontOrbIdx = 0;

      for (const dot of dots) {
        if (dot.radius <= 0) continue;

        const isFront = (isSandwich && (
          config.depthMode === 'behind' ||
          (config.depthMode === 'sandwich' && dot.z >= zThreshold)
        ));

        if (isFront && lensesFront) {
          // Render as frosted glass orb in front of title (with backdrop-filter text blur)
          if (frontOrbIdx < orbPool.length) {
            const orb = orbPool[frontOrbIdx];
            const diam = Math.max(6, Math.round(dot.radius * 2));
            orb.style.display = 'block';
            orb.style.width = `${diam}px`;
            orb.style.height = `${diam}px`;
            orb.style.transform = `translate3d(${(dot.x - dot.radius).toFixed(1)}px, ${(dot.y - dot.radius).toFixed(1)}px, 0)`;
            orb.style.opacity = Math.min(1, dot.alpha).toFixed(3);
            frontOrbIdx++;
          }
        } else {
          // Render on canvasBack (behind title or fallback)
          const targetCtx = (isFront && ctxFront) ? ctxFront : ctxBack;
          targetCtx.save();

          if (dot.blur > 0.4) {
            targetCtx.filter = `blur(${dot.blur.toFixed(1)}px)`;
          } else {
            targetCtx.filter = 'none';
          }

          targetCtx.globalAlpha = dot.alpha * 0.75;

          targetCtx.fillStyle = config.dotColor;
          targetCtx.beginPath();
          targetCtx.arc(dot.x, dot.y, dot.radius, 0, twoPi);
          targetCtx.fill();

          targetCtx.restore();
        }
      }

      // Hide unused orbs in pool
      if (lensesFront) {
        for (let j = frontOrbIdx; j < orbPool.length; j++) {
          orbPool[j].style.display = 'none';
        }
      }

      if (!prefersReducedMotion.matches) {
        angle += config.speed * delta;
      }

      animFrameId = requestAnimationFrame(render);
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastTime = performance.now();
        if (!animFrameId) {
          animFrameId = requestAnimationFrame(render);
        }
      } else {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      }
    }, { threshold: 0 });

    observer.observe(hero);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(hero);

    resize();
    animFrameId = requestAnimationFrame(render);

    // --- Interactive Floating Control Panel ---
    createOrbitControlPanel(config);
  }

  // Helper to build the draggable floating slider panel
  function createOrbitControlPanel(config) {
    if (document.getElementById('hero-orbit-panel')) return;

    // Inject Panel Styles
    const style = document.createElement('style');
    style.id = 'hero-orbit-panel-style';
    style.textContent = `
      #hero-orbit-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        width: 340px;
        background: rgba(13, 17, 23, 0.94);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 14px;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(112, 254, 126, 0.1);
        color: #F0F6FC;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        user-select: none;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateY(20px) scale(0.96);
        transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.28s ease;
      }
      #hero-orbit-panel.is-visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0) scale(1);
      }
      #hero-orbit-panel.is-visible.is-collapsed {
        transform: translateY(calc(100% - 44px));
      }
      .hop-header-btns {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .hop-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        cursor: pointer;
      }
      .hop-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 13px;
        color: #FFF;
      }
      .hop-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(112, 254, 126, 0.15);
        color: #70FE7E;
        font-weight: 700;
        text-transform: uppercase;
      }
      .hop-toggle-btn {
        background: transparent;
        border: none;
        color: #8B949E;
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        line-height: 1;
        transition: color 0.15s ease;
      }
      .hop-toggle-btn:hover {
        color: #FFF;
      }
      .hop-body {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 500px;
        overflow-y: auto;
      }
      .hop-body::-webkit-scrollbar {
        width: 5px;
      }
      .hop-body::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.04);
        border-radius: 4px;
      }
      .hop-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.18);
        border-radius: 4px;
      }
      .hop-body::-webkit-scrollbar-thumb:hover {
        background: #70FE7E;
      }
      .hop-section-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #70FE7E;
        padding-top: 8px;
        margin-top: 4px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .hop-section-title:first-child {
        border-top: none;
        padding-top: 0;
        margin-top: 0;
      }
      .hop-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .hop-row-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #C9D1D9;
      }
      .hop-val {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        color: #70FE7E;
        font-weight: 600;
      }
      .hop-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 3px;
        outline: none;
        margin: 4px 0;
        cursor: pointer;
      }
      .hop-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #70FE7E;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(112, 254, 126, 0.6);
        transition: transform 0.1s ease;
      }
      .hop-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
      }
      .hop-actions {
        display: flex;
        gap: 8px;
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .hop-btn {
        flex: 1;
        height: 32px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.06);
        color: #F0F6FC;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.15s ease;
      }
      .hop-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.3);
      }
      .hop-btn-primary {
        background: rgba(112, 254, 126, 0.15);
        border-color: rgba(112, 254, 126, 0.4);
        color: #70FE7E;
      }
      .hop-btn-primary:hover {
        background: rgba(112, 254, 126, 0.25);
        border-color: #70FE7E;
        color: #FFF;
      }
      .hop-copied-toast {
        position: absolute;
        top: -34px;
        left: 50%;
        transform: translateX(-50%);
        background: #10B981;
        color: #000;
        font-weight: 700;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .hop-copied-toast.show {
        opacity: 1;
        transform: translate(-50%, -4px);
      }
    `;
    document.head.appendChild(style);

    // Initial Defaults for Reset
    const defaults = {
      tiltXDeg: 44,
      tiltYDeg: -17,
      tiltZDeg: -6,
      curvature: 0.58,
      baseRadiusX: 435,
      baseRadiusY: 225,
      centerYRatio: 0.39,
      perspective: 2000,
      dotSize: 34,
      count: 11,
      speed: 0.00011,
      dofStrength: 14.5
    };

    // Sliders Grouped by Category
    const sliderSections = [
      {
        category: '3D 旋转姿态 (Pitch / Yaw / Roll)',
        items: [
          {
            id: 'tiltXDeg',
            label: '俯仰 Pitch (Tilt X)',
            hint: '围绕 X 轴旋转：控制上下倾斜与前后落差（角度越大前部越平缓）',
            min: -90,
            max: 90,
            step: 1,
            unit: '°',
            get: () => config.tiltXDeg,
            set: (v) => {
              config.tiltXDeg = Number(v);
              config.tiltX = Number(v) * Math.PI / 180;
            }
          },
          {
            id: 'tiltYDeg',
            label: '偏航 Yaw (Tilt Y)',
            hint: '围绕 Y 轴旋转：控制水平左右朝向角度',
            min: -90,
            max: 90,
            step: 1,
            unit: '°',
            get: () => config.tiltYDeg,
            set: (v) => {
              config.tiltYDeg = Number(v);
              config.tiltY = Number(v) * Math.PI / 180;
            }
          },
          {
            id: 'tiltZDeg',
            label: '翻滚 Roll (Tilt Z)',
            hint: '围绕 Z 轴旋转：控制画面平面顺/逆时针侧倾',
            min: -90,
            max: 90,
            step: 1,
            unit: '°',
            get: () => config.tiltZDeg,
            set: (v) => {
              config.tiltZDeg = Number(v);
              config.tiltZ = Number(v) * Math.PI / 180;
            }
          },
          {
            id: 'curvature',
            label: '鞍形曲率 Curvature',
            hint: 'Z 轴空间马鞍弯曲深度（0 为完全平坦平面）',
            min: 0,
            max: 1.0,
            step: 0.02,
            unit: '',
            get: () => config.curvature,
            set: (v) => {
              config.curvature = Number(v);
            }
          }
        ]
      },
      {
        category: '空间与相机 (Geometry & Camera)',
        items: [
          {
            id: 'baseRadiusX',
            label: '水平半轴 Radius X',
            hint: '横向椭圆轨道跨度',
            min: 250,
            max: 700,
            step: 5,
            unit: 'px',
            get: () => config.baseRadiusX,
            set: (v) => {
              config.baseRadiusX = Number(v);
            }
          },
          {
            id: 'baseRadiusY',
            label: '垂直半轴 Radius Y',
            hint: '纵向跨度：前后球体的上下高低落差',
            min: 80,
            max: 450,
            step: 5,
            unit: 'px',
            get: () => config.baseRadiusY,
            set: (v) => {
              config.baseRadiusY = Number(v);
            }
          },
          {
            id: 'centerYRatio',
            label: '垂直中心 Center Y',
            hint: '控制整个轨道在 Hero 区域的基准垂直高度',
            min: 0.15,
            max: 0.75,
            step: 0.01,
            unit: '',
            get: () => config.centerYRatio,
            set: (v) => {
              config.centerYRatio = Number(v);
            }
          },
          {
            id: 'perspective',
            label: '透视焦距 Perspective',
            hint: '视距越大(如 1500+)，近大远小与近处下沉感越缓和',
            min: 400,
            max: 2000,
            step: 20,
            unit: '',
            get: () => config.perspective,
            set: (v) => {
              config.perspective = Number(v);
            }
          },
          {
            id: 'zSplitOffset',
            label: '3D 穿插分割面 Z Split',
            hint: '文字前后穿插的 Z 轴阈值（0 为文字中心面，负值更多粒子在前，正值更多粒子在后）',
            min: -150,
            max: 150,
            step: 5,
            unit: 'px',
            get: () => config.zSplitOffset,
            set: (v) => {
              config.zSplitOffset = Number(v);
            }
          }
        ]
      },
      {
        category: '粒子与视觉 (Particles & FX)',
        items: [
          {
            id: 'dotSize',
            label: '球体尺寸 Dot Size',
            hint: '粒子基础直径',
            min: 16,
            max: 90,
            step: 2,
            unit: 'px',
            get: () => config.dotSize,
            set: (v) => {
              config.dotSize = Number(v);
            }
          },
          {
            id: 'count',
            label: '球体数量 Count',
            hint: '轨道上的粒子总数',
            min: 4,
            max: 16,
            step: 1,
            unit: '',
            get: () => config.count,
            set: (v) => {
              config.count = Math.round(Number(v));
              setupOrbPool(config.count);
            }
          },
          {
            id: 'speed',
            label: '公转速度 Speed',
            hint: '轨道运动快慢',
            min: 0.00002,
            max: 0.00050,
            step: 0.00001,
            unit: '',
            get: () => config.speed,
            set: (v) => {
              config.speed = Number(v);
            }
          },
          {
            id: 'dofStrength',
            label: '景深模糊 DoF Blur',
            hint: '后景光学失焦散景强度',
            min: 0,
            max: 25,
            step: 0.5,
            unit: 'px',
            get: () => config.dofStrength,
            set: (v) => {
              config.dofStrength = Number(v);
            }
          },
          {
            id: 'glassBlur',
            label: '文字磨砂模糊 Glass Blur',
            hint: '球体滑过文字时背景文字笔画的虚化程度（px）',
            min: 0,
            max: 24,
            step: 1,
            unit: 'px',
            get: () => config.glassBlur,
            set: (v) => {
              config.glassBlur = Number(v);
              lensesFront?.style.setProperty('--glass-blur', `${v}px`);
            }
          }
        ]
      }
    ];

    const allSliders = sliderSections.flatMap(sec => sec.items);

    const panel = document.createElement('div');
    panel.id = 'hero-orbit-panel';
    panel.innerHTML = `
      <div class="hop-copied-toast" id="hopToast">已复制参数代码至剪贴板！</div>
      <div class="hop-header" id="hopHeader">
        <div class="hop-title">
          <span>球体轨道微调</span>
          <span class="hop-badge">Live Controls</span>
        </div>
        <div class="hop-header-btns">
          <button class="hop-toggle-btn" id="hopToggle" title="折叠/展开" aria-label="Toggle panel">−</button>
          <button class="hop-toggle-btn" id="hopClose" title="隐藏面板 (双击页面可重新唤出)" aria-label="Close panel">✕</button>
        </div>
      </div>
      <div class="hop-body" id="hopBody">
        ${sliderSections.map(sec => `
          <div class="hop-section-title">${sec.category}</div>
          ${sec.items.map(s => `
            <div class="hop-row">
              <div class="hop-row-head">
                <span title="${s.hint}">${s.label}</span>
                <span class="hop-val" id="val-${s.id}">${s.get()}${s.unit}</span>
              </div>
              <input type="range" class="hop-slider" id="slider-${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.get()}">
            </div>
          `).join('')}
        `).join('')}
        <div class="hop-row" style="margin-top: 4px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
          <div class="hop-row-head">
            <span>球体色彩 Color</span>
            <span class="hop-val" id="val-dotColor">${config.dotColor}</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
            <input type="color" id="picker-dotColor" value="${config.dotColor}" style="width: 34px; height: 26px; border: 1px solid rgba(255,255,255,0.2); background: transparent; cursor: pointer; border-radius: 4px; padding: 0;">
            <button type="button" class="hop-btn" id="btn-color-forest" style="height: 26px; font-size: 11px;">🌲 森林绿</button>
            <button type="button" class="hop-btn" id="btn-color-white" style="height: 26px; font-size: 11px;">⚪ 纯白</button>
            <button type="button" class="hop-btn" id="btn-color-green" style="height: 26px; font-size: 11px;">🟢 极光绿</button>
          </div>
        </div>
        <div class="hop-actions">
          <button class="hop-btn hop-btn-primary" id="hopCopyBtn">📋 复制当前参数</button>
          <button class="hop-btn" id="hopResetBtn">↺ 重置默认</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Visibility toggle (default hidden, dblclick anywhere to show/hide)
    function setPanelVisibility(show) {
      if (show) {
        panel.classList.add('is-visible');
      } else {
        panel.classList.remove('is-visible');
      }
    }

    // Double-click listener on document to toggle panel
    document.addEventListener('dblclick', (e) => {
      // Ignore double-clicks inside the panel
      if (panel.contains(e.target)) return;
      // Ignore double-clicks on inputs/buttons/interactive controls
      if (['INPUT', 'BUTTON', 'TEXTAREA', 'A'].includes(e.target.tagName)) return;
      const isVisible = panel.classList.contains('is-visible');
      setPanelVisibility(!isVisible);
    });

    // Close button click
    document.getElementById('hopClose')?.addEventListener('click', (e) => {
      e.stopPropagation();
      setPanelVisibility(false);
    });

    // Escape key closes panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-visible')) {
        setPanelVisibility(false);
      }
    });

    // Toggle collapse
    const header = document.getElementById('hopHeader');
    const toggleBtn = document.getElementById('hopToggle');
    header.addEventListener('click', (e) => {
      if (e.target.closest('#hopClose')) return;
      panel.classList.toggle('is-collapsed');
      toggleBtn.textContent = panel.classList.contains('is-collapsed') ? '+' : '−';
    });

    // Wire up sliders
    allSliders.forEach(s => {
      const slider = document.getElementById(`slider-${s.id}`);
      const valDisplay = document.getElementById(`val-${s.id}`);
      if (!slider || !valDisplay) return;

      slider.addEventListener('input', (e) => {
        const val = e.target.value;
        s.set(val);
        valDisplay.textContent = `${val}${s.unit}`;
      });
    });

    // Color controls
    const colorPicker = document.getElementById('picker-dotColor');
    const colorVal = document.getElementById('val-dotColor');
    function setDotColor(hex) {
      config.dotColor = hex;
      if (colorPicker) colorPicker.value = hex;
      if (colorVal) colorVal.textContent = hex.toUpperCase();
    }
    colorPicker?.addEventListener('input', (e) => setDotColor(e.target.value));
    document.getElementById('btn-color-forest')?.addEventListener('click', () => setDotColor('#409148'));
    document.getElementById('btn-color-white')?.addEventListener('click', () => setDotColor('#FFFFFF'));
    document.getElementById('btn-color-green')?.addEventListener('click', () => setDotColor('#70FE7E'));

    // Reset button
    document.getElementById('hopResetBtn')?.addEventListener('click', () => {
      allSliders.forEach(s => {
        const def = defaults[s.id];
        if (def !== undefined) {
          s.set(def);
          const slider = document.getElementById(`slider-${s.id}`);
          const valDisplay = document.getElementById(`val-${s.id}`);
          if (slider) slider.value = def;
          if (valDisplay) valDisplay.textContent = `${def}${s.unit}`;
        }
      });
      setDotColor('#409148');
    });

    // Copy parameters button
    document.getElementById('hopCopyBtn')?.addEventListener('click', () => {
      const codeSnippet = `const config = {
  count: ${config.count},
  baseRadiusX: ${config.baseRadiusX},
  baseRadiusY: ${config.baseRadiusY},
  tiltX: ${config.tiltXDeg} * Math.PI / 180, // ${config.tiltXDeg} deg (Pitch)
  tiltY: ${config.tiltYDeg} * Math.PI / 180, // ${config.tiltYDeg} deg (Yaw)
  tiltZ: ${config.tiltZDeg} * Math.PI / 180, // ${config.tiltZDeg} deg (Roll)
  curvature: ${config.curvature},
  centerYRatio: ${config.centerYRatio},
  perspective: ${config.perspective},
  dotSize: ${config.dotSize},
  speed: ${config.speed},
  dotColor: '${config.dotColor}',
  dofStrength: ${config.dofStrength},
  dofMinAlpha: 0.18,
  introDuration: 1.8,
  zSplitOffset: ${config.zSplitOffset},
  glassBlur: ${config.glassBlur},
};`;

      navigator.clipboard.writeText(codeSnippet).then(() => {
        const toast = document.getElementById('hopToast');
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
        }
      }).catch(() => {
        prompt('复制以下配置代码：', codeSnippet);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroOrbit);
  } else {
    initHeroOrbit();
  }
})();
