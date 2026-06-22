'use client';
import { useState } from 'react';
import Image from 'next/image';

const CATEGORIES = ['web', 'uiux', 'wordpress'];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProjectFormModal({ project, onClose, onSaved }) {
  const isNew = !project;
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState(project?.category || CATEGORIES[0]);
  const [description, setDescription] = useState(project?.description || '');
  const [link, setLink] = useState(project?.link || '');
  const [tools, setTools] = useState((project?.tools || []).join(', '));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(project?.bgImage || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(await fileToDataUrl(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !link.trim() || (!imageFile && !project?.bgImage)) {
      setError('Title, link, and image are required.');
      return;
    }

    setSaving(true);
    try {
      let bgImage = project?.bgImage || '';

      if (imageFile) {
        const dataUrl = await fileToDataUrl(imageFile);
        const uploadRes = await fetch('/api/dashboard/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: imageFile.name, dataUrl }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
        bgImage = uploadData.path;
      }

      const payload = {
        ...(isNew ? {} : { id: project.id }),
        title: title.trim(),
        category,
        description: description.trim(),
        link: link.trim(),
        bgImage,
        tools: tools
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch('/api/dashboard/projects', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      onSaved(data, isNew);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-2xl w-full max-w-lg shadow-2xl relative my-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl font-bold hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">{isNew ? 'Add new project' : 'Edit project'}</h2>

        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />

        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />

        <label className="block text-sm font-medium mb-1">Project link</label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />

        <label className="block text-sm font-medium mb-1">Tools (comma separated)</label>
        <input
          value={tools}
          onChange={(e) => setTools(e.target.value)}
          placeholder="React, Tailwind CSS, Node.js"
          className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />

        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3 text-sm block" />
        {imagePreview && (
          <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image src={imagePreview} alt="Preview" fill className="object-contain" unoptimized />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium disabled:opacity-60"
        >
          {saving ? 'Saving (committing to GitHub)...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
