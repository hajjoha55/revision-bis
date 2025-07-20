import React from 'react';
import type { StudySession } from '../types';
import { TrashIcon } from './icons';

interface HistoryPanelProps {
  history: StudySession[];
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onLoadSession,
  onDeleteSession,
}) => {
  return (
    <aside className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-teal-300">Historique des Sessions</h2>
      {history.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-center text-slate-400 bg-slate-800 rounded-lg p-6">
          <p>Aucune session sauvegardée pour le moment. Générez des fiches pour commencer !</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-2">
            <ul className="space-y-3">
            {history.map((session) => (
                <li
                key={session.id}
                className="bg-slate-900/70 p-3 rounded-lg flex items-center justify-between gap-2 border border-transparent hover:border-teal-500 transition-colors"
                >
                <div className="flex-grow overflow-hidden">
                    <button
                    onClick={() => onLoadSession(session.id)}
                    className="w-full text-left"
                    >
                    <p className="font-semibold text-slate-200 truncate hover:text-teal-400 transition-colors" title={session.title}>
                        {session.title}
                    </p>
                    <p className="text-xs text-slate-500">
                        {new Date(session.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        })}
                    </p>
                    </button>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                    }}
                    className="flex-shrink-0 p-2 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-900/50 transition-colors"
                    aria-label="Supprimer la session"
                    title="Supprimer la session"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                </li>
            ))}
            </ul>
        </div>
      )}
    </aside>
  );
};
