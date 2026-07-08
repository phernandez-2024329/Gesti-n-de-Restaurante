'use strict';

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import ms from 'ms';
import RefreshToken from '../src/models/refreshToken.model.js';

export function generateRawToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function saveRefreshToken(userId, familyId = uuidv4()) {
  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  const expiresInMs = ms(process.env.REFRESH_TOKEN_EXPIRES_IN || '30d');
  const expiresAt = new Date(Date.now() + expiresInMs);

  await RefreshToken.create({ tokenHash, userId, familyId, expiresAt });

  return { raw, familyId };
}
