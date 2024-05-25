import AuthService from "./AuthService";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Language, Translation } from "../types/types";

class TranslationService {
  private static instance: TranslationService;
  private languages: Array<Language>;
  private subscribers: Array<LanguageListChangeCallback>;
  private authService: AuthService;
  private constructor() {
    this.authService = AuthService.getInstance();
    this.languages = [];
    this.subscribers = [];
    this.fetchLanguages();
  }

  public static getInstance(): TranslationService {
    if (TranslationService.instance === undefined)
      TranslationService.instance = new TranslationService();
    return TranslationService.instance;
  }

  public getLanguages(): Array<Language> {
    return this.languages;
  }

  public async fetchLanguages(): Promise<Array<Language> | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<{ items: Array<Language> }>("/languages");
      this.languages = res.data.items;
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

  async translateWord(
    word: string,
    targetLang: string
  ): Promise<Translation | null> {
    try {
      const res = await this.authService
        .getAuthenticatedClient()
        .get<Array<Translation>>(`/translate/${word}`, {
          params: {
            target_lang: targetLang,
          },
        });
      if (res.data && res.data.length > 0) {
        return res.data[0];
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
    return null;
  }

  public subscribe(callback: LanguageListChangeCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: LanguageListChangeCallback) {
    const foundIndex = this.subscribers.indexOf(callback);
    this.subscribers.splice(foundIndex, 1);
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      callback(this.languages);
    });
  }
}

export type LanguageListChangeCallback = (decks: Array<Language>) => void;

export default TranslationService;
