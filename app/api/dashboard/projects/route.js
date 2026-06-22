import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAuthed } from '@/lib/auth';
import { getFile, putFile } from '@/lib/github';

const DATA_PATH = 'data/projects.json';
const ALLOWED_CATEGORIES = ['web', 'uiux', 'wordpress'];

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  return { projects: JSON.parse(content || '[]'), sha };
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
  if (!isAuthed()) return unauthorized();
  const body = await request.json();
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
}

export async function PUT(request) {
  if (!isAuthed()) return unauthorized();
  const body = await request.json();
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
}

export async function DELETE(request) {
  if (!isAuthed()) return unauthorized();
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { projects, sha } = await readProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  await writeProjects(filtered, sha, `dashboard: delete project ${id}`);
  return NextResponse.json({ success: true });
}
