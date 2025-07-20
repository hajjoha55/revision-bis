import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { FlashcardWithState, CardDifficulty } from '../types';
import Flashcard from './Flashcard';
import { BrainIcon } from './icons';

interface StudyViewProps {
  initialCards: FlashcardWithState[];
  onEndSession: () => void;
  onRateCard: (cardId: string, difficulty: CardDifficulty) => void;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
  };

export const StudyView: React.FC<StudyViewProps> = ({ initialCards, onEndSession, onRateCard }) => {
    const [studyDeck, setStudyDeck] = useState<FlashcardWithState[]>([]);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [masteredCount, setMasteredCount] = useState(0);
    const [initialDeckSize, setInitialDeckSize] = useState(0);

    const initializeDeck = useCallback(() => {
        const cardsToStudy = initialCards.filter(c => c.difficulty !== 'easy');
        const deck = cardsToStudy.length > 0 ? cardsToStudy : initialCards;
        const shuffledDeck = shuffleArray(deck);
        setStudyDeck(shuffledDeck);
        setInitialDeckSize(shuffledDeck.length);
        setSessionComplete(false);
        setMasteredCount(0);
    }, [initialCards]);

    useEffect(() => {
        initializeDeck();
    }, [initializeDeck]);

    const handleRate = (difficulty: CardDifficulty) => {
        if (studyDeck.length === 0) return;
    
        const currentCard = studyDeck[0];
        onRateCard(currentCard.id, difficulty);
    
        let newDeck = studyDeck.slice(1);
    
        if (difficulty === 'easy') {
          setMasteredCount(prev => prev + 1);
        } else {
            const reinsertionIndex = difficulty === 'hard' 
                ? Math.min(1, newDeck.length)
                : Math.min(3, newDeck.length);
            newDeck.splice(reinsertionIndex, 0, {...currentCard, difficulty});
        }
    
        setStudyDeck(newDeck);

        if (newDeck.length === 0) {
            setSessionComplete(true);
        }
    };
    
    if (initialDeckSize === 0 && !sessionComplete) {
        return (
            <div className="text-center p-8 mt-8 bg-slate-800/50 rounded-lg">
                <p className="text-xl text-slate-300">Toutes les fiches sont déjà maîtrisées !</p>
                <button onClick={onEndSession} className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Retour
                </button>
            </div>
        );
    }

    if(sessionComplete) {
        return (
            <div className="text-center p-8 mt-8 bg-slate-800/50 rounded-lg max-w-2xl mx-auto border border-teal-700 shadow-2xl">
                <BrainIcon className="w-16 h-16 mx-auto text-teal-400" />
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500 mt-4">Session Terminée !</h2>
                <p className="text-slate-300 text-lg mt-2">Félicitations ! Vous avez terminé cette session d'étude.</p>
                <div className="mt-6 text-xl">
                    <span className="font-bold text-white">{masteredCount + (initialDeckSize - masteredCount)}</span> / <span className="text-slate-400">{initialDeckSize}</span> fiches revues
                </div>
                 <div className="mt-8 flex justify-center gap-4">
                    <button onClick={initializeDeck} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Étudier à nouveau
                    </button>
                    <button onClick={onEndSession} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Retourner à la vue principale
                    </button>
                 </div>
            </div>
        )
    }

    const currentCard = studyDeck[0];
    const progressPercentage = initialDeckSize > 0 ? ((initialDeckSize - studyDeck.length) / initialDeckSize) * 100 : 0;

    return (
        <section className="mt-8 w-full max-w-3xl mx-auto flex flex-col items-center">
            {currentCard ? (
                <>
                    <div className="w-full text-center mb-6">
                        <div className="flex justify-between items-center text-slate-400 font-semibold mb-2 px-1">
                            <span>Progression de la session</span>
                            <span>{initialDeckSize - studyDeck.length} / {initialDeckSize}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div 
                                className="bg-gradient-to-r from-teal-400 to-sky-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="w-full max-w-lg mx-auto">
                        <Flashcard 
                            key={currentCard.id}
                            card={currentCard}
                            onRate={handleRate}
                            onEdit={() => {}} // Edit is disabled in study mode
                            isEditable={false}
                        />
                    </div>
                    <p className="mt-6 text-slate-400">Retournez la fiche et choisissez une difficulté pour continuer.</p>
                    <button onClick={onEndSession} className="mt-8 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                        Terminer la session
                    </button>
                </>
            ) : (
                <div className="text-center p-8">
                    <p>Chargement de la session d'étude...</p>
                </div>
            )}
        </section>
    );
};
