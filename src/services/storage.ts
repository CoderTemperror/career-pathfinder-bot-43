
export interface StorageService {
  saveAssessmentData(data: Record<string, any>): void;
  getAssessmentData(): Record<string, any> | null;
  clearAssessmentData(): void;
  saveChatHistory(messages: any[]): void;
  getChatHistory(): any[] | null;
  clearChatHistory(): void;
  get(key: string): any | null;
  set(key: string, data: any): void;
}

class LocalStorageService implements StorageService {
  private readonly ASSESSMENT_KEY = 'career_assessment_data';
  private readonly CHAT_HISTORY_KEY = 'career_chat_history';

  public saveAssessmentData(data: Record<string, any>): void {
    localStorage.setItem(this.ASSESSMENT_KEY, JSON.stringify(data));
  }

  public getAssessmentData(): Record<string, any> | null {
    const data = localStorage.getItem(this.ASSESSMENT_KEY);
    return data ? JSON.parse(data) : null;
  }

  public clearAssessmentData(): void {
    localStorage.removeItem(this.ASSESSMENT_KEY);
  }

  public saveChatHistory(messages: any[]): void {
    localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(messages));
  }

  public getChatHistory(): any[] | null {
    const history = localStorage.getItem(this.CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : null;
  }

  public clearChatHistory(): void {
    localStorage.removeItem(this.CHAT_HISTORY_KEY);
  }

  // Generic methods for storing and retrieving any data
  public get(key: string): any | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  public set(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export default new LocalStorageService();
