export interface User {
  username: string;
}

export interface Card {
  deck_id: number;
  id: number;
  front_text: string;
  back_text: string;
  draft: boolean;
  related_book: number;
}

export interface Deck {
  id: number;
  name: string;
  language: string;
}

export interface Language {
  id: number;
  name: string;
  name_local: string;
  isocode: string;
  sorting: number;
}

export interface Translation {
  word: string;
  translation: string;
}
