import { ScreenParamList } from '../routes/NavigationContainer';

export type QuizCategory = {
  id: number;
  name: string;
};

export type QuizCategoryResponse = {
  trivia_categories: QuizCategory[];
};

export type Quiz = {
  type: 'multiple' | 'boolean'; // multiple 만 사용
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type QuizResponse = {
  response_code: 0 | 1 | 2 | 3 | 4 | 5;
  results: Quiz[];
};

export enum ObserverKey {
  QuizRefetchCall = 'quiz-refetch-call',
  ScreenListScrollToTop = 'screen-list-scroll-to-top',
}

export type ScreenListScrollToTopObserverParams = keyof ScreenParamList;
