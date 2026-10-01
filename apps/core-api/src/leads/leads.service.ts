import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { leadSchema } from './leads.schema';

@Injectable()
export class LeadsService {
  constructor(@Inject(PrismaService) private readonly db: PrismaService) {}

  async submit(body: unknown) {
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success)
      throw new BadRequestException(
        'Please check the required fields and your consent.',
      );
    const input = parsed.data;
    const referral = input.kind === 'waitlist' ? input.referral : undefined;
    // Invalid or self-referral codes never block a legitimate registration.
    const referrer = referral
      ? await this.db.websiteLead.findUnique({
          where: { referralCode: referral },
        })
      : null;
    const referredBy =
      referrer?.kind === 'waitlist' && referrer.email !== input.email
        ? referral
        : undefined;
    // Idempotent registrations preserve the original signup position and profile.
    const lead = await this.db.websiteLead.upsert({
      where: { kind_email: { kind: input.kind, email: input.email } },
      update: {},
      create: {
        kind: input.kind,
        email: input.email,
        name: input.name,
        phone: 'phone' in input ? input.phone : null,
        profile: input.profile,
        referredBy,
        ...(input.kind === 'waitlist'
          ? { referralCode: input.signupToken }
          : {}),
      },
    });
    // Never disclose existing profile data or referral identifiers to an unauthenticated caller.
    if (input.kind === 'waitlist' && input.signupToken === lead.referralCode) {
      const position = await this.db.websiteLead.count({
        where: { kind: 'waitlist', id: { lte: lead.id } },
      });
      return {
        accepted: true,
        kind: input.kind,
        referralCode: lead.referralCode,
        position,
      };
    }
    return { accepted: true, kind: input.kind };
  }
}
