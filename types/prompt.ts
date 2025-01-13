export interface OptimizedPrompt {
  content: string
  originalPrompt: string
  version: number
  model?: string
}

export interface TestResult {
  input: string
  output: string
  model: string
}

