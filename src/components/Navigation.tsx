'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/stock', label: 'Stock (Admin)' },
  { href: '/shop', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
  { href: '/transactions', label: 'Transactions' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav style={{
      padding: '14px 20px',
      border: '1px solid var(--border)',
      borderTop: 'none',
      borderRadius: '0 0 14px 14px',
      marginBottom: '20px',
      display: 'flex',
      gap: '20px',
      backgroundColor: 'color-mix(in srgb, var(--surface) 88%, white 12%)',
      backdropFilter: 'blur(4px)'
    }}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            textDecoration: 'none',
            color: pathname === item.href ? 'var(--primary-strong)' : 'var(--foreground)',
            fontWeight: pathname === item.href ? 'bold' : 'normal',
            padding: '6px 11px',
            borderRadius: '10px',
            backgroundColor: pathname === item.href ? 'var(--surface-soft)' : 'transparent'
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
