'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

type Kind = 'waitlist' | 'cup' | 'demo';
type Field = {
  name: string;
  label: string;
  type?: 'email' | 'tel' | 'select' | 'checkboxes' | 'textarea';
  options?: [string, string][];
  optional?: boolean;
  hint?: string;
};
const regions: [string, string][] = [
  'Casablanca-Settat',
  'Rabat-Salé-Kénitra',
  'Souss-Massa',
  'Fès-Meknès',
  'Marrakech-Safi',
  'Oriental',
  'Other',
].map((region) => [region, region]);
const identity: Field[] = [
  { name: 'name', label: 'Full name' },
  { name: 'email', label: 'Email address', type: 'email' },
  {
    name: 'phone',
    label: 'WhatsApp phone number',
    type: 'tel',
    hint: 'Include your country code, for example +212.',
  },
  { name: 'city', label: 'City / region' },
];
const steps: Record<Kind, { title: string; fields: Field[] }[]> = {
  waitlist: [
    { title: 'Meet your future flight crew.', fields: identity },
    {
      title: 'Where do you want to go?',
      fields: [
        {
          name: 'interests',
          label: 'Areas of interest',
          type: 'checkboxes',
          options: [
            ['spraying', 'Agricultural spraying & crop protection'],
            ['mapping', 'Land surveying & multispectral mapping'],
            ['inspection', 'Industrial inspection & energy'],
            ['certification', 'Commercial certification preparation'],
          ],
        },
        {
          name: 'status',
          label: 'Your current journey',
          type: 'select',
          options: [
            ['student', 'Agronomy / engineering student'],
            ['operator', 'Farmer / agricultural operator'],
            ['enthusiast', 'Drone enthusiast / FPV pilot'],
            ['career', 'Exploring a new career'],
          ],
        },
      ],
    },
    {
      title: 'Tell us about your setup.',
      fields: [
        {
          name: 'os',
          label: 'Operating system',
          type: 'select',
          options: [
            ['windows64', 'Windows 10 / 11 (64-bit)'],
            ['windows-other', 'Older / 32-bit Windows'],
            ['macos', 'macOS (Apple Silicon / Intel)'],
            ['linux', 'Linux'],
          ],
        },
        {
          name: 'hardware',
          label: 'Computer hardware',
          type: 'select',
          options: [
            ['office', 'Office laptop / integrated graphics'],
            ['midrange', 'Mid-range PC / GTX 1050–1650 or similar'],
            ['gaming', 'Gaming PC / RTX 2060 or higher'],
          ],
        },
        {
          name: 'controller',
          label: 'Available controller',
          type: 'select',
          options: [
            ['keyboard', 'Keyboard (AZERTY / QWERTY)'],
            ['gamepad', 'USB gamepad (PlayStation, Xbox, Logitech)'],
            ['transmitter', 'Drone RC transmitter (Radiomaster, FrSky)'],
          ],
        },
      ],
    },
  ],
  cup: [
    {
      title: 'Your place on the starting line.',
      fields: [
        ...identity.slice(0, 3),
        {
          name: 'city',
          label: 'City / region',
          type: 'select',
          options: regions,
        },
        {
          name: 'affiliation',
          label: 'School, university or organization',
          optional: true,
        },
        {
          name: 'setup',
          label: 'Available flight setup',
          type: 'checkboxes',
          options: [
            ['laptop', 'Standard laptop'],
            ['desktop', 'Desktop PC'],
            ['gamepad', 'USB gamepad'],
            ['transmitter', 'Drone RC transmitter'],
          ],
        },
        {
          name: 'experience',
          label: 'Experience level',
          type: 'select',
          options: [
            ['beginner', 'Complete beginner'],
            ['enthusiast', 'Gamer / drone enthusiast'],
            ['student', 'Agricultural student'],
            ['pilot', 'Certified pilot'],
          ],
        },
      ],
    },
  ],
  demo: [
    {
      title: 'Let’s understand your training needs.',
      fields: [
        { name: 'email', label: 'Work email address', type: 'email' },
        { name: 'name', label: 'Contact person' },
        { name: 'role', label: 'Job title / academic role', optional: true },
        { name: 'institution', label: 'Institution / organization' },
        {
          name: 'institutionType',
          label: 'Institution type',
          type: 'select',
          options: [
            ['vocational', 'Vocational institute (CMC, OFPPT, ITSA)'],
            ['university', 'University / higher education'],
            ['enterprise', 'Agricultural enterprise / operator'],
            ['academy', 'Private drone academy'],
          ],
        },
        {
          name: 'trainees',
          label: 'Estimated trainees per year',
          type: 'select',
          options: [
            ['1-25', '1–25'],
            ['25-100', '25–100'],
            ['100-500', '100–500'],
            ['500+', '500+'],
          ],
        },
        {
          name: 'infrastructure',
          label: 'Current training infrastructure',
          type: 'select',
          options: [
            ['drones', 'Training with real drones'],
            ['lab', 'Computer lab seeking simulation software'],
            ['new', 'Starting a new training program'],
          ],
        },
        {
          name: 'message',
          label: 'Your objectives',
          type: 'textarea',
          optional: true,
          hint: 'Tell us what you would like to explore in a demonstration.',
        },
      ],
    },
  ],
};
const submitLabels = {
  waitlist: 'Join the early access waitlist ↗',
  cup: 'Pre-register for the SAQR Cup ↗',
  demo: 'Request an institutional demo ↗',
};

export function LeadForm({ kind }: { kind: Kind }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<{
    referralCode?: string;
    position?: number;
  } | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const signupToken = useRef('');
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLParagraphElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const current = steps[kind][step]!;
  const last = step === steps[kind].length - 1;
  function change(name: string, value: string | string[]) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setError('');
  }
  function go(next: number) {
    setStep(next);
    setError('');
    requestAnimationFrame(() => heading.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!last) {
      go(step + 1);
      return;
    }
    setBusy(true);
    setError('');
    const { name, email, phone, website, ...profile } = values;
    // Optional fields are sent explicitly, keeping the request shape predictable.
    if (kind === 'cup') profile.affiliation ||= '';
    if (kind === 'demo') {
      profile.role ||= '';
      profile.message ||= '';
    }
    if (!signupToken.current) signupToken.current = crypto.randomUUID();
    const referral = new URLSearchParams(window.location.search).get('ref');
    try {
      const response = await fetch('/api/website-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name,
          email,
          ...(kind !== 'demo' ? { phone } : {}),
          profile,
          consent,
          website: website || '',
          ...(kind === 'waitlist'
            ? {
                signupToken: signupToken.current,
                ...(referral && /^[a-f\d-]{36}$/i.test(referral)
                  ? { referral }
                  : {}),
              }
            : {}),
        }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true)
        throw new Error(
          result.message ||
            'Your submission could not be confirmed. Please try again.',
        );
      setSaved(result);
      if (kind === 'waitlist') {
        const url = new URL('/waitlist', window.location.origin);
        if (result.referralCode)
          url.searchParams.set('ref', result.referralCode);
        setShareUrl(url.toString());
      }
      requestAnimationFrame(() => heading.current?.focus());
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== 'TimeoutError'
          ? cause.message
          : 'Your submission could not be confirmed. Please try again.',
      );
      requestAnimationFrame(() => errorBox.current?.focus());
    } finally {
      setBusy(false);
    }
  }

  if (saved)
    return (
      <section className="card lead-form confirmation" aria-live="polite">
        <p className="eyebrow">SUBMISSION RECEIVED</p>
        <h2 ref={heading} tabIndex={-1}>
          {kind === 'demo'
            ? 'Let’s build your next training chapter.'
            : 'Your next horizon is getting closer.'}
        </h2>
        <p className="muted">
          {kind === 'waitlist'
            ? 'Your early access interest has been recorded. We’ll contact you as access becomes available.'
            : kind === 'cup'
              ? 'Your tournament interest has been recorded. We’ll share confirmed rules, eligibility and dates when they are ready.'
              : 'Your demo request has been recorded. The team will follow up about your objectives and evaluation options.'}
        </p>
        {kind === 'waitlist' && (
          <>
            {saved.position && (
              <p className="signup-position">
                Signup position <strong>#{saved.position}</strong>
              </p>
            )}
            <h3>Bring your flight crew.</h3>
            <p className="muted">
              Share early access with fellow students and colleagues.
            </p>
            <label htmlFor="referral-link">
              {saved.referralCode ? 'Your referral link' : 'Share the waitlist'}
            </label>
            <div className="share-link">
              <input
                id="referral-link"
                className="input"
                readOnly
                value={shareUrl}
                onFocus={(event) => event.target.select()}
              />
              <button
                type="button"
                className="button button-secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                  } catch {
                    setError('Select the link and copy it manually.');
                  }
                }}
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <div className="hero-actions">
              <a
                className="text-link"
                href={`https://wa.me/?text=${encodeURIComponent('Explore SAQR drone training: ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share via WhatsApp ↗
              </a>
              <a
                className="text-link"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share via LinkedIn ↗
              </a>
            </div>
          </>
        )}
        {error && <p role="status">{error}</p>}
        <a className="text-link" href="/training">
          Explore the training approach →
        </a>
      </section>
    );

  return (
    <form
      ref={form}
      className="card lead-form"
      onSubmit={submit}
      aria-busy={busy}
    >
      {steps[kind].length > 1 && (
        <ol className="form-steps" aria-label="Waitlist registration steps">
          {['Your details', 'Your goals', 'Your setup'].map((label, index) => (
            <li
              key={label}
              aria-current={step === index ? 'step' : undefined}
              className={index <= step ? 'reached' : ''}
            >
              <span>0{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      )}
      <p className="eyebrow">
        {kind === 'waitlist'
          ? `STEP ${step + 1} OF 3`
          : kind === 'cup'
            ? 'TOURNAMENT PRE-REGISTRATION'
            : 'INSTITUTIONAL DISCOVERY'}
      </p>
      <h2 ref={heading} tabIndex={-1} className="form-title">
        {current.title}
      </h2>
      <p className="form-required muted">
        All fields are required unless marked optional.
      </p>
      <fieldset disabled={busy} className="form-fields">
        <legend className="sr-only">{current.title}</legend>
        {current.fields.map((field) => {
          const id = `${kind}-${field.name}`;
          const value = values[field.name] || '';
          if (field.type === 'checkboxes') {
            const selected = Array.isArray(value) ? value : [];
            return (
              <fieldset className="choice-field" key={id}>
                <legend>{field.label}</legend>
                {field.options!.map(([option, label], index) => (
                  <label key={option} className="choice-option">
                    <input
                      type="checkbox"
                      name={field.name}
                      value={option}
                      checked={selected.includes(option)}
                      required={index === 0 && !selected.length}
                      onChange={(event) =>
                        change(
                          field.name,
                          event.target.checked
                            ? [...selected, option]
                            : selected.filter((item) => item !== option),
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
            );
          }
          const shared = {
            id,
            name: field.name,
            required: !field.optional,
            value: String(value),
            'aria-describedby': field.hint ? `${id}-hint` : undefined,
            onChange: (
              event: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >,
            ) => change(field.name, event.target.value),
            className: 'input',
          };
          return (
            <div className="form-field" key={id}>
              <label htmlFor={id}>
                {field.label}
                {field.optional ? ' (optional)' : ''}
              </label>
              {field.type === 'select' ? (
                <select {...shared}>
                  <option value="">Select an option</option>
                  {field.options!.map(([option, label]) => (
                    <option key={option} value={option}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea {...shared} rows={4} maxLength={2000} />
              ) : (
                <input
                  {...shared}
                  type={field.type || 'text'}
                  maxLength={
                    field.type === 'email'
                      ? 254
                      : field.type === 'tel'
                        ? 25
                        : 200
                  }
                  autoComplete={
                    field.name === 'name'
                      ? 'name'
                      : field.name === 'email'
                        ? 'email'
                        : field.name === 'phone'
                          ? 'tel'
                          : field.name === 'institution'
                            ? 'organization'
                            : undefined
                  }
                  pattern={
                    field.type === 'tel'
                      ? '\\+?[0-9\\s().\\-]{7,25}'
                      : undefined
                  }
                />
              )}
              {field.hint && <small id={`${id}-hint`}>{field.hint}</small>}
            </div>
          );
        })}
        <div className="form-trap" aria-hidden="true">
          <label htmlFor={`${kind}-website`}>Leave this field empty</label>
          <input
            id={`${kind}-website`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={String(values.website || '')}
            onChange={(event) => change('website', event.target.value)}
          />
        </div>
        {last && (
          <label className="consent-option">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              I agree that SAQR may use these details to respond to my{' '}
              {kind === 'demo'
                ? 'demo request'
                : kind === 'cup'
                  ? 'tournament interest and send related updates'
                  : 'early access interest and send related updates'}
              .{' '}
              {kind === 'waitlist' &&
                'Setup details help plan compatibility; this does not confirm device support.'}
            </span>
          </label>
        )}
      </fieldset>
      {error && (
        <p ref={errorBox} tabIndex={-1} className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        {step > 0 && (
          <button
            className="button button-secondary"
            type="button"
            disabled={busy}
            onClick={() => go(step - 1)}
          >
            ← Back
          </button>
        )}
        <button className="button" type="submit" disabled={busy}>
          {busy
            ? 'Saving your request…'
            : last
              ? submitLabels[kind]
              : 'Continue →'}
        </button>
      </div>
      <p className="legal-note">
        {kind === 'cup'
          ? 'Pre-registration expresses interest. Participation, prizes and eligibility remain subject to the official rules.'
          : kind === 'demo'
            ? 'A request does not reserve a time slot. We’ll arrange a session once availability is confirmed.'
            : 'Joining the waitlist does not guarantee a release date, competition entry or certification.'}{' '}
        You can request removal through our{' '}
        <a href="/contact" className="text-link">
          contact page
        </a>
        .
      </p>
    </form>
  );
}
