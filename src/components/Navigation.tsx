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
      padding: '15px 20px',
      borderBottom: '1px solid #ccc',
      marginBottom: '20px',
      display: 'flex',
      gap: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            textDecoration: 'none',
            color: pathname === item.href ? '#0066cc' : '#333',
            fontWeight: pathname === item.href ? 'bold' : 'normal',
            padding: '5px 10px',
            borderRadius: '4px',
            backgroundColor: pathname === item.href ? '#e6f0ff' : 'transparent'
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
