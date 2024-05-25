import { AxiosError } from "axios";
import { toast } from "sonner";
import { Card } from "../types";
import AuthService from "./AuthService";

class PracticeCardService {
  private static instance: PracticeCardService;
  private cards: Array<Card>;
  private subscribers: Array<PracticeCardChangeCallback>;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
    this.cards = [];
    this.subscribers = [];
  }

  public static getInstance(): PracticeCardService {
    if (PracticeCardService.instance === undefined)
      PracticeCardService.instance = new PracticeCardService();
    return PracticeCardService.instance;
  }

  public getCards(): Array<Card> {
    return this.cards;
  }

  public resetCards() {
    this.cards = [];
    this.notifySubscribers();
  }

  public async fetchDueCards(deck_id: number): Promise<Array<Card> | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<{ items: Array<Card> }>(`/decks/${deck_id}/due-cards`);
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

  public async setCardState(
    card_id: number,
    remembered: boolean
  ): Promise<void> {
    try {
      await this.authService
        .getAuthenticatedClient()
        .patch(`/cards/${card_id}/set-state`, { remembered });
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

  public subscribe(callback: PracticeCardChangeCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: PracticeCardChangeCallback) {
    const foundIndex = this.subscribers.indexOf(callback);
    this.subscribers.splice(foundIndex, 1);
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      callback(this.cards);
    });
  }
}

export type PracticeCardChangeCallback = (decks: Array<Card>) => void;

export default PracticeCardService;
