// Vercel serverless function entry point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../dist/index.js';

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req as any, res as any);
}

