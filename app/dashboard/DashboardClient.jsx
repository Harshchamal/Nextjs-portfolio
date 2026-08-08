'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProjectFormModal from './ProjectFormModal';

// Reads a response safely.
// If the server sends an empty body or HTML, we do NOT crash on JSON.parse.
async function readResponse(res) {
  const text = await res.text();

  if (!text) {
    throw new Error(
      `Server returned no data (status ${res.status}). Check your Vercel function logs.`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned a non-JSON reply (status ${res.status}): ${text.slice(0, 200)}`
    );
  }
}

export default function DashboardClient({ initialProjects }) {
  // Guard 1: if the server passed undefined, null, or a non-array, fall back to an empty
  // list instead of crashing the whole page on .map().
  const safeInitial = Array.isArray(initialProjects) ? initialProjects.filter(Boolean) : [];

  const [projects, setProjects] = useState(safeInitial);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const dataWasBroken = !Array.isArray(initialProjects);

  function openAddForm() {
    setEditingProject(null);
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingProject(project);
    setShowForm(true);
  }

  function handleSaved(saved, isNew) {
    setProjects((prev) =>
      isNew ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p))
    );
    setShowForm(false);
    setErrorMessage('');
    setStatusMessage(
      `Saved "${saved.title}". Pushed to GitHub — your live site updates in about a minute after Vercel redeploys.`
    );
  }

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.title}"? This pushes a commit removing it.`)) return;

    setDeletingId(project.id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const res = await fetch('/api/dashboard/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      });

      const data = await readResponse(res);

      if (!res.ok) throw new Error(data.error || `Delete failed (status ${res.status})`);

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setStatusMessage(
        `Deleted "${project.title}". Pushed to GitHub — your live site updates in about a minute after Vercel redeploys.`
      );
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/dashboard/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#14001f] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Project Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={openAddForm}
              className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium"
            >
              + Add new project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Logout
            </button>
          </div>
        </div>

        {dataWasBroken && (
          <div className="mb-6 p-3 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-sm">
            <strong className="block mb-1">Project data could not be loaded</strong>
            The server did not return a list of projects. Check data/projects.json in your GitHub
            repo — it may be empty or invalid.
          </div>
        )}

        {statusMessage && (
          <div className="mb-6 p-3 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-sm">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-sm">
            <strong className="block mb-1">Delete failed</strong>
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id || `project-${index}`}
              className="bg-white dark:bg-[#1a0026] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                {/* Guard 2: next/image throws a client-side exception when src is empty. */}
                {project.bgImage ? (
                  <Image
                    src={project.bgImage}
                    alt={project.title || 'Project image'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    No image set
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="inline-block text-xs uppercase tracking-wide text-purple-600 dark:text-purple-300 mb-1">
                  {project.category || 'uncategorised'}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {project.title || 'Untitled project'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {project.description || ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(project)}
                    className="flex-1 text-sm py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    disabled={deletingId === project.id}
                    className="flex-1 text-sm py-1.5 rounded-lg bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 disabled:opacity-60"
                  >
                    {deletingId === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !dataWasBroken && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-16">
            No projects yet. Click &quot;Add new project&quot; to create your first card.
          </p>
        )}
      </div>

      {showForm && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}