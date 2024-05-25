import { AxiosError } from "axios";
import { toast } from "sonner";
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
    back_text: string,
    draft: boolean = false
  ): Promise<Card | null> {
    const data = {
      front_text,
      back_text,
      draft,
    };
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .post<Card>(`/decks/${deck_id}/cards`, data);
      const newCard = res.data;
      this.cards.push(newCard);
      this.notifySubscribers();
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

  public async deleteCard(card_id: number): Promise<boolean> {
    try {
      await this.authService
        .getAuthenticatedClient()
        .delete(`/cards/${card_id}`);

      const foundIndex = this.cards.findIndex((card) => card.id === card_id);
      this.cards.splice(foundIndex, 1);
      this.notifySubscribers();
      toast.success("Card deleted successfully!");
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        const msg = axiosError.response?.data.detail;
        toast.error(msg);
      } else {
        toast.error(error as string);
      }
      return false;
    }
  }

  public async updateCard(
    deck_id: number,
    card_id: number,
    front_text: string,
    back_text: string,
    draft: boolean = false
  ): Promise<Card | null> {
    const data = {
      front_text,
      back_text,
      draft,
    };
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .put<Card>(`/decks/${deck_id}/cards/${card_id}`, data);
      const updatedCard = res.data;

      const foundIndex = this.cards.findIndex((card) => card.id === card_id);
      if (foundIndex !== -1) {
        this.cards[foundIndex] = updatedCard;
        this.notifySubscribers();
      }
      return updatedCard;
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

export default CardService;
