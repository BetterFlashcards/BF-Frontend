import { Deck } from "../types";
import CardManager from "./CardManager";
import { storeData } from "../helpers";
import AuthService from "./AuthService";
import { AxiosError } from "axios";
import { toast } from "sonner";

class DeckManager {
  private static instance: DeckManager;
  private decks: Array<Deck>;
  private subscribers: Array<ChangeCallback>;
  private cardManager: CardManager;
  private authService: AuthService;
  private constructor() {
    this.authService = AuthService.getInstance();
    this.cardManager = CardManager.getInstance();
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

  public getDeckById(id: number): Deck | undefined {
    return this.decks.find((item) => item.id === id);
  }

  public getCardCountByDeck(deckId: number) {
    return this.cardManager.getCards(deckId).length;
  }

  public async createDeck(name: string, language: string) {
    const data = { name, language };
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .post<{ id: number }>("/decks", data);
      if (res.status === 200) {
        const newDeck: Deck = {
          id: res.data.id,
          name,
          language,
        };
        this.decks.push(newDeck);
        this.notifySubscribers();
        toast.success("Deck created successfully!");
        return true;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        const msg = axiosError.response?.data.detail;
        toast.error(msg);
      } else {
        toast.error(error as string);
      }
    }
    return false;
  }

  public async fetchDecks() {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<{ items: Array<Deck> }>("/decks");
      if (res.status === 200) {
        this.decks = res.data.items;
        this.notifySubscribers();
        return true;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        const msg = axiosError.response?.data.detail;
        toast.error(msg);
      } else {
        toast.error(error as string);
      }
    }
    return false;
  }

  public deleteDeck(id: number) {
    const foundIndex = this.decks.findIndex((deck) => deck.id === id);
    this.decks.splice(foundIndex, 1);
    this.notifySubscribers();
  }

  public updateDeckTitle = (id: number, newTitle: string) => {
    const foundDeck = this.decks.find((deck) => deck.id === id);
    if (!foundDeck) return;
    foundDeck.name = newTitle;
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
