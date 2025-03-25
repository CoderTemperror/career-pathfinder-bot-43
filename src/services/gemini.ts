
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
  model: 'gemini-2.0-flash',  // Make sure to use the correct model name
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

    // IMPORTANT: Ensure the model is ALWAYS gemini-2.0-flash, overriding any saved value
    this.config.model = defaultConfig.model;
    
    this.initializeModel();
  }

  private initializeModel() {
    if (!this.config.apiKey) return;

    try {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      console.log(`Initializing model: ${this.config.model}`); 
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
    // IMPORTANT: Always ensure the model is gemini-2.0-flash
    config.model = defaultConfig.model;
    
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
      // Extract the user prompt (last message with role 'user')
      const userMessage = messages.find(m => m.role === 'user');
      if (!userMessage) {
        throw new Error('No user message found');
      }
      const userPrompt = userMessage.content;
      
      // Combine system instruction with user prompt if provided
      let prompt = userPrompt;
      if (systemInstruction) {
        prompt = `${systemInstruction}\n\nUser query: ${userPrompt}`;
        console.log("Using system instruction with prompt");
      }

      // Generate response using the content generation API
      console.log(`Using model: ${this.config.model}`);
      const result = await this.model.generateContent(prompt);
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
    try {
      // Extract the user message and system message
      const userMessage = messages.find(msg => msg.role === 'user');
      if (!userMessage) {
        throw new Error('No user message found in the conversation');
      }
      
      const systemMessage = messages.find(msg => msg.role === 'system');
      
      // Use the generateResponse method with extracted messages
      return this.generateResponse([userMessage], systemMessage?.content);
    } catch (error) {
      console.error('Error in generateChatCompletion:', error);
      throw error;
    }
  }
}

export default new GeminiService();
