import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAuthed } from '@/lib/auth';
import { getFile, putFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_PATH = 'data/projects.json';
const ALLOWED_CATEGORIES = ['web', 'uiux', 'wordpress'];

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Never let an exception escape the handler.
// An escaped exception = empty 500 body = "Unexpected end of JSON input" in the browser.
function serverError(err, where) {
  console.error(`[projects:${where}]`, err);
  return NextResponse.json(
    { error: `${where} failed: ${err?.message || 'Unknown server error'}` },
    { status: 500 }
  );
}

// Reads the request body without throwing when it is empty or malformed.
async function readBody(request) {
  try {
    const text = await request.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function slugify(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'project'
  );
}

function validate(body) {
  if (!body.title || !body.title.trim()) return 'Title is required';
  if (!ALLOWED_CATEGORIES.includes(body.category)) return 'Category must be web, uiux, or wordpress';
  if (!body.bgImage) return 'Image is required';
  if (!body.link || !body.link.trim()) return 'Project link is required';
  if (!Array.isArray(body.tools)) return 'Tools must be an array';
  return null;
}

async function readProjects() {
  const { content, sha } = await getFile(DATA_PATH);
  let parsed;
  try {
    parsed = JSON.parse(content || '[]');
  } catch {
    throw new Error('data/projects.json on GitHub is not valid JSON');
  }
  if (!Array.isArray(parsed)) throw new Error('data/projects.json must contain an array');
  return { projects: parsed, sha };
}

async function writeProjects(projects, sha, message) {
  await putFile({
    filePath: DATA_PATH,
    contentBase64: Buffer.from(JSON.stringify(projects, null, 2) + '\n').toString('base64'),
    message,
    sha,
  });
}

export async function POST(request) {
  try {
    if (!isAuthed()) return unauthorized();

    const body = await readBody(request);
    if (!body) return NextResponse.json({ error: 'Request body was empty' }, { status: 400 });

    const error = validate(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const { projects, sha } = await readProjects();

    let id = slugify(body.title);
    const existingIds = new Set(projects.map((p) => p.id));
    if (existingIds.has(id)) id = `${id}-${crypto.randomBytes(3).toString('hex')}`;

    const newProject = {
      id,
      title: body.title.trim(),
      category: body.category,
      bgImage: body.bgImage,
      link: body.link.trim(),
      description: (body.description || '').trim(),
      tools: body.tools,
    };

    projects.push(newProject);
    await writeProjects(projects, sha, `dashboard: add project "${newProject.title}"`);

    return NextResponse.json(newProject);
  } catch (err) {
    return serverError(err, 'Add');
  }
}

export async function PUT(request) {
  try {
    if (!isAuthed()) return unauthorized();

    const body = await readBody(request);
    if (!body) return NextResponse.json({ error: 'Request body was empty' }, { status: 400 });
    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const error = validate(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const { projects, sha } = await readProjects();
    const idx = projects.findIndex((p) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const updated = {
      ...projects[idx],
      title: body.title.trim(),
      category: body.category,
      bgImage: body.bgImage,
      link: body.link.trim(),
      description: (body.description || '').trim(),
      tools: body.tools,
    };
    projects[idx] = updated;

    await writeProjects(projects, sha, `dashboard: update project "${updated.title}"`);
    return NextResponse.json(updated);
  } catch (err) {
    return serverError(err, 'Update');
  }
}

export async function DELETE(request) {
  try {
    if (!isAuthed()) return unauthorized();

    const body = await readBody(request);
    if (!body) return NextResponse.json({ error: 'Request body was empty' }, { status: 400 });

    const { id } = body;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const { projects, sha } = await readProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await writeProjects(filtered, sha, `dashboard: delete project ${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError(err, 'Delete');
  }
}