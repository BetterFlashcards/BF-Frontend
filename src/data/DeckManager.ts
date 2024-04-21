import { Deck } from "../types";
import { v4 as uuidv4 } from "uuid";

class DeckManager {
  private static instance: DeckManager;
  private decks: Array<Deck>;
  private subscribers: Array<ChangeCallback>;
  private constructor() {
    this.decks = [];
    this.subscribers = [];
  }

  public static getInstance(): DeckManager {
    if (DeckManager.instance === undefined)
      DeckManager.instance = new DeckManager();
    return DeckManager.instance;
  }

  public getDecks(): Array<Deck> {
    return this.decks;
  }
  public createDeck(title: string) {
    const newDeck: Deck = {
      id: uuidv4(),
      title,
      lastUpdated: new Date().toISOString(),
    };
    this.decks.push(newDeck);
    this.notifySubscribers();
  }

  public deleteDeck(id: string) {
    const foundIndex = this.decks.findIndex((deck) => deck.id === id);
    this.decks.splice(foundIndex, 1);
    this.notifySubscribers();
  }

  public updateDeckTitle = (id: string, newTitle: string) => {
    const foundDeck = this.decks.find((deck) => deck.id === id);
    if (!foundDeck) return;
    foundDeck.title = newTitle;
    foundDeck.lastUpdated = new Date().toISOString();
    this.notifySubscribers();
  };

  public subscribe(callback: ChangeCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: ChangeCallback) {
    const foundIndex = this.subscribers.indexOf(callback);
    this.subscribers.splice(foundIndex, 1);
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      callback(this.decks);
    });
  }
}

export type ChangeCallback = (decks: Array<Deck>) => void;

export default DeckManager;
