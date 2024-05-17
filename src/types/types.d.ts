export interface User {
  username: string;
}

export interface Card {
  id: string;
  deckId: number | null;
  front: string;
  back: string;
}

export interface Deck {
  id: number;
  name: string;
  language: string;
}
