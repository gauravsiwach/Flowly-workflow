import React, { useEffect, useRef, useState } from 'react';

const LABEL_SETS = [
  [
    { id: 'zone1', label: 'Think' },
    { id: 'zone2', label: 'Plan' },
    { id: 'zone3', label: 'Execute' },
  ],
  [
    { id: 'zone1', label: 'Idea' },
    { id: 'zone2', label: 'Plan' },
    { id: 'zone3', label: 'Execute' },
  ]
];

function getUniqueColors(count) {
  const colors = [
    '#3B82F6', '#06B6D4', '#10B981', '#F59E42', '#F43F5E', '#A21CAF', '#FBBF24', '#6366F1', '#EC4899', '#22D3EE', '#F472B6', '#84CC16',
  ];
  const shuffled = colors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Responsive position helper
function getResponsivePositions(index, layout) {
  if (layout === 'mobile') {
    // Stack vertically, centered
    return { top: 80 + index * 110 + Math.random() * 20, left: '50%' };
  } else if (layout === 'tablet') {
    // Spread horizontally, but closer
    return { top: 80 + Math.random() * 30, left: 40 + index * 160 + Math.random() * 20 };
  } else {
    // Desktop: spread wide
    return { top: 50 + index * 120 + Math.random() * 40, left: 50 + Math.random() * 100 };
  }
}

function getLayout() {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 600) return 'mobile';
  if (w < 900) return 'tablet';
  return 'desktop';
}

export default function HeroFlowAnimation() {
  const containerRef = useRef();
  const svgRef = useRef();
  const blobRefs = useRef([]);
  const zoneRefs = useRef([]);
  const animationFrame = useRef();
  const [cycle, setCycle] = useState(0);
  const [showConnectors, setShowConnectors] = useState(true);
  const [visibleArrows, setVisibleArrows] = useState([false, false]);
  const [zonesWithBlob, setZonesWithBlob] = useState([false, false, false]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [layout, setLayout] = useState(getLayout());

  // Listen for window resize to update layout
  useEffect(() => {
    const handleResize = () => setLayout(getLayout());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to get zone positions
  const getZoneRects = () => {
    return zoneRefs.current.map((ref) => ref?.getBoundingClientRect());
  };

  // Pick label set based on cycle (even/odd)
  const ZONES = LABEL_SETS[cycle % 2];

  // Draw SVG connectors between zones, but only if visibleArrows[i] is true
  const drawConnectors = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) svg.appendChild(defs);
    const rects = getZoneRects();
    const svgRect = svg.getBoundingClientRect();
    for (let i = 0; i < rects.length - 1; i++) {
      if (!visibleArrows[i]) continue;
      const from = rects[i];
      const to = rects[i + 1];
      if (!from || !to) continue;
      // Responsive: adjust for mobile (vertical connectors)
      let startX, startY, endX, endY, dx;
      if (layout === 'mobile') {
        startX = from.left + from.width / 2 - svgRect.left;
        startY = from.bottom - svgRect.top;
        endX = to.left + to.width / 2 - svgRect.left;
        endY = to.top - svgRect.top;
        dx = 0;
      } else {
        startX = from.right - svgRect.left;
        startY = from.top + from.height / 2 - svgRect.top;
        endX = to.left - svgRect.left;
        endY = to.top + to.height / 2 - svgRect.top;
        dx = (endX - startX) * 0.5;
      }
      const d = layout === 'mobile'
        ? `M ${startX},${startY} C ${startX},${startY + 40} ${endX},${endY - 40} ${endX},${endY}`
        : `M ${startX},${startY} C ${startX + dx},${startY} ${endX - dx},${endY} ${endX},${endY}`;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-path arrow-fade-in');
      path.setAttribute('data-arrow-idx', i);
      svg.appendChild(path);
    }
  };

  // Animation logic (unchanged, but uses layout for positions)
  useEffect(() => {
    let running = true;
    let blobs = [];
    let usedZones = [];
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const createBlobs = () => {
      blobs = [];
      usedZones = [];
      const uniqueColors = getUniqueColors(3);
      for (let i = 0; i < 3; i++) {
        const { top, left } = getResponsivePositions(i, layout);
        const color = uniqueColors[i];
        const available = ZONES.filter(z => !usedZones.includes(z.id));
        const targetZone = available[Math.floor(Math.random() * available.length)].id;
        usedZones.push(targetZone);
        blobs.push({ top, left, color, target: targetZone });
      }
      return blobs;
    };
    const dropBlobs = async () => {
      let newZonesWithBlob = [false, false, false];
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobRefs.current[i];
        const zoneIdx = ZONES.findIndex(z => z.id === blobs[i].target);
        const zone = zoneRefs.current[zoneIdx];
        if (!blob || !zone) continue;
        await wait(400);
        const size = layout === 'mobile' ? 70 : layout === 'tablet' ? 90 : 120;
        const top = zone.offsetTop + (zone.offsetHeight - size) / 2;
        const left = zone.offsetLeft + (zone.offsetWidth - size) / 2;
        zone.classList.add('dropped');
        blob.style.top = `${top}px`;
        blob.style.left = typeof left === 'number' ? `${left}px` : left;
        blob.style.transform = 'scale(1.2)';
        newZonesWithBlob[zoneIdx] = true;
        setZonesWithBlob([...newZonesWithBlob]);
        await wait(200);
        blob.style.transform = 'scale(1)';
        zone.classList.remove('dropped');
      }
    };
    const removeBlobs = async () => {
      await wait(1500);
      blobs.forEach((_, i) => {
        const blob = blobRefs.current[i];
        if (blob) blob.style.opacity = 0;
      });
      setZonesWithBlob([false, false, false]);
      await wait(400);
    };
    const animate = async () => {
      while (running) {
        blobs = createBlobs();
        setCycle(c => c + 1);
        setShowConnectors(false);
        setVisibleArrows([false, false]);
        await wait(10);
        await dropBlobs();
        setShowConnectors(true);
        setVisibleArrows([true, false]);
        await wait(500);
        setVisibleArrows([true, true]);
        await wait(10);
        drawConnectors();
        await wait(300);
        drawConnectors();
        setShowConfetti(true);
        await wait(1000);
        setShowConfetti(false);
        await removeBlobs();
        setShowConnectors(false);
        setVisibleArrows([false, false]);
        await wait(800);
      }
    };
    setTimeout(() => {
      animate();
    }, 100);
    window.addEventListener('resize', drawConnectors);
    return () => {
      running = false;
      window.removeEventListener('resize', drawConnectors);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
    // eslint-disable-next-line
  }, [layout]);

  // Redraw connectors on mount and when blobs/zones/layout change
  useEffect(() => {
    if (showConnectors) {
      setTimeout(drawConnectors, 500);
    }
  }, [cycle, showConnectors, visibleArrows, layout]);

  // Generate blobs for this cycle (responsive)
  const blobs = React.useMemo(() => {
    let usedZones = [];
    return Array.from({ length: 3 }).map((_, i) => {
      const { top, left } = getResponsivePositions(i, layout);
      const color = getUniqueColors(3)[i];
      const available = LABEL_SETS[cycle % 2].filter(z => !usedZones.includes(z.id));
      const targetZone = available[Math.floor(Math.random() * available.length)].id;
      usedZones.push(targetZone);
      return { top, left, color, target: targetZone };
    });
  }, [cycle, layout]);

  // Responsive zone and blob sizes
  const zoneSize = layout === 'mobile' ? { width: 110, height: 70 } : layout === 'tablet' ? { width: 140, height: 100 } : { width: 180, height: 160 };
  const blobSize = layout === 'mobile' ? 70 : layout === 'tablet' ? 90 : 120;

  // Responsive zone positions
  const getZoneStyle = (idx) => {
    if (layout === 'mobile') {
      return {
        left: '50%',
        transform: 'translateX(-50%)',
        top: `${60 + idx * (zoneSize.height + 30)}px`,
        width: `${zoneSize.width}px`,
        height: `${zoneSize.height}px`,
        border: '2px dashed #444',
        borderRadius: '16px',
        position: 'absolute',
        transition: 'transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: 14,
        background: 'rgba(30,30,40,0.2)',
        zIndex: 2,
        pointerEvents: 'none',
      };
    } else if (layout === 'tablet') {
      return {
        left: `${60 + idx * (zoneSize.width + 40)}px`,
        top: '100px',
        width: `${zoneSize.width}px`,
        height: `${zoneSize.height}px`,
        border: '2px dashed #444',
        borderRadius: '16px',
        position: 'absolute',
        transition: 'transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: 15,
        background: 'rgba(30,30,40,0.2)',
        zIndex: 2,
        pointerEvents: 'none',
      };
    } else {
      return {
        left: `${300 + idx * 300}px`,
        top: '120px',
        width: `${zoneSize.width}px`,
        height: `${zoneSize.height}px`,
        border: '2px dashed #444',
        borderRadius: '16px',
        position: 'absolute',
        transition: 'transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: 16,
        background: 'rgba(30,30,40,0.2)',
        zIndex: 2,
        pointerEvents: 'none',
      };
    }
  };

  // Render
  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Drop Zones */}
      {ZONES.map((zone, idx) => (
        <div
          key={zone.id}
          ref={el => (zoneRefs.current[idx] = el)}
          className={`drop-zone zone${idx + 1}`}
          style={getZoneStyle(idx)}
        >
          {zonesWithBlob[idx] ? zone.label : ''}
        </div>
      ))}
      {/* Blobs */}
      {blobs.map((blob, i) => (
        <div
          key={cycle + '-' + i}
          ref={el => (blobRefs.current[i] = el)}
          className="blob"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.75,
            mixBlendMode: 'screen',
            transition: 'top 0.4s ease, left 0.4s ease, transform 0.3s ease, opacity 0.4s',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14,
            textShadow: '0 0 3px black',
            width: `${blobSize}px`,
            height: `${blobSize}px`,
            top: typeof blob.top === 'number' ? `${blob.top}px` : blob.top,
            left: typeof blob.left === 'number' ? `${blob.left}px` : blob.left,
            background: blob.color,
            pointerEvents: 'none',
          }}
        >
          Blob {i + 1}
        </div>
      ))}
      {/* SVG Connectors */}
      {showConnectors && (
        <svg
          ref={svgRef}
          className="connector-lines"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L10,5 L0,10 Z" fill="#00c9ff" />
            </marker>
          </defs>
        </svg>
      )}
      {/* Multiple Confetti Bursts */}
      {showConfetti && (
        <>
          <ConfettiBurst size={layout === 'mobile' ? 55 : layout === 'tablet' ? 80 : 120} x="52%" y="28%" />
          <ConfettiBurst size={layout === 'mobile' ? 60 : layout === 'tablet' ? 90 : 142} x="18%" y="42%" />
          <ConfettiBurst size={layout === 'mobile' ? 40 : layout === 'tablet' ? 60 : 67} x="78%" y="38%" />
          <ConfettiBurst size={layout === 'mobile' ? 70 : layout === 'tablet' ? 100 : 123} x="32%" y="72%" />
          <ConfettiBurst size={layout === 'mobile' ? 50 : layout === 'tablet' ? 70 : 98} x="88%" y="22%" />
          <ConfettiBurst size={layout === 'mobile' ? 80 : layout === 'tablet' ? 110 : 156} x="8%" y="58%" />
          <ConfettiBurst size={layout === 'mobile' ? 45 : layout === 'tablet' ? 70 : 73} x="95%" y="68%" />
          <ConfettiBurst size={layout === 'mobile' ? 70 : layout === 'tablet' ? 100 : 134} x="42%" y="48%" />
        </>
      )}
      {/* Animation CSS */}
      <style>{`
        .flow-path {
          stroke: #00c9ff;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          marker-end: url(#arrow);
          stroke-dasharray: 6;
          stroke-dashoffset: 0;
          animation: dashFlow 1s linear infinite;
        }
        .arrow-fade-in {
          opacity: 0;
          animation: fadeInArrow 0.5s forwards, dashFlow 1s linear infinite;
        }
        @keyframes fadeInArrow {
          to {
            opacity: 1;
          }
        }
        @keyframes dashFlow {
          to {
            stroke-dashoffset: -10;
          }
        }
        .drop-zone.dropped {
          animation: pulse 0.4s ease;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ConfettiBurst: Organic blob-style particles matching design
function ConfettiBurst({ size = 240, x = '50%', y = '50%' }) {
  const colors = [
    '#3B82F6', '#06B6D4', '#10B981', '#F59E42', '#F43F5E', '#A21CAF', '#FBBF24', '#6366F1', '#EC4899', '#22D3EE',
  ];
  const pieces = Array.from({ length: 8 }).map((_, i) => {
    const angle = (360 / 8) * i + Math.random() * 30;
    const distance = (size / 2.5) + Math.random() * (size / 8);
    const px = Math.cos((angle * Math.PI) / 180) * distance;
    const py = Math.sin((angle * Math.PI) / 180) * distance;
    const color = colors[i % colors.length];
    const particleSize = size / 4 + Math.random() * (size / 6);
    return (
      <circle
        key={i}
        cx={size / 2 + px}
        cy={size / 2 + py}
        r={particleSize / 2}
        fill={color}
        opacity="0.75"
        filter="blur(40px)"
      />
    );
  });
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 20,
        animation: 'organic-confetti 1s ease-out',
        mixBlendMode: 'screen',
      }}
    >
      {pieces}
      <style>{`
        @keyframes organic-confetti {
          0% { opacity: 0; transform: scale(0.2) translate(-50%, -50%); filter: blur(60px); }
          25% { opacity: 1; transform: scale(1.0) translate(-50%, -50%); filter: blur(40px); }
          75% { opacity: 1; transform: scale(1.4) translate(-50%, -50%); filter: blur(30px); }
          100% { opacity: 0; transform: scale(2.0) translate(-50%, -50%); filter: blur(20px); }
        }
      `}</style>
    </svg>
  );
} 