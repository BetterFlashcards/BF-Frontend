import { Card } from "../types";
import { v4 as uuidv4 } from "uuid";

class CardManager {
  private static instance: CardManager;
  private cards: Array<Card>;
  private subscribers: Array<CardChangeCallback>;
  private constructor() {
    this.cards = [];
    this.subscribers = [];
  }

  public static getInstance(): CardManager {
    if (CardManager.instance === undefined)
      CardManager.instance = new CardManager();
    return CardManager.instance;
  }

  public getAllCards(): Array<Card> {
    return this.cards;
  }

  public getCards(deckId: string): Array<Card> {
    return this.cards.filter((card) => card.deckId === deckId);
  }

  public deleteCard(id: string) {
    const foundIndex = this.cards.findIndex((card) => card.id === id);
    this.cards.splice(foundIndex, 1);
    this.notifySubscribers();
  }

  public createCard(dekckId: string, front: string, back: string) {
    const newCard: Card = {
      deckId: dekckId,
      front,
      back,
      id: uuidv4(),
    };
    this.cards.push(newCard);
    this.notifySubscribers();
  }

  public updateCard(id: string, front: string, back: string) {
    const foundCard = this.cards.find((card) => card.id == id);
    if (foundCard) {
      foundCard.front = front;
      foundCard.back = back;
      this.notifySubscribers();
    }
  }

  public subscribe(callback: CardChangeCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: CardChangeCallback) {
    const foundIndex = this.subscribers.indexOf(callback);
    this.subscribers.splice(foundIndex, 1);
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      callback(this.cards);
    });
  }
}

export type CardChangeCallback = (decks: Array<Card>) => void;

export default CardManager;
