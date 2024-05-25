import { Deck } from "../types";
import AuthService from "./AuthService";
import { AxiosError } from "axios";
import { toast } from "sonner";

class DeckService {
  private static instance: DeckService;
  private decks: Array<Deck>;
  private subscribers: Array<ChangeCallback>;
  private authService: AuthService;
  private constructor() {
    this.authService = AuthService.getInstance();
    this.decks = [];
    this.subscribers = [];
  }

  public static getInstance(): DeckService {
    if (DeckService.instance === undefined)
      DeckService.instance = new DeckService();
    return DeckService.instance;
  }

  public getDecks(): Array<Deck> {
    return this.decks;
  }

  public getDeckById(id: number): Deck | undefined {
    return this.decks.find((item) => item.id === id);
  }

  public async createDeck(data: {
    name: string;
    language: string;
  }): Promise<Deck | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .post<Deck>("/decks", data);

      this.decks.push(res.data);
      toast.success("Deck created successfully!");
      return res.data;
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

  public async updateDeck(data: Deck): Promise<Deck | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .put<Deck>("/decks/" + data.id, {
          name: data.name,
          language: data.language,
        });
      let index = this.decks.findIndex((deck) => deck.id === data.id);
      this.decks[index] = res.data;
      console.log(this.decks);
      this.notifySubscribers();
      toast.success("Deck updated successfully!");
      return res.data;
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

  public async fetchDecks(): Promise<Array<Deck> | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<{ items: Array<Deck> }>("/decks");
      this.decks = res.data.items;
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

  public async fetchDeckById(id: number): Promise<Deck | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<Deck>("/decks/" + id);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ detail: string }>;
        console.error(axiosError);
      } else {
        console.error(error as string);
      }
    }
    return null;
  }

  public async deleteDeck(id: number): Promise<void> {
    try {
      await this.authService.getAuthenticatedClient().delete("/decks/" + id);
      const foundIndex = this.decks.findIndex((deck) => deck.id === id);
      this.decks.splice(foundIndex, 1);
      this.notifySubscribers();
      toast.success("Deck deleted successfully!");
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

export default DeckService;
