
import React from 'react';
import { BrainIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <BrainIcon className="w-10 h-10 text-teal-400" />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
          Générateur de Fiches de Révision AI
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">
        Transformez n'importe quel sujet en fiches d'étude en quelques secondes.
      </p>
    </header>
  );
};
