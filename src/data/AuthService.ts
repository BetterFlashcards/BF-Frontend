import { toast } from "sonner";
import { deleteLocalData, getLocalData, storeData } from "../helpers";
import { User } from "../types/types";
import axios, { AxiosError, AxiosInstance } from "axios";
import Client from "./AxiosClient";

class AuthService {
  private userKey = "user";
  private refreshTokenKey = "refreshToken";
  private static instance: AuthService;
  private user: User | null;
  private subscribers: Array<UserChangeCallback>;
  private refreshToken: string | null;
  private accessToken: string | null = null;
  private authenticatedClient: AxiosInstance;
  private constructor() {
    const storedUser = getLocalData<User>(this.userKey);
    const storeRefreshToken = getLocalData<string>(this.refreshTokenKey);
    this.refreshToken = storeRefreshToken;
    this.user = storedUser;
    this.subscribers = [];

    this.authenticatedClient = axios.create({
      ...Client.defaults,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    this.authenticatedClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark request as retried to prevent infinite loops
          await this.refresh();
          originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.authenticatedClient(originalRequest); // Retry the request with new access token
        }
        return Promise.reject(error);
      }
    );
  }

  public getAuthenticatedClient(): AxiosInstance {
    return this.authenticatedClient;
  }

  public static getInstance(): AuthService {
    if (AuthService.instance === undefined)
      AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  private setUser(user: User | null) {
    this.user = user;
    if (!user) {
      deleteLocalData(this.userKey);
    } else storeData(this.userKey, user);
    this.notifySubscribers();
  }

  public getUser(): User | null {
    return this.user;
  }

  private setRefreshToken(token: string | null) {
    this.refreshToken = token;
    if (!token) deleteLocalData(this.refreshTokenKey);
    else storeData(this.refreshTokenKey, token);
  }

  private setAccesToken(token: string | null) {
    this.accessToken = token;
    this.authenticatedClient.defaults.headers.Authorization = `Bearer ${this.accessToken}`;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public async register(username: string, password: string): Promise<boolean> {
    const data = { username, password };
    try {
      const res = await Client.post<{
        refresh: string;
        access: string;
      }>("/user/register", data);
      if (res.status === 200) {
        this.setRefreshToken(res.data.refresh);
        this.setAccesToken(res.data.access);
        this.setUser({ username });
        toast.success("Successful registration!");
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

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await Client.post<{
        username: string;
        refresh: string;
        access: string;
      }>("/token/pair", {
        username,
        password,
      });
      this.setRefreshToken(res.data.refresh);
      this.setAccesToken(res.data.access);
      this.setUser({ username });
      toast.success("Successful login!");
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

  public logout(): void {
    this.setRefreshToken(null);
    this.setAccesToken(null);
    this.setUser(null);
    toast.success("Logged out");
  }

  public async refresh() {
    try {
      const res = await Client.post<{
        refresh: string;
        access: string;
      }>("/token/refresh", {
        refresh: this.refreshToken,
      });
      this.setAccesToken(res.data.access);
    } catch {
      this.setAccesToken(null);
      this.setRefreshToken(null);
      this.setUser(null);
      toast.error("Session expired!");
    }
  }

  public subscribe(callback: UserChangeCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: UserChangeCallback) {
    const foundIndex = this.subscribers.indexOf(callback);
    this.subscribers.splice(foundIndex, 1);
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      callback(this.user);
    });
  }
}

export type UserChangeCallback = (user: User | null) => void;

export default AuthService;