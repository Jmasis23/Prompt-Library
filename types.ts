export interface PromptItem {
  id: string;
  act: string;
  prompt: string;
  for_devs: boolean;
  type: 'TEXT' | 'IMAGE' | 'STRUCTURED' | string;
  contributor: string;
}

export type FilterType = 'ALL' | 'TEXT' | 'IMAGE' | 'STRUCTURED';

export interface PromptStats {
  total: number;
  devFocused: number;
  contributors: number;
}
