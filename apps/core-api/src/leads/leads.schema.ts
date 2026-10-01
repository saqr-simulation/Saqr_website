import { z } from 'zod';

const text = z.string().trim().min(1).max(200);
const common = {
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  name: text,
  consent: z.literal(true),
  website: z.string().max(0).optional(),
};
const phone = z
  .string()
  .trim()
  .regex(/^\+?[\d\s().-]{7,25}$/)
  .refine((value) => {
    const digits = value.replace(/\D/g, '').length;
    return digits >= 7 && digits <= 15;
  });
export const leadSchema = z.discriminatedUnion('kind', [
  z
    .object({
      ...common,
      kind: z.literal('waitlist'),
      phone,
      referral: z.uuid().optional(),
      signupToken: z.uuid(),
      profile: z
        .object({
          city: text,
          interests: z
            .array(
              z.enum(['spraying', 'mapping', 'inspection', 'certification']),
            )
            .min(1)
            .max(4),
          status: z.enum(['student', 'operator', 'enthusiast', 'career']),
          os: z.enum(['windows64', 'windows-other', 'macos', 'linux']),
          hardware: z.enum(['office', 'midrange', 'gaming']),
          controller: z.enum(['keyboard', 'gamepad', 'transmitter']),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...common,
      kind: z.literal('cup'),
      phone,
      profile: z
        .object({
          city: text,
          affiliation: z.string().trim().max(200),
          setup: z
            .array(z.enum(['laptop', 'desktop', 'gamepad', 'transmitter']))
            .min(1)
            .max(4),
          experience: z.enum(['beginner', 'enthusiast', 'student', 'pilot']),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...common,
      kind: z.literal('demo'),
      profile: z
        .object({
          role: z.string().trim().max(200),
          institution: text,
          institutionType: z.enum([
            'vocational',
            'university',
            'enterprise',
            'academy',
          ]),
          trainees: z.enum(['1-25', '25-100', '100-500', '500+']),
          infrastructure: z.enum(['drones', 'lab', 'new']),
          message: z.string().trim().max(2000),
        })
        .strict(),
    })
    .strict(),
]);
export type LeadInput = z.infer<typeof leadSchema>;
