import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { Dialog, Dropdown } from './overlays';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: '',
      secondary: 'button-secondary',
      ghost: 'button-ghost',
    },
  },
  defaultVariants: { variant: 'primary' },
});
export function Button({
  asChild,
  variant,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn('input', props.className)} />;
}
export function FormField({
  id,
  label,
  children,
  hint,
}: {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn('card', className)}>{children}</section>;
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}
export function Progress({
  value,
  label = 'Course completion',
}: {
  value: number;
  label?: string;
}) {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}
export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar" aria-label={name}>
      {name.trim().slice(0, 2).toUpperCase()}
    </span>
  );
}
export function Logo() {
  return (
    <span className="logo">
      <svg
        width="31"
        height="29"
        viewBox="0 0 31 29"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 3h27L16 26l-3-10L2 3Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m3 4 17 7-7 5M20 11l8-7"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      SAQR<span className="logo-dot">.</span>
    </span>
  );
}
export function Navigation({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Main navigation" className="navigation">
      {children}
    </nav>
  );
}
export function Sidebar({ children }: { children: ReactNode }) {
  return <aside className="sidebar">{children}</aside>;
}
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {children}
    </header>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-symbol" aria-hidden="true">
        ↗
      </span>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="empty-state" role="status">
      <span className="loader" />
      <p>Preparing your flight path…</p>
    </div>
  );
}
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="empty-state" role="alert">
      <h2>We couldn’t load this page.</h2>
      <p>Please try again in a moment.</p>
      <Button onClick={retry}>Try again</Button>
    </div>
  );
}
export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <p className="muted text-sm">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="text-sm muted">{detail}</p>
    </Card>
  );
}
export function FieldVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn('field-visual', compact && 'field-compact')}
      role="img"
      aria-label="Illustrated aerial agricultural field with a planned survey route"
    >
      <div className="field-grid" />
      <svg viewBox="0 0 600 420" aria-hidden="true">
        <path
          d="M100 320V100h80v220h80V100h80v220h80V100h80"
          stroke="#c4f58c"
          strokeWidth="2"
          strokeDasharray="7 7"
          fill="none"
        />
        <circle cx="340" cy="188" r="30" fill="#b9ee8420" stroke="#b9ee84" />
        <path
          d="m327 182 26 12m-26 0 26-12m-13-7v27"
          stroke="white"
          strokeWidth="3"
        />
        <circle cx="100" cy="320" r="6" fill="#c4f58c" />
      </svg>
      <span className="map-label">35° 00′ N / FIELD STUDY 01</span>
      <span className="map-status">
        <span /> AGRICULTURE TRACK
      </span>
    </div>
  );
}
export function CourseCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="course-card">
      <FieldVisual compact />
      <div className="course-content">
        <Badge>AGRICULTURE · DEMO CURRICULUM</Badge>
        <h2>{title}</h2>
        <p className="muted">{description}</p>
        <div className="course-meta">
          <span>5 modules</span>
          <span>20 sample lessons</span>
        </div>
        <Button asChild>
          <a href={href}>
            Explore course <span aria-hidden="true">↗</span>
          </a>
        </Button>
      </div>
    </Card>
  );
}
