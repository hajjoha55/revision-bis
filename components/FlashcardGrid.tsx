import React from 'react';
import Flashcard from './Flashcard';
import type { FlashcardWithState, Source, CardDifficulty } from '../types';
import { SpinnerIcon, PlayIcon } from './icons';

interface FlashcardGridProps {
  flashcards: FlashcardWithState[];
  sources: Source[];
  isLoading: boolean;
  currentCardIndex: number;
  onRateCard: (cardId: string, difficulty: CardDifficulty) => void;
  onNextCard: () => void;
  onEditCard: (cardId: string) => void;
  onAddCard: () => void;
  onStartStudySession: () => void;
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({ 
  flashcards, 
  sources, 
  isLoading, 
  currentCardIndex,
  onRateCard,
  onNextCard,
  onEditCard,
  onAddCard,
  onStartStudySession,
}) => {
  const hasResults = flashcards.length > 0;
  const currentCard = hasResults ? flashcards[currentCardIndex] : null;

  return (
    <section className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col min-h-[600px] lg:min-h-0">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-teal-300">Vos Fiches de Révision</h2>
        <div className="flex gap-2">
            <button
                onClick={onAddCard}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
                + Ajouter
            </button>
             <button
                onClick={onStartStudySession}
                disabled={!hasResults}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
                <PlayIcon className="w-5 h-5" />
                Étudier
            </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
            <SpinnerIcon className="animate-spin h-12 w-12 text-teal-400 mb-4" />
            <p className="text-lg">L'IA prépare vos fiches...</p>
        </div>
      )}

      {!isLoading && !hasResults && (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-400 bg-slate-800 rounded-lg p-8">
            <p className="text-xl font-semibold">Prêt à étudier ?</p>
            <p>Générez vos fiches, ajoutez-en une manuellement ou chargez une session depuis l'historique.</p>
        </div>
      )}

      {!isLoading && hasResults && currentCard && (
        <div className="flex-grow flex flex-col">
          <div className="w-full text-center mb-4">
            <p className="text-slate-400 font-semibold">
              Fiche {currentCardIndex + 1} / {flashcards.length}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-teal-400 to-sky-500 h-2 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto my-4 flex-grow flex items-center">
            <Flashcard
              key={currentCard.id}
              card={currentCard}
              onRate={(difficulty) => onRateCard(currentCard.id, difficulty)}
              onEdit={() => onEditCard(currentCard.id)}
              isEditable={true}
            />
          </div>

          <div className="w-full mt-4 text-center">
            <button
              onClick={onNextCard}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Fiche Suivante &rarr;
            </button>
          </div>

          {sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-slate-300 mb-3">Sources du Web</h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 hover:underline transition-colors text-sm"
                    >
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
