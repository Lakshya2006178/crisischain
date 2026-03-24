import React, { useState } from "react";

const DisasterMapAnimation = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const incidents = [
    {
      id: 1,
      x: 25,
      y: 30,
      type: "critical",
      label: "Fire Alert",
      pulseColor: "bg-red-500",
      glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.8)]",
    },
    {
      id: 2,
      x: 65,
      y: 70,
      type: "warning",
      label: "Medical Emergency",
      pulseColor: "bg-orange-500",
      glowColor: "shadow-[0_0_15px_rgba(249,115,22,0.8)]",
    },
    {
      id: 3,
      x: 80,
      y: 35,
      type: "critical",
      label: "Chemical Spill",
      pulseColor: "bg-red-500",
      glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.8)]",
    },
    {
      id: 4,
      x: 30,
      y: 75,
      type: "warning",
      label: "Structure Collapse",
      pulseColor: "bg-orange-500",
      glowColor: "shadow-[0_0_15px_rgba(249,115,22,0.8)]",
    },
  ];

  const commandCenter = { x: 50, y: 50 };

  return (
    <div className="relative w-full aspect-video md:aspect-[4/3] bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden flex items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Radar Scan Effect */}
      <div
        className="absolute w-[150%] h-[150%] origin-center rounded-full animate-[spin_5s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(59, 130, 246, 0.1) 0deg, rgba(59, 130, 246, 0.3) 60deg, transparent 65deg)",
          clipPath: "circle(50% at 50% 50%)",
        }}
      ></div>

      {/* Status Rings */}
      <div className="absolute w-32 h-32 rounded-full border border-blue-500/20 animate-[ping_3s_ease-out_infinite] opacity-50"></div>
      <div className="absolute w-64 h-64 rounded-full border border-blue-500/10 animate-[ping_4s_ease-out_infinite] opacity-40"></div>

      {/* Dispatch Routes via SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Glow Filters */}
        <defs>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Static connection lines */}
        {incidents.map((incident) => (
          <path
            key={`line-${incident.id}`}
            d={`M${commandCenter.x} ${commandCenter.y} L${incident.x} ${incident.y}`}
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />
        ))}

        {/* Animated Moving Routes (Scanning/Data transfer) */}
        {incidents.map((incident, idx) => (
          <path
            key={`anim-line-${incident.id}`}
            d={`M${commandCenter.x} ${commandCenter.y} L${incident.x} ${incident.y}`}
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="0.4"
            strokeDasharray="5 15"
            className={`animate-[dash_10s_linear_infinite] strike-dashoffset-0 opacity-60`}
            style={{ animationDelay: `${idx * 1.5}s` }}
            filter="url(#glow-blue)"
          />
        ))}

        {/* Moving Units (Resources) */}
        <circle r="0.8" fill="#10b981" filter="url(#glow-blue)">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path={`M${commandCenter.x} ${commandCenter.y} L${incidents[0].x} ${incidents[0].y}`}
          />
        </circle>
        <circle r="0.8" fill="#10b981" filter="url(#glow-blue)">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path={`M${commandCenter.x} ${commandCenter.y} L${incidents[1].x} ${incidents[1].y}`}
          />
        </circle>
        <circle r="0.8" fill="#3b82f6" filter="url(#glow-blue)">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path={`M${commandCenter.x} ${commandCenter.y} L${incidents[2].x} ${incidents[2].y}`}
          />
        </circle>
        <circle r="0.8" fill="#3b82f6" filter="url(#glow-blue)">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path={`M${commandCenter.x} ${commandCenter.y} L${incidents[3].x} ${incidents[3].y}`}
          />
        </circle>
      </svg>

      {/* Command Center Node */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-900/80 text-blue-200 text-[9px] px-1.5 py-0.5 rounded border border-blue-500/50 backdrop-blur-sm">
          HQ_ALPHA
        </div>
      </div>

      {/* Incident Markers */}
      {incidents.map((incident) => (
        <div
          key={`incident-${incident.id}`}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ top: `${incident.y}%`, left: `${incident.x}%` }}
          onMouseEnter={() => setHoveredNode(incident.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Base Node */}
          <div
            className={`relative w-4 h-4 rounded-full ${incident.pulseColor} ${incident.glowColor} group-hover:scale-125 transition-transform duration-300`}
          >
            {/* Ping effect */}
            <div
              className={`absolute inset-0 rounded-full ${incident.pulseColor} animate-ping opacity-75`}
            ></div>
            {/* Center dot */}
            <div className="absolute inset-1 bg-white/50 rounded-full"></div>
          </div>

          {/* Hover Tooltip Overlay */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800/90 text-white text-xs px-2 py-1 rounded border border-gray-600 backdrop-blur-md shadow-xl transition-all duration-300 pointer-events-none ${hoveredNode === incident.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            <div className="font-bold">{incident.label}</div>
            <div
              className={`text-[10px] uppercase tracking-wider ${incident.type === "critical" ? "text-red-400" : "text-orange-400"}`}
            >
              Status: Active
            </div>
            <div className="text-[10px] text-emerald-400">Units dispatched</div>
          </div>
        </div>
      ))}

      {/* Floating Info Panels */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-mono text-gray-300">
              LIVE: 4 Incidents
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-gray-300">
              UNITS: 12 Active
            </span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
      `,
        }}
      />
    </div>
  );
};

export default DisasterMapAnimation;
