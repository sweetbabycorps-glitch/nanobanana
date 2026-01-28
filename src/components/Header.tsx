import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🍌</div>
          <h1 className="text-xl font-semibold text-gray-100 hidden md:block">
            Nano Banana AI Image Editor
          </h1>
          <h1 className="text-xl font-semibold text-gray-100 md:hidden">
            NB Редактор
          </h1>
        </div>
        <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          2.0
        </div>
      </div>

      <div className="flex items-center space-x-2">
      </div>
    </header>
  );
};