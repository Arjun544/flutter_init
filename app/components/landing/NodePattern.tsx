"use client";

import { Switch } from '@/components/ui/switch';
import { Folder01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Database, Flame, Globe, Package, Route, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export function NodePattern() {
  const [nodes, setNodes] = useState({
    riverpod: true,
    supabase: false,
    goRouter: true,
    firebase: false,
    bloc: false,
    dio: true,
  });

  const toggleNode = (key: keyof typeof nodes) => {
    setNodes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NodeSwitch = ({
    stateKey,
    top, left,
    bgClass,
    Icon,
    label
  }: { stateKey: keyof typeof nodes, top: string, left: string, bgClass: string, Icon: any, label: string }) => {
    const active = nodes[stateKey];
    return (
      <div
        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-[1.03] transition-transform duration-300"
        style={{ top, left }}
        onClick={(e) => {
          toggleNode(stateKey);
        }}
      >
        <div className={`flex items-center p-1.5 sm:p-2 pr-3 sm:pr-4 rounded-[1.25rem] sm:rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-xl
          ${active
            ? 'bg-white border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-primary/5'
            : 'bg-white/70 hover:bg-white/95 border-white/40 shadow-zinc-200/20'}
        `}>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[0.85rem] sm:rounded-xl flex items-center justify-center transition-all duration-300 border ${active ? bgClass + ' border-white/20 shadow-sm' : 'bg-zinc-100 border-zinc-200'}`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${active ? 'text-white drop-shadow-sm' : 'text-zinc-400'}`} />
          </div>

          <span className={`text-[13px] sm:text-[15px] font-bold ml-3 mr-8 transition-colors duration-300 ${active ? 'text-zinc-800' : 'text-zinc-500'}`}>
            {label}
          </span>

          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={active}
              onCheckedChange={() => toggleNode(stateKey)}
              className={`cursor-pointer transition-colors duration-300 ${active ? 'data-[state=checked]:bg-primary' : ''}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-[1000px] mx-auto h-[350px] sm:h-[450px] mb-8 sm:mb-12 mt-8 z-20">
      <svg
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="80%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <radialGradient id="dot-gradient">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.4)" />
          </radialGradient>
        </defs>

        {/* Global Styles for Animations */}
        <style>
          {`
            @keyframes flow {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            .flow-line {
              stroke-dasharray: 10, 40;
              animation: flow 3s linear infinite;
            }
            .branch-path {
              transition: all 0.5s ease;
            }
          `}
        </style>

        {/* Main Backbone - Greyish */}
        <path 
          d="M 0 200 L 800 200" 
          className="stroke-zinc-200 stroke-2"
        />
        <path 
          d="M 100 200 L 700 200" 
          className="stroke-zinc-200/ stroke-2 flow-line"
          filter="url(#glow)"
        />

        {/* Left Branches (GoRouter, Riverpod, Supabase) */}
        <g className="stroke-zinc-200 stroke-2">
          {/* GoRouter (Horizontal backbone) */}
          <path d="M 0 200 L 100 200" />
          
          {/* Riverpod */}
          <path 
            d="M 320 200 C 260 200, 240 100, 180 100" 
            className="branch-path"
          />
          {/* Supabase */}
          <path 
            d="M 320 200 C 260 200, 240 280, 180 280"
            className="branch-path" 
          />
        </g>

        {/* Right Branches (Bloc, Firebase, Dio) */}
        <g className="stroke-zinc-200 stroke-2">
          {/* Bloc (Horizontal backbone) */}
          <path d="M 700 200 L 800 200" />

          {/* Firebase */}
          <path 
            d="M 480 200 C 540 200, 560 120, 620 120"
            className="branch-path"
          />
          {/* Dio */}
          <path 
            d="M 480 200 C 540 200, 560 280, 610 280"
            className="branch-path" 
          />
        </g>

        {/* Brand Dots */}
        {[
          { cx: 180, cy: 100 }, // Riverpod
          { cx: 180, cy: 280 }, // Supabase
          { cx: 620, cy: 120 }, // Firebase
          { cx: 610, cy: 280 }, // Dio
          { cx: 0, cy: 200 },   // GoRouter
          { cx: 800, cy: 200 }  // Bloc
        ].map((dot, i) => (
          <circle 
            key={i}
            cx={dot.cx} 
            cy={dot.cy} 
            r="4" 
            className="fill-primary"
            filter="url(#glow)"
          />
        ))}
      </svg>

      {/* Center Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="relative">
          {/* Multi-layered glow */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-125" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-linear-to-tr from-primary via-primary/90 to-primary/80 rounded-[2rem] sm:rounded-[3rem] shadow-[0_25px_50px_-12px_hsl(var(--primary)/0.5)] flex items-center justify-center transform hover:scale-105 transition-all duration-500 border border-white/30 group overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
            
            <div className="relative animate-float">
              <HugeiconsIcon icon={Folder01Icon} size={48} color='#ffffff' className="sm:size-[56px] drop-shadow-lg" />
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <NodeSwitch
        stateKey="goRouter"
        top="50%" left="0%"
        bgClass="bg-linear-to-tr from-rose-500 to-pink-400 shadow-rose-500/25"
        Icon={Route}
        label="GoRouter"
      />
      <NodeSwitch
        stateKey="riverpod"
        top="25%" left="22.5%"
        bgClass="bg-linear-to-tr from-blue-600 to-blue-400 shadow-blue-500/25"
        Icon={LayoutDashboard}
        label="Riverpod"
      />
      <NodeSwitch
        stateKey="supabase"
        top="70%" left="22.5%"
        bgClass="bg-linear-to-tr from-emerald-500 to-green-400 shadow-emerald-500/25"
        Icon={Database}
        label="Supabase"
      />
      <NodeSwitch
        stateKey="firebase"
        top="30%" left="77.5%"
        bgClass="bg-linear-to-tr from-orange-500 to-amber-400 shadow-orange-500/25"
        Icon={Flame}
        label="Firebase"
      />
      <NodeSwitch
        stateKey="bloc"
        top="50%" left="100%"
        bgClass="bg-linear-to-tr from-indigo-500 to-purple-400 shadow-indigo-500/25"
        Icon={Package}
        label="Bloc"
      />
      <NodeSwitch
        stateKey="dio"
        top="70%" left="76.25%"
        bgClass="bg-linear-to-tr from-cyan-500 to-sky-400 shadow-cyan-500/25"
        Icon={Globe}
        label="Dio"
      />

    </div>
  );
}
