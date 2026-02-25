import { readFile } from 'fs/promises';
import path from 'path';

function getContentType(ext: string): string {
  const lower = ext.toLowerCase();
  if (lower === '.png') return 'image/png';
  if (lower === '.jpg' || lower === '.jpeg') return 'image/jpeg';
  if (lower === '.webp') return 'image/webp';
  if (lower === '.gif') return 'image/gif';
  if (lower === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

export async function GET(
  _request: Request,
  context: { params: { assetPath: string[] } }
) {
  const baseDir = path.resolve(process.cwd(), 'doc');
  const safeParts = context.params.assetPath.map((part) => decodeURIComponent(part));
  const filePath = path.resolve(baseDir, ...safeParts);

  if (!filePath.startsWith(baseDir + path.sep)) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const file = await readFile(filePath);
    const ext = path.extname(filePath);
    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': getContentType(ext),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}
