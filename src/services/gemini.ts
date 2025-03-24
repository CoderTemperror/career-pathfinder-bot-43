
import { GoogleGenerativeAI } from "@google/generative-ai";

interface GeminiConfigOptions {
  apiKey: string;
}

class GeminiService {
  private static instance: GeminiService;
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public initialize(options: GeminiConfigOptions): void {
    this.apiKey = options.apiKey;
    this.client = new GoogleGenerativeAI(this.apiKey);
  }

  public isInitialized(): boolean {
    return !!this.client && !!this.apiKey;
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public async generateChatCompletion(
    messages: Array<{ role: string; content: string }>,
    options: {
      temperature?: number;
      max_tokens?: number;
    } = {}
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini client not initialized. Call initialize() first.');
    }

    const { 
      temperature = 0.7, 
      max_tokens = 500 
    } = options;

    try {
      // Convert the OpenAI-style messages format to Gemini format
      const geminiMessages = messages.map(msg => {
        // Gemini uses "user" and "model" roles
        const role = msg.role === 'assistant' ? 'model' : 'user';
        return { role, parts: [{ text: msg.content }] };
      });

      // Filter out system messages as Gemini doesn't support them directly
      const filteredMessages = geminiMessages.filter(msg => msg.role !== 'system');

      // Get the system message if it exists
      const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';

      // Create the Gemini model
      const model = this.client.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemMessage,
      });

      // Create a chat session
      const chat = model.startChat({
        history: filteredMessages,
        generationConfig: {
          temperature,
          maxOutputTokens: max_tokens,
        },
      });

      // Generate a response
      const result = await chat.sendMessage("");
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Gemini chat completion:', error);
      throw error;
    }
  }
}

export default GeminiService.getInstance();
