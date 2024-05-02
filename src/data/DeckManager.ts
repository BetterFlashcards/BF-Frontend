import { Deck } from "../types";
import { v4 as uuidv4 } from "uuid";
import CardManager from "./CardManager";
import { getLocalData, storeData } from "../helpers";

class DeckManager {
  private static instance: DeckManager;
  private decks: Array<Deck>;
  private subscribers: Array<ChangeCallback>;
  private cardManager: CardManager;
  private constructor() {
    this.cardManager = CardManager.getInstance();
    const storedDecks = getLocalData<Array<Deck>>("decks");
    this.decks = storedDecks || [];
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

  public getDeckById(id: string): Deck | undefined {
    return this.decks.find((item) => item.id === id);
  }

  public getCardCountByDeck(deckId: string) {
    return this.cardManager.getCards(deckId).length;
  }

  public createDeck(title: string, description: string) {
    const newDeck: Deck = {
      id: uuidv4(),
      title,
      description,
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
    storeData("decks", this.decks);
    this.subscribers.forEach((callback) => {
      callback(this.decks);
    });

  }
}

export type ChangeCallback = (decks: Array<Deck>) => void;

export default DeckManager;
