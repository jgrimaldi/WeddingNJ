import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import {
  isAzureConfigured,
  deleteBlob,
  removeMetadataEntry,
  type PhotoMeta,
} from '@/lib/azure-storage';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const METADATA_FILE = path.join(UPLOADS_DIR, 'photos.json');

function readLocalMetadata(): PhotoMeta[] {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return [];
}

function removeLocalMetadataEntry(filename: string): PhotoMeta | null {
  const existing = readLocalMetadata();
  const index = existing.findIndex((p) => p.filename === filename);
  if (index === -1) return null;
  const [removed] = existing.splice(index, 1);
  fs.writeFileSync(METADATA_FILE, JSON.stringify(existing, null, 2));
  return removed;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { filename } = req.body;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const safeName = path.basename(filename);
  const accessCode = session.user?.accessCode;
  const isAdmin = session.user?.isAdmin === true;

  if (!accessCode) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const useAzure = isAzureConfigured();
    let removed: PhotoMeta | null = null;

    if (useAzure) {
      // Read metadata to check ownership before deleting
      const { readMetadata } = await import('@/lib/azure-storage');
      const allPhotos = await readMetadata();
      const entry = allPhotos.find((p) => p.filename === safeName);

      if (!entry) {
        return res.status(404).json({ error: 'Media not found' });
      }
      if (!isAdmin && entry.uploaderCode !== accessCode) {
        return res.status(403).json({ error: 'You can only delete your own media' });
      }

      removed = await removeMetadataEntry(safeName);
      await deleteBlob(safeName);
      // Also delete thumbnail if it exists
      if (entry.thumbnailFilename) {
        await deleteBlob(entry.thumbnailFilename);
      }
    } else {
      // Local storage
      const allPhotos = readLocalMetadata();
      const entry = allPhotos.find((p) => p.filename === safeName);

      if (!entry) {
        return res.status(404).json({ error: 'Media not found' });
      }
      if (!isAdmin && entry.uploaderCode !== accessCode) {
        return res.status(403).json({ error: 'You can only delete your own media' });
      }

      removed = removeLocalMetadataEntry(safeName);

      // Delete file from disk
      const filePath = path.join(UPLOADS_DIR, safeName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      // Delete thumbnail if it exists
      if (entry.thumbnailFilename) {
        const thumbPath = path.join(UPLOADS_DIR, entry.thumbnailFilename);
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      }
    }

    return res.status(200).json({ success: true, deleted: removed });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete media' });
  }
}
