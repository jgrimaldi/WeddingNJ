import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import {
  isAzureConfigured,
  readMetadata as readAzureMetadata,
  type PhotoMeta,
} from '@/lib/azure-storage';

const METADATA_FILE = path.join(process.cwd(), 'uploads', 'photos.json');
const DEFAULT_PAGE_SIZE = 20;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const limit = Math.min(
    Math.max(parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE, 1),
    100
  );
  const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

  try {
    let photos: PhotoMeta[] = [];

    if (isAzureConfigured()) {
      photos = await readAzureMetadata();
    } else if (fs.existsSync(METADATA_FILE)) {
      photos = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
    }

    // Sort newest first
    photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    const total = photos.length;
    const paged = photos.slice(offset, offset + limit);

    return res.status(200).json({ photos: paged, total, offset, limit });
  } catch (error) {
    console.error('Error reading photos metadata:', error);
    return res.status(500).json({ error: 'Failed to load photos' });
  }
}
