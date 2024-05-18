export interface User {
  username: string;
}

export interface Card {
  id: number;
  front_text: string;
  back_text: string;
  deck: Deck;
}

export interface Deck {
  id: number;
  name: string;
  language: string;
}
