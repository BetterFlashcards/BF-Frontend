export interface Card {
  id: string;
  deckId: string | null;
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
}
