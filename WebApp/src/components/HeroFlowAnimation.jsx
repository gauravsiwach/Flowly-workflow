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
  // Moderately saturated, lively palette (not neon, not pastel)
  const colors = [
    '#3B82F6', // Blue
    '#06B6D4', // Cyan
    '#10B981', // Green
    '#F59E42', // Orange
    '#F43F5E', // Rose
    '#A21CAF', // Purple
    '#FBBF24', // Yellow
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#22D3EE', // Light Cyan
    '#F472B6', // Light Pink
    '#84CC16', // Lime
  ];
  // Shuffle and pick unique
  const shuffled = colors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomPosition(index) {
  const top = 50 + index * 120 + Math.random() * 40;
  const left = 50 + Math.random() * 100;
  return { top, left };
}

export default function HeroFlowAnimation() {
  const containerRef = useRef();
  const svgRef = useRef();
  const blobRefs = useRef([]);
  const zoneRefs = useRef([]);
  const animationFrame = useRef();
  const [cycle, setCycle] = useState(0);
  const [showConnectors, setShowConnectors] = useState(true);
  const [visibleArrows, setVisibleArrows] = useState([false, false]); // For fade-in
  const [zonesWithBlob, setZonesWithBlob] = useState([false, false, false]);
  const [showConfetti, setShowConfetti] = useState(false);

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
    // Clear all except <defs>
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
      // Start at right border of source, end at left border of target
      const startX = from.right - svgRect.left;
      const startY = from.top + from.height / 2 - svgRect.top;
      const endX = to.left - svgRect.left;
      const endY = to.top + to.height / 2 - svgRect.top;
      const dx = (endX - startX) * 0.5;
      const d = `M ${startX},${startY} C ${startX + dx},${startY} ${endX - dx},${endY} ${endX},${endY}`;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-path arrow-fade-in');
      path.setAttribute('data-arrow-idx', i);
      svg.appendChild(path);
    }
  };

  // Animation logic
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
        const { top, left } = getRandomPosition(i);
        const color = uniqueColors[i];
        // Assign each blob to a unique zone
        const available = ZONES.filter(z => !usedZones.includes(z.id));
        const targetZone = available[Math.floor(Math.random() * available.length)].id;
        usedZones.push(targetZone);
        blobs.push({
          top,
          left,
          color,
          target: targetZone,
        });
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
        const size = blob.offsetWidth;
        const top = zone.offsetTop + (zone.offsetHeight - size) / 2;
        const left = zone.offsetLeft + (zone.offsetWidth - size) / 2;
        zone.classList.add('dropped');
        blob.style.top = `${top}px`;
        blob.style.left = `${left}px`;
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
        setCycle(c => c + 1); // Force re-render of blobs
        setShowConnectors(false); // Hide arrows at the start of the cycle
        setVisibleArrows([false, false]); // Hide all arrows at the start
        await wait(10);
        await dropBlobs();
        setShowConnectors(true); // Show arrows after blobs have dropped
        setVisibleArrows([true, false]); // Show first arrow
        await wait(500); // Delay before showing second arrow
        setVisibleArrows([true, true]); // Show both arrows
        await wait(10);
        drawConnectors();
        await wait(300);
        drawConnectors();
        // Show confetti just before blobs fade out
        setShowConfetti(true);
        await wait(1000); // Confetti visible for 1 second
        setShowConfetti(false);
        await removeBlobs();
        setShowConnectors(false); // Hide arrows after blobs are removed
        setVisibleArrows([false, false]); // Hide all arrows
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
  }, []);

  // Redraw connectors on mount and when blobs/zones change
  useEffect(() => {
    if (showConnectors) {
      setTimeout(drawConnectors, 500);
    }
  }, [cycle, showConnectors, visibleArrows]);

  // Generate blobs for this cycle
  const blobs = React.useMemo(() => {
    let usedZones = [];
    return Array.from({ length: 3 }).map((_, i) => {
      const { top, left } = getRandomPosition(i);
      const color = getUniqueColors(3)[i]; // Use the same unique colors for blobs
      const available = ZONES.filter(z => !usedZones.includes(z.id));
      const targetZone = available[Math.floor(Math.random() * available.length)].id;
      usedZones.push(targetZone);
      return { top, left, color, target: targetZone };
    });
  }, [cycle]);

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
          style={{
            left: `${300 + idx * 300}px`,
            top: '120px',
            width: '180px',
            height: '160px',
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
          }}
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
            filter: 'blur(40px)', // balanced blur
            opacity: 0.75, // balanced opacity
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
            width: '120px',
            height: '120px',
            top: `${blob.top}px`,
            left: `${blob.left}px`,
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
          <ConfettiBurst size={85} x="52%" y="28%" />
          <ConfettiBurst size={142} x="18%" y="42%" />
          <ConfettiBurst size={67} x="78%" y="38%" />
          <ConfettiBurst size={123} x="32%" y="72%" />
          <ConfettiBurst size={98} x="88%" y="22%" />
          <ConfettiBurst size={156} x="8%" y="58%" />
          <ConfettiBurst size={73} x="95%" y="68%" />
          <ConfettiBurst size={134} x="42%" y="48%" />
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
    // Use the same colors as the blobs for consistency
    const colors = [
      '#3B82F6', // Blue
      '#06B6D4', // Cyan
      '#10B981', // Green
      '#F59E42', // Orange
      '#F43F5E', // Rose
      '#A21CAF', // Purple
      '#FBBF24', // Yellow
      '#6366F1', // Indigo
      '#EC4899', // Pink
      '#22D3EE', // Light Cyan
    ];
    
    // Create organic blob-like particles
    const pieces = Array.from({ length: 8 }).map((_, i) => {
      const angle = (360 / 8) * i + Math.random() * 30;
      const distance = (size / 2.5) + Math.random() * (size / 8);
      const px = Math.cos((angle * Math.PI) / 180) * distance;
      const py = Math.sin((angle * Math.PI) / 180) * distance;
      const color = colors[i % colors.length];
      const particleSize = 60 + Math.random() * 40; // Larger, more blob-like
      
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
            0% { 
              opacity: 0; 
              transform: scale(0.2) translate(-50%, -50%); 
              filter: blur(60px);
            }
            25% { 
              opacity: 1; 
              transform: scale(1.0) translate(-50%, -50%); 
              filter: blur(40px);
            }
            75% { 
              opacity: 1; 
              transform: scale(1.4) translate(-50%, -50%); 
              filter: blur(30px);
            }
            100% { 
              opacity: 0; 
              transform: scale(2.0) translate(-50%, -50%); 
              filter: blur(20px);
            }
          }
        `}</style>
      </svg>
    );
  } 