'use client';
import { usePathname } from 'next/navigation';
const sections = [
  { label: 'Overview', items: [['◫', 'Overview', '/dashboard']] },
  {
    label: 'Training',
    items: [
      ['▤', 'Courses', '/courses'],
      ['◎', 'Assessments', '/assessments'],
    ],
  },
  {
    label: 'Pilot',
    items: [
      ['↗', 'Pilot Profile', '/pilot-profile'],
      ['◇', 'Certificates', '/certificates'],
    ],
  },
  { label: 'Intelligence', items: [['✧', 'SAQR AI', '/ai']] },
  { label: 'Account', items: [['⚙', 'Settings', '/settings']] },
];
export function PlatformNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Platform navigation">
      {sections.map((section) => (
        <div key={section.label} className="contents">
          <p className="sidebar-label">{section.label}</p>
          {section.items.map(([icon, label, href]) => (
            <a
              className="sidebar-link"
              key={href}
              href={href}
              aria-current={
                pathname === href ||
                (href === '/courses' && pathname.startsWith('/courses/'))
                  ? 'page'
                  : undefined
              }
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}
