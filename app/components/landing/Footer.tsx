"use client"
import { 
  CheckmarkCircle01Icon, 
  FavouriteIcon, 
  GithubIcon, 
  Linkedin01Icon, 
  Mail01Icon, 
  NewTwitterIcon 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = "arjunmahar615@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy email");
    }
  };

  return (
    <footer className="w-full bg-white border-t border-zinc-200 pt-12 pb-8 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-linear-to-t from-zinc-50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex gap-12 mb-10 items-center justify-between">
          {/* Brand Section */}
          <Link href="/" className="inline-block">
            <Image
              src="/logo.svg"
              alt="Flutter Init Logo"
              width={32}
              height={32}
              className="h-12 w-12"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/Arjun544/flutter_init"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Flutter Init on GitHub"
              className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <HugeiconsIcon icon={GithubIcon} size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/arjun-mahar-6067951b8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Arjun on LinkedIn"
              className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <HugeiconsIcon icon={Linkedin01Icon} size={20} />
            </Link>
            <Link
              href="https://x.com/arjun_mahar1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Arjun on X (Twitter)"
              className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >
              <HugeiconsIcon icon={NewTwitterIcon} size={20} />
            </Link>
            <button
              onClick={handleCopyEmail}
              aria-label="Copy contact email"
              className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-pointer relative group"
              title="Copy email"
            >
              {copied ? (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} className="text-emerald-500" />
              ) : (
                <HugeiconsIcon icon={Mail01Icon} size={20} />
              )}
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
            <span>© {currentYear} FlutterInit.</span>
            <span className="hidden md:inline">Built with</span>
            <HugeiconsIcon icon={FavouriteIcon} size={16} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <Link
              href="https://github.com/Arjun544"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 font-bold hover:text-primary transition-colors decoration-primary underline-offset-4 hover:underline"
            >
              Arjun Mahar
            </Link>
          </div>


          <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Fully Open Source
          </div>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[100px] bg-primary/5 blur-[100px] pointer-events-none" />
    </footer>
  );
}
