import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import {
  isAzureConfigured,
  ensureContainer,
  uploadBlob,
  appendMetadata as appendAzureMetadata,
  type PhotoMeta,
  type MediaCategory,
  MEDIA_CATEGORIES,
} from '@/lib/azure-storage';

const THUMB_MAX_DIM = 400;
const THUMB_QUALITY = 70;

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const METADATA_FILE = path.join(UPLOADS_DIR, 'photos.json');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// Local filesystem fallback for development without Azure
function readLocalMetadata(): PhotoMeta[] {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function appendLocalMetadata(newEntries: PhotoMeta[]) {
  const existing = readLocalMetadata();
  const updated = [...existing, ...newEntries];
  fs.writeFileSync(METADATA_FILE, JSON.stringify(updated, null, 2));
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

  const useAzure = isAzureConfigured();

  if (useAzure) {
    await ensureContainer();
  } else {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  const form = formidable({
    maxFileSize: MAX_FILE_SIZE,
    filter: ({ mimetype }) => {
      return !!mimetype && ALLOWED_TYPES.includes(mimetype);
    },
  });

  try {
    const [fields, files] = await form.parse(req);

    const uploaderName = Array.isArray(fields.uploaderName)
      ? fields.uploaderName[0]
      : fields.uploaderName;

    if (!uploaderName || !uploaderName.trim()) {
      return res.status(400).json({ error: 'Uploader name is required' });
    }

    const rawCategory= Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;
    const category = (rawCategory && MEDIA_CATEGORIES.includes(rawCategory as MediaCategory))
      ? (rawCategory as MediaCategory)
      : undefined;

    const uploaderCode = session.user?.accessCode || undefined;

    const uploadedFiles = files.photo;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No photo file provided' });
    }

    const results: PhotoMeta[] = [];

    for (const file of uploadedFiles) {
      if (!file.mimetype || !ALLOWED_TYPES.includes(file.mimetype)) {
        continue;
      }

      const ext = path.extname(file.originalFilename || '.jpg');
      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const thumbName = `thumb_${uniqueName.replace(/\.[^.]+$/, '.jpg')}`;

      const fileBuffer = fs.readFileSync(file.filepath);

      // Generate thumbnail
      const thumbBuffer = await sharp(fileBuffer)
        .resize(THUMB_MAX_DIM, THUMB_MAX_DIM, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: THUMB_QUALITY })
        .toBuffer();

      if (useAzure) {
        await uploadBlob(uniqueName, fileBuffer, file.mimetype, {
          uploadername: uploaderName.trim(),
          originalname: file.originalFilename || 'unknown',
        });
        await uploadBlob(thumbName, thumbBuffer, 'image/jpeg', {
          uploadername: uploaderName.trim(),
          originalname: `thumb_${file.originalFilename || 'unknown'}`,
        });
      } else {
        fs.writeFileSync(path.join(UPLOADS_DIR, uniqueName), fileBuffer);
        fs.writeFileSync(path.join(UPLOADS_DIR, thumbName), thumbBuffer);
      }

      fs.unlinkSync(file.filepath); // clean up temp file

      const meta: PhotoMeta = {
        filename: uniqueName,
        thumbnailFilename: thumbName,
        originalName: file.originalFilename || 'unknown',
        uploaderName: uploaderName.trim(),
        uploaderCode,
        category,

        mimeType: file.mimetype,
        size: file.size || 0,
        uploadedAt: new Date().toISOString(),
      };

      results.push(meta);
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'No valid image files were uploaded' });
    }

    if (useAzure) {
      await appendAzureMetadata(results);
    } else {
      appendLocalMetadata(results);
    }

    return res.status(200).json({ success: true, photos: results });
  } catch (error: any) {
    console.error('Upload error:', error);
    if (error.code === 1009 || error.message?.includes('maxFileSize')) {
      return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
}
