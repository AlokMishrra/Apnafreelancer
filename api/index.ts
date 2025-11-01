// Vercel serverless function entry point
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lazy import to handle build properly
let handler: any = null;

export default async function (req: VercelRequest, res: VercelResponse) {
  if (!handler) {
    const module = await import('../dist/index.js');
    handler = module.default;
  }
  return handler(req as any, res as any);
}

