import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { putFile } from '@/lib/github';

const MAX_BYTES = 4 * 1024 * 1024; // 4MB, GitHub Contents API limit is ~100MB but keep uploads light

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filename, dataUrl } = await request.json();
  const match = /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,(.+)$/.exec(dataUrl || '');
  if (!filename || !match) {
    return NextResponse.json({ error: 'Invalid or unsupported image data' }, { status: 400 });
  }

  const base64 = match[2];
  if (Buffer.byteLength(base64, 'base64') > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is too large (max 4MB)' }, { status: 400 });
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const storedName = `${Date.now()}-${safeName}`;

  await putFile({
    filePath: `public/uploads/${storedName}`,
    contentBase64: base64,
    message: `dashboard: upload image ${storedName}`,
  });

  return NextResponse.json({ path: `/uploads/${storedName}` });
}
