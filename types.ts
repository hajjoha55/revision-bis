export interface Flashcard {
  question: string;
  answer: string;
}

export type CardDifficulty = 'hard' | 'medium' | 'easy';

export interface FlashcardWithState extends Flashcard {
  id: string;
  difficulty: CardDifficulty | null;
}

export interface Source {
  uri: string;
  title: string;
}

export type GenerationMode = 'text' | 'search';

export interface StudySession {
  id: string;
  title: string;
  createdAt: string; // ISO string date
  flashcards: FlashcardWithState[];
  sources: Source[];
  mode: GenerationMode;
  originalInput: string;
}
