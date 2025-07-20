
import React, { useState, useEffect } from 'react';
import type { FlashcardWithState, Flashcard } from '../types';

interface FlashcardModalProps {
  cardToEdit: FlashcardWithState | null;
  onSave: (card: Flashcard) => void;
  onClose: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  cardToEdit,
  onSave,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (cardToEdit) {
      setQuestion(cardToEdit.question);
      setAnswer(cardToEdit.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
  }, [cardToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSave({ question, answer });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-teal-300 mb-6">
          {cardToEdit ? 'Modifier la Fiche' : 'Créer une Fiche'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="modal-question" className="block text-sm font-medium text-slate-300 mb-2">
                Question
              </label>
              <textarea
                id="modal-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Entrez votre question ici"
                className="w-full h-28 p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="modal-answer" className="block text-sm font-medium text-slate-300 mb-2">
                Réponse
              </label>
              <textarea
                id="modal-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Entrez la réponse ici"
                className="w-full h-28 p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
                required
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-md transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
