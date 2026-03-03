import {
  BlobServiceClient,
  ContainerClient,
  BlobLeaseClient,
} from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'wedding-photos';

let containerClient: ContainerClient | null = null;

function getContainerClient(): ContainerClient {
  if (!containerClient) {
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(containerName);
  }
  return containerClient;
}

let containerEnsured = false;

/** Ensure the blob container exists (only makes the API call once per process). */
export async function ensureContainer(): Promise<void> {
  if (containerEnsured) return;
  const client = getContainerClient();
  await client.createIfNotExists({ access: undefined }); // private access
  containerEnsured = true;
}

/** Upload a buffer to Azure Blob Storage with metadata. */
export async function uploadBlob(
  blobName: string,
  buffer: Buffer,
  contentType: string,
  metadata: Record<string, string>
): Promise<void> {
  const client = getContainerClient();
  const blockBlobClient = client.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
    metadata,
  });
}

/** Download a blob as a readable stream. Returns null if not found. */
export async function downloadBlob(
  blobName: string
): Promise<{ stream: NodeJS.ReadableStream; contentType: string } | null> {
  const client = getContainerClient();
  const blockBlobClient = client.getBlockBlobClient(blobName);

  try {
    const response = await blockBlobClient.download(0);
    if (!response.readableStreamBody) return null;
    return {
      stream: response.readableStreamBody,
      contentType: response.contentType || 'application/octet-stream',
    };
  } catch (err: any) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

export interface PhotoMeta {
  filename: string;
  thumbnailFilename?: string;
  originalName: string;
  uploaderName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

const METADATA_BLOB = '_photos.json';

/** Read the metadata JSON blob (no lock — safe for read-only). */
export async function readMetadata(): Promise<PhotoMeta[]> {
  const client = getContainerClient();
  const blobClient = client.getBlockBlobClient(METADATA_BLOB);

  try {
    const response = await blobClient.download(0);
    const body = await streamToString(response.readableStreamBody!);
    return JSON.parse(body);
  } catch (err: any) {
    if (err.statusCode === 404) return [];
    throw err;
  }
}

/**
 * Atomically append new photo entries to the metadata blob using a lease.
 * Prevents concurrent uploads from overwriting each other's entries.
 */
export async function appendMetadata(newEntries: PhotoMeta[]): Promise<void> {
  const client = getContainerClient();
  const blobClient = client.getBlockBlobClient(METADATA_BLOB);
  const leaseClient = blobClient.getBlobLeaseClient();

  // Ensure the metadata blob exists before leasing
  try {
    await blobClient.getProperties();
  } catch (err: any) {
    if (err.statusCode === 404) {
      // Create the blob with an empty array so we can lease it
      await blobClient.upload('[]', 2, {
        blobHTTPHeaders: { blobContentType: 'application/json' },
      });
    } else {
      throw err;
    }
  }

  // Acquire a 30-second lease (Azure minimum is 15s)
  const lease = await leaseClient.acquireLease(30);
  const leaseId = lease.leaseId!;

  try {
    // Read current data under the lease
    const response = await blobClient.download(0, undefined, {
      conditions: { leaseId },
    });
    const body = await streamToString(response.readableStreamBody!);
    const existing: PhotoMeta[] = JSON.parse(body);

    // Append and write back under the same lease
    const updated = [...existing, ...newEntries];
    const content = JSON.stringify(updated, null, 2);
    await blobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' },
      conditions: { leaseId },
    });
  } finally {
    // Always release the lease
    try {
      await leaseClient.releaseLease();
    } catch {
      // Lease will expire automatically after 30s if release fails
    }
  }
}

/** Check if Azure storage is configured. */
export function isAzureConfigured(): boolean {
  return !!connectionString;
}

// Helper: convert a readable stream to a string
async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}
