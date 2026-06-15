"use client";

import { Switch } from '@/components/ui/switch';
import {
  DashboardSquare01Icon,
  Database01Icon,
  FireIcon,
  Folder01Icon,
  Package01Icon,
  Route01Icon,
  Unlink01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from "next/image";
import { motion } from 'motion/react';
import { useState } from 'react';

interface NodeSwitchProps {
  active: boolean;
  onToggle: () => void;
  top: string;
  left: string;
  bgClass: string;
  Icon: any;
  label: string;
}

const NodeSwitch = ({
  active,
  onToggle,
  top,
  left,
  bgClass,
  Icon,
  label
}: NodeSwitchProps) => {
  return (
    <div
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
      style={{ top, left }}
      aria-label={label}
      onClick={onToggle}
    >
      {/* Outer glow ring — visible on hover or when active */}
      <div className={`absolute inset-0 rounded-[1.35rem] sm:rounded-[1.6rem] transition-all duration-500 pointer-events-none
        ${active
          ? 'opacity-100 blur-md scale-110 bg-primary/10'
          : 'opacity-0 group-hover/node:opacity-60 group-hover/node:blur-sm group-hover/node:scale-105 bg-zinc-300/40'}
      `} />

      <div className={`
        relative flex items-center py-2 px-3
        rounded-[1rem] sm:rounded-[1.1rem]
        border backdrop-blur-2xl
        transition-all duration-300 ease-out
        group-hover/node:scale-[1.035] group-hover/node:-translate-y-0.5
        ${active
          ? [
              'bg-white/95',
              'border-zinc-200/80',
              'shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]',
              'ring-1 ring-primary/8',
            ].join(' ')
          : [
              'bg-white/75',
              'border-white/50',
              'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.05)]',
              'hover:bg-white/95 hover:border-zinc-200/70',
              'hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.08)]',
            ].join(' ')}
      `}>
        {/* Icon container */}
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
          {/* Inactive state background & border & shadow */}
          <motion.div
            initial={false}
            animate={{ opacity: active ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-[0.6rem] sm:rounded-[0.65rem] bg-zinc-50 border border-zinc-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
          />
          {/* Active state background & border & shadow */}
          <motion.div
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 rounded-[0.6rem] sm:rounded-[0.65rem] border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.15)] ${bgClass}`}
          />

          {/* Icon wrapper with subtle scale animation */}
          <motion.div
            animate={{
              scale: active ? [1, 1.12, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="relative z-10 flex items-center justify-center"
          >
            {label === 'Supabase' ? (
              <Image src="/icons/supabase.svg" alt="Supabase" width={16} height={16}
                className={`transition-all duration-300 ${active ? 'brightness-0 invert' : 'opacity-70'}`}
              />
            ) : label === 'Firebase' ? (
              <Image src="/icons/firebase.svg" alt="Firebase" width={16} height={16}
                className={`transition-all duration-300 ${active ? '' : 'opacity-70'}`}
              />
            ) : (
              <HugeiconsIcon
                icon={Icon}
                size={15}
                aria-hidden="true"
                className={`transition-all duration-300 ${active ? 'text-white drop-shadow-sm' : 'text-zinc-400 group-hover/node:text-zinc-500'}`}
              />
            )}
          </motion.div>
        </div>

        {/* Label */}
        <span className={`
          text-[11px] sm:text-[12px] font-semibold ml-2 mr-4
          tracking-tight transition-all duration-300 whitespace-nowrap
          ${active ? 'text-zinc-800' : 'text-zinc-400 group-hover/node:text-zinc-600'}
        `}>
          {label}
        </span>

        {/* Switch — stop propagation so click on switch doesn't double-fire */}
        <div onClick={(e) => e.stopPropagation()} className="scale-75 origin-center shrink-0">
          <Switch
            checked={active}
            onCheckedChange={onToggle}
            aria-label={`Toggle ${label}`}
            className={`cursor-pointer transition-all duration-300 ${active ? 'data-[state=checked]:bg-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.15)]' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

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

  return (
    <div className="relative w-full max-w-[1000px] mx-auto h-[260px] sm:h-[340px] mb-6 sm:mb-10 mt-6 z-20">
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

          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-tr from-primary via-primary/90 to-primary/80 rounded-[1.25rem] sm:rounded-[1.75rem] shadow-[0_20px_40px_-8px_hsl(var(--primary)/0.5)] flex items-center justify-center transform hover:scale-105 transition-all duration-500 border border-white/30 group overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />

            <div className="relative animate-float">
              <HugeiconsIcon icon={Folder01Icon} size={32} color='#ffffff' className="sm:size-[38px] drop-shadow-lg" />
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
        active={nodes.goRouter}
        onToggle={() => toggleNode('goRouter')}
        top="50%" left="0%"
        bgClass="bg-linear-to-tr from-rose-500 to-pink-400 shadow-rose-500/25"
        Icon={Route01Icon}
        label="GoRouter"
      />
      <NodeSwitch
        active={nodes.riverpod}
        onToggle={() => toggleNode('riverpod')}
        top="25%" left="22.5%"
        bgClass="bg-linear-to-tr from-blue-600 to-blue-400 shadow-blue-500/25"
        Icon={DashboardSquare01Icon}
        label="Riverpod"
      />
      <NodeSwitch
        active={nodes.supabase}
        onToggle={() => toggleNode('supabase')}
        top="70%" left="22.5%"
        bgClass="bg-linear-to-tr from-emerald-200 to-green-100 shadow-emerald-400/25"
        Icon={Database01Icon}
        label="Supabase"
      />
      <NodeSwitch
        active={nodes.firebase}
        onToggle={() => toggleNode('firebase')}
        top="30%" left="77.5%"
        bgClass="bg-linear-to-tr from-orange-200 to-amber-100 shadow-orange-400/25"
        Icon={FireIcon}
        label="Firebase"
      />
      <NodeSwitch
        active={nodes.bloc}
        onToggle={() => toggleNode('bloc')}
        top="50%" left="100%"
        bgClass="bg-linear-to-tr from-indigo-500 to-purple-400 shadow-indigo-500/25"
        Icon={Package01Icon}
        label="Bloc"
      />
      <NodeSwitch
        active={nodes.dio}
        onToggle={() => toggleNode('dio')}
        top="70%" left="76.25%"
        bgClass="bg-linear-to-tr from-cyan-500 to-sky-400 shadow-cyan-500/25"
        Icon={Unlink01Icon}
        label="Dio"
      />

    </div>
  );
}
