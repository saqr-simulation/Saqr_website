import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BadRequestException } from '@nestjs/common';
import type { PrismaService } from '../database/prisma.service';
import { leadSchema } from './leads.schema';
import { LeadsService } from './leads.service';

const token = 'c4d5e6f7-0000-4000-8000-000000000001';
const input = {
  kind: 'waitlist',
  name: 'Test Pilot',
  email: 'pilot@example.test',
  phone: '+212600000000',
  consent: true,
  signupToken: token,
  profile: {
    city: 'Casablanca',
    interests: ['mapping'],
    status: 'student',
    os: 'windows64',
    hardware: 'office',
    controller: 'keyboard',
  },
};

test('lead validation normalizes email and rejects incomplete hardware, unknown properties and missing consent', () => {
  const result = leadSchema.parse({ ...input, email: ' Pilot@Example.Test ' });
  assert.equal(result.email, 'pilot@example.test');
  assert.equal(
    leadSchema.safeParse({ ...input, consent: false }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      ...input,
      profile: { ...input.profile, controller: undefined },
    }).success,
    false,
  );
  assert.equal(leadSchema.safeParse({ ...input, admin: true }).success, false);
  assert.equal(
    leadSchema.safeParse({ ...input, website: 'spam.example' }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, phone: '        ' }).success,
    false,
  );
});

test('demo accepts optional empty role and message, tournament requires setup selection', () => {
  assert.equal(
    leadSchema.safeParse({
      kind: 'demo',
      name: 'Test',
      email: 'lab@example.test',
      consent: true,
      profile: {
        role: '',
        institution: 'Test Lab',
        institutionType: 'university',
        trainees: '1-25',
        infrastructure: 'lab',
        message: '',
      },
    }).success,
    true,
  );
  assert.equal(
    leadSchema.safeParse({
      kind: 'cup',
      name: 'Test',
      email: 'pilot@example.test',
      phone: '+212600000000',
      consent: true,
      profile: {
        city: 'Casablanca',
        affiliation: '',
        experience: 'beginner',
        setup: [],
      },
    }).success,
    false,
  );
});

test('confirmed waitlist save returns referral and actual signup position without exposing profile', async () => {
  let createData: unknown;
  const service = new LeadsService({
    websiteLead: {
      upsert: async (args: { create: unknown; update: unknown }) => {
        createData = args.create;
        assert.deepEqual(args.update, {});
        return { id: 8, referralCode: token };
      },
      count: async (args: unknown) => {
        assert.deepEqual(args, { where: { kind: 'waitlist', id: { lte: 8 } } });
        return 3;
      },
    },
  } as unknown as PrismaService);
  const result = await service.submit(input);
  assert.deepEqual(result, {
    accepted: true,
    kind: 'waitlist',
    referralCode: token,
    position: 3,
  });
  assert.equal((createData as { referralCode: string }).referralCode, token);
});

test('duplicate email with a different signup token never exposes existing referral code, position or identity', async () => {
  const service = new LeadsService({
    websiteLead: {
      upsert: async () => ({
        id: 8,
        referralCode: 'existing-secret-code',
        name: 'Existing Pilot',
      }),
      count: async () => {
        throw new Error('Should not query position');
      },
    },
  } as unknown as PrismaService);
  assert.deepEqual(await service.submit(input), {
    accepted: true,
    kind: 'waitlist',
  });
});

test('invalid submissions and database failures cannot return success', async () => {
  const service = new LeadsService({
    websiteLead: {
      upsert: async () => {
        throw new Error('Database unavailable');
      },
    },
  } as unknown as PrismaService);
  await assert.rejects(
    () => service.submit({ ...input, consent: false }),
    BadRequestException,
  );
  await assert.rejects(() => service.submit(input), /Database unavailable/);
});

test('self-referrals and non-waitlist referral codes are discarded', async () => {
  for (const referrer of [
    { kind: 'waitlist', email: input.email },
    { kind: 'cup', email: 'other@example.test' },
  ]) {
    const service = new LeadsService({
      websiteLead: {
        findUnique: async () => referrer,
        upsert: async (args: { create: { referredBy?: string } }) => {
          assert.equal(args.create.referredBy, undefined);
          return { id: 1, referralCode: token };
        },
        count: async () => 1,
      },
    } as unknown as PrismaService);
    await service.submit({
      ...input,
      referral: 'c4d5e6f7-0000-4000-8000-000000000002',
    });
  }
});
