import React from 'react';

const EducationModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl p-6 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl font-bold">×</button>
        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <p className="italic mb-1">{item.institute}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.duration}</p>
        <p className="font-semibold mb-2">{item.grade}</p>
        <p className="text-sm leading-relaxed">{item.details}</p>
      </div>
    </div>
  );
};

export default EducationModal;
