const API_BASE_URL = 'http://localhost:3001';

export type ComplexityLevel = 'eli5' | 'eli10' | 'eli15' | 'summary';

export interface ELI5Response {
  success: boolean;
  explanation: string;
  complexity: ComplexityLevel;
  originalLength: number;
  explanationLength: number;
}

export interface ELI5Error {
  error: string;
}

export async function getELI5Explanation(
  text: string,
  complexity: ComplexityLevel = 'eli5'
): Promise<ELI5Response> {
  if (!text.trim()) {
    throw new Error('Please provide some text to explain');
  }

  if (text.length > 10000) {
    throw new Error('Text is too long. Maximum 10,000 characters.');
  }

  const response = await fetch(`${API_BASE_URL}/api/eli5`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, complexity }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ELI5Error).error || 'Failed to get explanation');
  }

  return data as ELI5Response;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
