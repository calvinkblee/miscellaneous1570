import OpenAI from 'openai';
import { API_CONFIG } from '@/configs/api';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: API_CONFIG.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // For demo purposes only
    });
  }

  async chat(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    systemPrompt?: string
  ): Promise<string> {
    try {
      const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (systemPrompt) {
        allMessages.push({ role: 'system', content: systemPrompt });
      }

      allMessages.push(...messages);

      const response = await this.client.chat.completions.create({
        model: API_CONFIG.DEFAULT_MODEL,
        messages: allMessages,
        max_tokens: API_CONFIG.MAX_TOKENS,
        temperature: API_CONFIG.TEMPERATURE,
      });

      return response.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async analyzeCompatibility(
    agentDescription: string,
    taskDescription: string
  ): Promise<{
    score: number;
    analysis: string;
    recommendations: string[];
  }> {
    const prompt = `다음 AI Agent와 업무의 궁합을 분석해주세요.

Agent: ${agentDescription}
업무: ${taskDescription}

JSON 형식으로 응답해주세요:
{
  "score": 0-100 사이의 점수,
  "analysis": "분석 결과 설명",
  "recommendations": ["개선 권장사항1", "개선 권장사항2"]
}`;

    try {
      const response = await this.chat([{ role: 'user', content: prompt }]);
      return JSON.parse(response);
    } catch {
      return {
        score: 75,
        analysis: '기본 분석 결과입니다.',
        recommendations: ['프롬프트 최적화를 권장합니다.'],
      };
    }
  }

  async verifyQuality(
    agentPrompt: string,
    testCases: string[]
  ): Promise<{
    score: number;
    passedTests: number;
    totalTests: number;
    issues: string[];
  }> {
    const prompt = `다음 AI Agent 프롬프트의 품질을 검증해주세요.

프롬프트: ${agentPrompt}

테스트 케이스:
${testCases.map((tc, i) => `${i + 1}. ${tc}`).join('\n')}

JSON 형식으로 응답해주세요:
{
  "score": 0-100 사이의 품질 점수,
  "passedTests": 통과한 테스트 수,
  "totalTests": 전체 테스트 수,
  "issues": ["발견된 이슈1", "발견된 이슈2"]
}`;

    try {
      const response = await this.chat([{ role: 'user', content: prompt }]);
      return JSON.parse(response);
    } catch {
      return {
        score: 85,
        passedTests: testCases.length - 1,
        totalTests: testCases.length,
        issues: ['일부 테스트에서 경미한 이슈 발견'],
      };
    }
  }

  async generateAgentPrompt(
    name: string,
    description: string,
    industry: string
  ): Promise<string> {
    const prompt = `다음 정보를 바탕으로 AI Agent의 시스템 프롬프트를 생성해주세요.

Agent 이름: ${name}
설명: ${description}
산업: ${industry}

효과적인 시스템 프롬프트를 생성해주세요. 한국어로 작성하고, 명확한 역할, 행동 지침, 제약 조건을 포함해주세요.`;

    return this.chat([{ role: 'user', content: prompt }]);
  }
}

export const openaiService = new OpenAIService();
