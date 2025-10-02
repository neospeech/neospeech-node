declare module 'neospeech-io' {
  export class NeoSpeechError extends Error {
    code: string;
    status: number;
    retryable: boolean;

    constructor(message: string, code: string, status: number, retryable?: boolean);

    isClientError(): boolean;
    isServerError(): boolean;
    isRateLimitError(): boolean;
    isAuthError(): boolean;
  }

  export interface SpeechOptions {
    input: string;
    voice: string;
    model?: 'aurora-4' | 'aurora-3.5' | 'aurora-3' | 'turbo-3' | 'mini-2';
    pitch?: string;
    style?: string;
    styleDegree?: string;
    lang?: string;
  }

  export interface StreamOptions {
    input: string;
    voice: string;
    model?: 'aurora-4' | 'aurora-3.5' | 'aurora-3' | 'turbo-3' | 'mini-2';
    pitch?: string;
    style?: string;
    styleDegree?: string;
    lang?: string;
  }

  export interface VoiceFilters {
    gender?: 'male' | 'female';
    locale?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }

  export interface Voice {
    id: string;
    name: string;
    gender: string;
    locale: string;
    language: string;
    mp3_preview?: string;
    tags?: string[];
  }

  export interface Pagination {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  }

  export interface VoicesResponse {
    voices: Voice[];
    pagination: Pagination;
    filters_applied: {
      gender: string | null;
      locale: string | null;
      search: string | null;
    };
  }

  export interface ModelSpecifications {
    format: string;
    channels: string;
    sample_rate: string;
    bitrate: string;
  }

  export interface Model {
    name: string;
    shortname: string;
    description: string;
    quality: string;
    output_format: string;
    specifications: ModelSpecifications;
    use_cases: string[];
    avg_latency_ms?: number;
    is_default: boolean;
  }

  export interface ModelsResponse {
    models: Model[];
    total: number;
    default_model: string;
  }

  export interface BalanceInfo {
    total_credits: number;
    used_credits: number;
    remaining_credits: number;
    overage_characters?: number;
    overage_amount_usd?: number;
  }

  export interface PlanInfo {
    type: string;
    next_reset: string | null;
  }

  export interface UsageSummary {
    total_characters_used: number;
    current_period_usage: number;
    overage_rate_per_1000: number;
  }

  export interface BalanceResponse {
    balance: BalanceInfo;
    plan: PlanInfo;
    usage_summary: UsageSummary;
  }

  export class Audio {
    speech(options: SpeechOptions): Promise<ArrayBuffer>;
    stream(options: StreamOptions): Promise<ReadableStream<Uint8Array>>;
  }

  export class Voices {
    list(filters?: VoiceFilters): Promise<VoicesResponse>;
  }

  export class Models {
    list(): Promise<ModelsResponse>;
  }

  export class Balance {
    get(): Promise<BalanceResponse>;
  }

  export interface NeoSpeechOptions {
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
  }

  export default class NeoSpeech {
    audio: Audio;
    voices: Voices;
    models: Models;
    balance: Balance;

    constructor(apiKey: string, options?: NeoSpeechOptions);
  }

  export { NeoSpeech };
}
