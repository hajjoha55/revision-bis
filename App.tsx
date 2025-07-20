import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { InputPanel } from './components/InputPanel';
import { FlashcardGrid } from './components/FlashcardGrid';
import { FlashcardModal } from './components/FlashcardModal';
import { HistoryPanel } from './components/HistoryPanel';
import { generateFlashcardsFromText, generateFlashcardsFromSearch } from './services/geminiService';
import type { Flashcard, FlashcardWithState, Source, GenerationMode, CardDifficulty, StudySession } from './types';
import { StudyView } from './components/StudyView';

function App() {
  const [mode, setMode] = useState<GenerationMode>('text');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [numberOfCards, setNumberOfCards] = useState(10);
  const [flashcards, setFlashcards] = useState<FlashcardWithState[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardWithState | null>(null);
  
  const [history, setHistory] = useState<StudySession[]>([]);
  
  const [isStudying, setIsStudying] = useState(false);

  // Load history from localStorage on initial load
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('flashcardHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (flashcards.length > 0) {
      const currentSessionInHistory = history.find(s => 
          s.flashcards.length === flashcards.length && 
          s.flashcards[0]?.id === flashcards[0]?.id
      );

      if (currentSessionInHistory) {
          const updatedHistory = history.map(s => 
              s.id === currentSessionInHistory.id ? { ...s, flashcards: flashcards } : s
          );
          setHistory(updatedHistory);
      }
    }
  }, [flashcards]);

  useEffect(() => {
    try {
      localStorage.setItem('flashcardHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFlashcards([]);
    setSources([]);
    setCurrentCardIndex(0);
    setIsStudying(false);

    try {
      let result;
      const originalInput = mode === 'text' ? inputText : searchQuery;

      if (!originalInput.trim()) {
        setError(mode === 'text' ? 'Veuillez entrer du texte à analyser.' : 'Veuillez entrer un sujet de recherche.');
        setIsLoading(false);
        return;
      }
      
      if (mode === 'text') {
        result = await generateFlashcardsFromText(inputText, numberOfCards);
      } else {
        result = await generateFlashcardsFromSearch(searchQuery, numberOfCards);
        setSources(result.sources);
      }
      
      const cardsWithState: FlashcardWithState[] = result.flashcards.map(card => ({
        ...card,
        id: crypto.randomUUID(),
        difficulty: null,
      }));
      setFlashcards(cardsWithState);
      
      const sessionTitle = mode === 'search' 
        ? searchQuery 
        : inputText.substring(0, 40) + (inputText.length > 40 ? '...' : '');

      const newSession: StudySession = {
        id: crypto.randomUUID(),
        title: sessionTitle,
        createdAt: new Date().toISOString(),
        flashcards: cardsWithState,
        sources: result.sources || [],
        mode,
        originalInput: originalInput
      };
      setHistory(prev => [newSession, ...prev]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, inputText, searchQuery, numberOfCards]);

  const handleRateCard = useCallback((cardId: string, difficulty: CardDifficulty) => {
    setFlashcards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, difficulty } : card
      )
    );
  }, []);

  const handleNextCard = useCallback(() => {
    if (flashcards.length === 0) return;
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
  }, [flashcards.length]);

  const handleOpenEditModal = (cardId: string) => {
    const card = flashcards.find(c => c.id === cardId);
    if (card) {
      setEditingCard(card);
      setIsModalOpen(true);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleSaveCard = (cardData: Flashcard) => {
    if (editingCard) {
      // Update existing card
      setFlashcards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...cardData } : c));
    } else {
      // Add new card
      const newCard: FlashcardWithState = {
        ...cardData,
        id: crypto.randomUUID(),
        difficulty: null
      };
      setFlashcards(prev => [...prev, newCard]);
      if (flashcards.length === 0) {
        setCurrentCardIndex(0);
      }
    }
    handleCloseModal();
  };
  
  const handleLoadSession = useCallback((sessionId: string) => {
    const session = history.find(s => s.id === sessionId);
    if (session) {
      setIsStudying(false);
      setFlashcards(session.flashcards);
      setSources(session.sources);
      setCurrentCardIndex(0);
      setError(null);
      
      setMode(session.mode);
      if (session.mode === 'text') {
        setInputText(session.originalInput);
        setSearchQuery('');
      } else {
        setSearchQuery(session.originalInput);
        setInputText('');
      }
    }
  }, [history]);
  
  const handleDeleteSession = useCallback((sessionId: string) => {
    setHistory(prev => prev.filter(s => s.id !== sessionId));
  }, []);
  
  const mainContent = () => {
    if (isStudying) {
        return (
            <StudyView 
                initialCards={flashcards}
                onEndSession={() => setIsStudying(false)}
                onRateCard={handleRateCard}
            />
        )
    }
    return (
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 flex flex-col gap-8">
            <InputPanel
                mode={mode}
                setMode={setMode}
                inputText={inputText}
                setInputText={setInputText}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                numberOfCards={numberOfCards}
                setNumberOfCards={setNumberOfCards}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                error={error}
            />
            <HistoryPanel
                history={history}
                onLoadSession={handleLoadSession}
                onDeleteSession={handleDeleteSession}
            />
            </div>
            <div className="lg:col-span-2">
            <FlashcardGrid
                flashcards={flashcards}
                sources={sources}
                isLoading={isLoading}
                currentCardIndex={currentCardIndex}
                onRateCard={handleRateCard}
                onNextCard={handleNextCard}
                onEditCard={handleOpenEditModal}
                onAddCard={handleOpenCreateModal}
                onStartStudySession={() => setIsStudying(true)}
            />
            </div>
        </main>
    )
  }


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <Header />
        {mainContent()}
      </div>
      {isModalOpen && (
        <FlashcardModal
          cardToEdit={editingCard}
          onSave={handleSaveCard}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
