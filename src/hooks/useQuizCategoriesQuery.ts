import { useSuspenseQuery } from '@tanstack/react-query';

import { getQuizCategories } from '../apis';
import { queryKey } from '../constants/queryKey';

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const useQuizCategoriesQuery = () => {
  const res = useSuspenseQuery({
    queryKey: queryKey.quizCategories(),
    queryFn: getQuizCategories,
    staleTime: DAY_IN_MILLISECONDS,
    gcTime: DAY_IN_MILLISECONDS,
    select: (data) => {
      return data.trivia_categories;
    },
  });

  return {
    ...res,
  };
};

export default useQuizCategoriesQuery;
