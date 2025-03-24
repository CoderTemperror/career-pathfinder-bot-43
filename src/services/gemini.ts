
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from '@google/generative-ai';
import StorageService from './storage';

interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}

// Default configuration
const defaultConfig: GeminiConfig = {
  apiKey: '',
  model: 'gemini-1.0-pro',
  temperature: 0.7,
  maxOutputTokens: 2048,
};

const GEMINI_CONFIG_KEY = 'gemini_config';

class GeminiService {
  private config: GeminiConfig;
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    // Load configuration from storage or use default
    const savedConfig = StorageService.get(GEMINI_CONFIG_KEY);
    this.config = savedConfig || { ...defaultConfig };
    this.initializeModel();
  }

  private initializeModel() {
    if (!this.config.apiKey) return;

    try {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.config.model,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxOutputTokens,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
      this.genAI = null;
      this.model = null;
    }
  }

  public getConfig(): GeminiConfig {
    return { ...this.config };
  }

  public saveConfig(config: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...config };
    StorageService.set(GEMINI_CONFIG_KEY, this.config);
    this.initializeModel();
  }

  public async generateResponse(messages: Array<{ role: string; content: string }>, systemInstruction?: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini model not initialized. Please set up your API key.');
    }

    try {
      // Convert chat messages to Gemini format
      const history = messages.map(msg => {
        if (msg.role === 'user') {
          return {
            role: 'user',
            parts: [{ text: msg.content }],
          };
        } else {
          return {
            role: 'model',
            parts: [{ text: msg.content }],
          };
        }
      });

      // Start a chat session
      const chat = this.model.startChat({
        history: history.slice(0, -1) as any,
      });

      // Get the last message (current prompt)
      const lastMessage = messages[messages.length - 1];
      
      // Generate response
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response from Gemini:', error);
      throw error;
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.config.apiKey);
  }
}

export default new GeminiService();
