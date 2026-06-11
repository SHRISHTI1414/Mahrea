import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { CATEGORIES } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-[#6b1040] text-white/80">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image src="/images/logo.png" alt="Mahrea" width={80} height={80} className="h-16 w-16 object-contain mb-4" />
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Anti-tarnish fine jewellery designed for the everyday you, inspired by our roots.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-[#c5962a] transition-colors"><Instagram size={18} /></a>
              <a href="https://facebook.com"  target="_blank" rel="noreferrer" className="text-white/60 hover:text-[#c5962a] transition-colors"><Facebook  size={18} /></a>
              <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="text-white/60 hover:text-[#c5962a] transition-colors"><Youtube   size={18} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#c5962a]">Shop</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#c5962a]">Help</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {['Shipping & Delivery', 'Returns & Exchange', 'Track Order', 'Size Guide', 'Contact Us'].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#c5962a]">Company</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {['About Mahrea', 'Our Story', 'Blog', 'Privacy Policy', 'Terms & Conditions'].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Mahrea. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
