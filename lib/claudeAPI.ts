import axios from "axios";

interface ClaudeResponse {
  completion: string;
}

class ClaudeApi {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.anthropic.com/v1/complete";
  }

  async generateCompletion(
    prompt: string,
    model: string = "claude-3-haiku-20240307"
  ): Promise<string> {
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
    };

    const data = {
      prompt,
      model,
      max_tokens_to_sample: 100,
      stop_sequences: ["\n"],
    };

    try {
      const response = await axios.post<ClaudeResponse>(this.apiUrl, data, {
        headers,
      });
      return response.data.completion;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

export default ClaudeApi;
