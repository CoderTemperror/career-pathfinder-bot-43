
import OpenAI from 'openai';

interface OpenAIConfigOptions {
  apiKey: string;
}

class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI | null = null;
  private apiKey: string | null = null;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public initialize(options: OpenAIConfigOptions): void {
    this.apiKey = options.apiKey;
    this.client = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
    });
  }

  public isInitialized(): boolean {
    return !!this.client && !!this.apiKey;
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public async generateChatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    } = {}
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Call initialize() first.');
    }

    const { 
      model = 'gpt-4o-mini', 
      temperature = 0.7, 
      max_tokens = 500 
    } = options;

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens,
      });

      return response.choices[0]?.message?.content || 'No response generated.';
    } catch (error) {
      console.error('Error generating chat completion:', error);
      throw error;
    }
  }
}

export default OpenAIService.getInstance();
