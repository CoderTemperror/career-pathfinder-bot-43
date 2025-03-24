import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from '@google/generative-ai';
import StorageService from './storage';

interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}

// Default configuration with the provided API key
const defaultConfig: GeminiConfig = {
  apiKey: 'AIzaSyA83FqsfRZI2S4_WGXjQ_lpVMKXUaKmFuw',
  model: 'gemini-2.0-flash',
  temperature: 0.4,
  maxOutputTokens: 2048,
};

const GEMINI_CONFIG_KEY = 'gemini_config';

class GeminiService {
  private config: GeminiConfig;
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    // Load configuration from storage or use default with API key
    const savedConfig = StorageService.get(GEMINI_CONFIG_KEY);
    this.config = savedConfig || { ...defaultConfig };
    
    // Ensure API key is set even if saved config exists
    if (!this.config.apiKey) {
      this.config.apiKey = defaultConfig.apiKey;
    }
    
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
      // Try to initialize with default API key if not initialized
      this.config.apiKey = defaultConfig.apiKey;
      this.initializeModel();
      
      // If still no model, throw error
      if (!this.model) {
        throw new Error('Gemini model not initialized properly.');
      }
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

  // API methods used by components
  public initialize(options: { apiKey?: string } = {}): void {
    // If no API key provided, use the default one
    const apiKey = options.apiKey || defaultConfig.apiKey;
    this.saveConfig({ apiKey });
  }

  public isInitialized(): boolean {
    return Boolean(this.model);
  }

  public async generateChatCompletion(
    messages: Array<{ role: string; content: string }>,
    options: { temperature?: number; max_tokens?: number } = {}
  ): Promise<string> {
    // Use the existing generateResponse method
    return this.generateResponse(messages);
  }
}

export default new GeminiService();
