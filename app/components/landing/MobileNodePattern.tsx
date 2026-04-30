"use client";

import { Switch } from '@/components/ui/switch';
import {
  Database01Icon,
  FireIcon,
  Folder01Icon,
  Unlink01Icon,
  Package01Icon,
  Route01Icon,
  WaveIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import Image from "next/image";

export function MobileNodePattern() {
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
        <div className={`flex items-center p-2 pr-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-xl
          ${active
            ? 'bg-white border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-primary/5'
            : 'bg-white/70 hover:bg-white/95 border-white/40 shadow-zinc-200/20'}
        `}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border ${active ? bgClass + ' border-white/20 shadow-sm' : 'bg-zinc-100 border-zinc-200'}`}>
            {label === 'Supabase' ? <Image
              src="/icons/supabase.svg"
              alt="Supabase"
              width={24}
              height={24}
            /> : label === 'Firebase' ? <Image
              src="/icons/firebase.svg"
              alt="Firebase"
              width={24}
              height={24}
            /> : <HugeiconsIcon icon={Icon} size={20} className={`transition-colors duration-300 ${active ? 'text-white' : 'text-zinc-400'}`} />}
          </div>

          <span className={`text-[13px] font-bold ml-3 mr-4 transition-colors duration-300 ${active ? 'text-zinc-800' : 'text-zinc-500'}`}>
            {label}
          </span>

          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              size='sm'
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
    <div className="relative w-full max-w-[400px] mx-auto h-[650px] mb-12 mt-8 z-20">
      <svg
        viewBox="0 0 400 650"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
      >
        <defs>
          <filter id="glow-mob">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>
          {`
            @keyframes flow-mob {
              from { stroke-dashoffset: 100; }
              to { stroke-dashoffset: 0; }
            }
            .flow-line-mob {
              stroke-dasharray: 10, 30;
              animation: flow-mob 3s linear infinite;
            }
          `}
        </style>

        {/* Vertical Backbone */}
        <path
          d="M 200 200 L 200 450"
          className="stroke-zinc-200 stroke-2"
        />
        <path
          d="M 200 200 L 200 450"
          className="stroke-zinc-200/50 stroke-2 flow-line-mob"
          filter="url(#glow-mob)"
        />

        {/* Top Branches (Riverpod, Supabase) connecting to Center (y=325) */}
        <g className="stroke-zinc-200 stroke-2">
          {/* Riverpod (Top Left) */}
          <path d="M 100 100 C 100 180, 200 180, 200 325" />
          {/* Supabase (Top Right) */}
          <path d="M 300 100 C 300 180, 200 180, 200 325" />
        </g>

        {/* Bottom Branches (Firebase, Dio) connecting from Center (y=325) */}
        <g className="stroke-zinc-200 stroke-2">
          {/* Firebase (Bottom Left) */}
          <path d="M 200 325 C 200 450, 100 450, 100 550" />
          {/* Dio (Bottom Right) */}
          <path d="M 200 325 C 200 450, 300 450, 300 550" />
        </g>

        {/* Brand Dots at Node positions */}
        {[
          { cx: 100, cy: 100 }, // Riverpod
          { cx: 300, cy: 100 }, // Supabase
          { cx: 200, cy: 200 }, // GoRouter
          { cx: 100, cy: 550 }, // Firebase
          { cx: 300, cy: 550 }, // Dio
          { cx: 200, cy: 450 }  // Bloc
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="4"
            className="fill-primary"
            filter="url(#glow-mob)"
          />
        ))}
      </svg>

      {/* Center Node */}
      <div className="absolute top-[325px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-20 h-20 bg-linear-to-tr from-primary via-primary/90 to-primary/80 rounded-[1.75rem] shadow-[0_20px_40px_-10px_hsl(var(--primary)/0.5)] flex items-center justify-center transform hover:scale-105 transition-all duration-500 border border-white/30 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
            <div className="relative animate-float">
              <HugeiconsIcon icon={Folder01Icon} size={40} color='#ffffff' className="drop-shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Top Nodes */}
      <NodeSwitch
        stateKey="riverpod"
        top="100px" left="80px"
        bgClass="bg-linear-to-tr from-blue-600 to-blue-400 shadow-blue-500/25"
        Icon={WaveIcon}
        label="Riverpod"
      />
      <NodeSwitch
        stateKey="supabase"
        top="100px" left="270px"
        bgClass="bg-linear-to-tr from-emerald-500 to-green-400 shadow-emerald-500/25"
        Icon={Database01Icon}
        label="Supabase"
      />
      <NodeSwitch
        stateKey="goRouter"
        top="200px" left="170px"
        bgClass="bg-linear-to-tr from-rose-500 to-pink-400 shadow-rose-500/25"
        Icon={Route01Icon}
        label="GoRouter"
      />

      {/* Bottom Nodes */}
      <NodeSwitch
        stateKey="bloc"
        top="450px" left="170px"
        bgClass="bg-linear-to-tr from-indigo-500 to-purple-400 shadow-indigo-500/25"
        Icon={Package01Icon}
        label="Bloc"
      />
      <NodeSwitch
        stateKey="firebase"
        top="550px" left="85px"
        bgClass="bg-linear-to-tr from-orange-500 to-amber-400 shadow-orange-500/25"
        Icon={FireIcon}
        label="Firebase"
      />
      <NodeSwitch
        stateKey="dio"
        top="550px" left="280px"
        bgClass="bg-linear-to-tr from-cyan-500 to-sky-400 shadow-cyan-500/25"
        Icon={Unlink01Icon}
        label="Dio"
      />
    </div>
  );
}
