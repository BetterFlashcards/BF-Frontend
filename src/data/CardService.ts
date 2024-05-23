import { AxiosError } from "axios";
import { toast } from "sonner";
import { storeData } from "../helpers";
import { Card } from "../types";
import AuthService from "./AuthService";

class CardService {
  private static instance: CardService;
  private cards: Array<Card>;
  private subscribers: Array<CardChangeCallback>;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
    this.cards = [];
    this.subscribers = [];
  }

  public static getInstance(): CardService {
    if (CardService.instance === undefined)
      CardService.instance = new CardService();
    return CardService.instance;
  }

  public getCards(): Array<Card> {
    return this.cards;
  }

  public resetCards() {
    this.cards = [];
  }

  public async createCard(
    deck_id: number,
    front_text: string,
    back_text: string
  ): Promise<Card | null> {
    const data = {
      front_text,
      back_text,
    };
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .post<Card>(`/decks/${deck_id}/cards`, data);
      const newCard = res.data;
      this.cards.push(newCard);
      this.notifySubscribers();
      toast.success("Flashcard created successfully!");
      return newCard;
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        const msg = axiosError.response?.data.detail;
        toast.error(msg);
      } else {
        toast.error(error as string);
      }
      return null;
    }
  }

  public async fetchCards(deck_id: number): Promise<Array<Card> | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<{ items: Array<Card> }>(`/decks/${deck_id}/cards`);
      this.cards = res.data.items;
      this.notifySubscribers();
      return res.data.items;
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        const msg = axiosError.response?.data.detail;
        toast.error(msg);
      } else {
        toast.error(error as string);
      }
    }
    return null;
  }

  public async deleteCard(deck_id: number, card_id: number): Promise<void> {
    try {
      await this.authService
        .getAuthenticatedClient()
        .delete(`/decks/${deck_id}/cards/${card_id}`);

      const foundIndex = this.cards.findIndex((card) => card.id === card_id);
      this.cards.splice(foundIndex, 1);
      this.notifySubscribers();
      toast.success("Card deleted successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        const msg = axiosError.response?.data.detail;
        toast.error(msg);
      } else {
        toast.error(error as string);
      }
    }
  }

  public updateCard(id: number, front_text: string, back_text: string) {
    const foundCard = this.cards.find((card) => card.id == id);
    if (foundCard) {
      foundCard.front_text = front_text;
      foundCard.back_text = back_text;
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
    storeData("cards", this.cards);
    this.subscribers.forEach((callback) => {
      callback(this.cards);
    });
  }
}

export type CardChangeCallback = (decks: Array<Card>) => void;

export default CardService;
