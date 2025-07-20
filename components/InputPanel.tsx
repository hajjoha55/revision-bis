
import React from 'react';
import { SpinnerIcon } from './icons';
import type { GenerationMode } from '../types';

interface InputPanelProps {
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  inputText: string;
  setInputText: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  numberOfCards: number;
  setNumberOfCards: (num: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  mode,
  setMode,
  inputText,
  setInputText,
  searchQuery,
  setSearchQuery,
  numberOfCards,
  setNumberOfCards,
  onGenerate,
  isLoading,
  error,
}) => {
  const TabButton = ({
    label,
    targetMode,
  }: {
    label: string;
    targetMode: GenerationMode;
  }) => (
    <button
      onClick={() => setMode(targetMode)}
      className={`w-full py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-400 ${
        mode === targetMode
          ? 'bg-teal-500 text-white shadow'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-teal-300">Créez vos fiches</h2>
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg mb-6">
        <TabButton label="À partir d'un texte" targetMode="text" />
        <TabButton label="Recherche Web" targetMode="search" />
      </div>

      <div className="space-y-4 flex-grow">
        {mode === 'text' ? (
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-slate-300 mb-2">
              Collez votre document ou vos notes ici :
            </label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: 'La photosynthèse est le processus utilisé par les plantes...'"
              className="w-full h-60 p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-slate-300 mb-2">
              Quel sujet souhaitez-vous étudier ?
            </label>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: 'Le cycle de l'eau'"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              disabled={isLoading}
            />
          </div>
        )}
         <div className="pt-4">
            <label htmlFor="card-count" className="block text-sm font-medium text-slate-300 mb-2">
              Nombre de fiches souhaité :
            </label>
            <input
              id="card-count"
              type="number"
              value={numberOfCards}
              onChange={(e) => setNumberOfCards(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              max="50"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              disabled={isLoading}
            />
          </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-4 rounded-md hover:from-teal-600 hover:to-sky-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin h-5 w-5" />
              Génération en cours...
            </>
          ) : (
            'Générer les fiches'
          )}
        </button>
      </div>
      
      {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
    </aside>
  );
};
