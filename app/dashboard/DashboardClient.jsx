'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProjectFormModal from './ProjectFormModal';

export default function DashboardClient({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

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
    setStatusMessage(
      `Saved "${saved.title}". Pushed to GitHub — your live site updates in about a minute after Vercel redeploys.`
    );
  }

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.title}"? This pushes a commit removing it.`)) return;
    setDeletingId(project.id);
    try {
      const res = await fetch('/api/dashboard/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setStatusMessage(`Deleted "${project.title}".`);
    } catch (err) {
      alert(err.message);
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

        {statusMessage && (
          <div className="mb-6 p-3 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-sm">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-[#1a0026] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                <Image src={project.bgImage} alt={project.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <span className="inline-block text-xs uppercase tracking-wide text-purple-600 dark:text-purple-300 mb-1">
                  {project.category}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {project.description}
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

        {projects.length === 0 && (
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
