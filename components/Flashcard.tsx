import React, { useState, useEffect } from 'react';
import type { FlashcardWithState, CardDifficulty } from '../types';
import { EditIcon } from './icons';

interface FlashcardProps {
  card: FlashcardWithState;
  onRate: (difficulty: CardDifficulty) => void;
  onEdit: () => void;
  isEditable?: boolean;
}

const DifficultyButton: React.FC<{
  onClick: () => void;
  colorClasses: string;
  label: string;
}> = ({ onClick, colorClasses, label }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-transform transform hover:scale-105 ${colorClasses}`}
  >
    {label}
  </button>
);

const Flashcard: React.FC<FlashcardProps> = ({ card, onRate, onEdit, isEditable = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const difficultyIndicator = card.difficulty ? (
    <span
      className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-slate-800 ${
        card.difficulty === 'hard' ? 'bg-red-500' :
        card.difficulty === 'medium' ? 'bg-yellow-400' :
        'bg-green-500'
      }`}
      title={`Difficulté: ${card.difficulty}`}
    ></span>
  ) : null;

  return (
    <div
      className="group w-full h-64 [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full p-6 bg-slate-800 border border-slate-700 rounded-lg [backface-visibility:hidden] flex flex-col justify-center items-center">
          {isEditable && (
            <button 
              onClick={handleEditClick}
              className="absolute top-2 left-2 p-1 text-slate-500 hover:text-teal-400 transition-colors"
              aria-label="Modifier la fiche"
              title="Modifier la fiche"
            >
              <EditIcon className="w-5 h-5" />
            </button>
          )}
          <span className="absolute top-3 right-10 text-xs text-slate-500 font-semibold">QUESTION</span>
          {difficultyIndicator}
          <p className="text-lg text-center text-slate-200 px-4">{card.question}</p>
          <span className="absolute bottom-3 text-xs text-slate-500">Cliquez pour révéler</span>
        </div>
        {/* Back of card */}
        <div className="absolute w-full h-full p-6 bg-teal-900/50 border border-teal-700 rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between items-center">
          <div>
            <span className="absolute top-3 left-3 text-xs text-teal-300 font-semibold">RÉPONSE</span>
            <p className="text-center text-slate-100 mt-6 px-4">{card.answer}</p>
          </div>
          <div className="flex justify-center items-center gap-3">
            <DifficultyButton onClick={() => onRate('hard')} colorClasses="bg-red-600 hover:bg-red-700" label="Difficile" />
            <DifficultyButton onClick={() => onRate('medium')} colorClasses="bg-yellow-500 hover:bg-yellow-600" label="Moyen" />
            <DifficultyButton onClick={() => onRate('easy')} colorClasses="bg-green-600 hover:bg-green-700" label="Facile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
