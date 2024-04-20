import React, { FC, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import CLText from './common/CLText';
import QuizTimer from './QuizTimer';
import { QuizBundle } from '../stores/quiz-bundle-list';
import { color } from '../styles/color';

type QuizContentContainerProps = {
  quizBundle?: QuizBundle;
  selectedIndex: number | null;
  seconds: number;
  isActive: boolean;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  onChangeSelectedIndex: (index: number | null) => void;
};

const QUIZ_DIFFICULTY = {
  easy: '쉬움 😄',
  medium: '보통 🙂',
  hard: '어려움 😟',
} as const;

const SelectButton: FC<{
  selected: boolean;
  disabled: boolean;
  answered: boolean;
  text: string;
  onPress: () => void;
}> = ({ selected, disabled, answered, text, onPress }) => {
  const borderColor = useMemo(() => {
    if (disabled) {
      if (selected) {
        return answered ? color.BLUE : color.RED;
      } else {
        return answered ? color.BLUE : color.GRAY_SCALE_2;
      }
    } else {
      return selected ? color.BLUE : color.GRAY_SCALE_2;
    }
  }, [answered, disabled, selected]);

  const textColor = useMemo(() => {
    if (disabled) {
      if (selected) {
        return answered ? color.BLUE : color.RED;
      } else {
        return answered ? color.BLUE : color.GRAY_SCALE_3;
      }
    } else {
      return selected ? color.BLUE : color.GRAY_SCALE_6;
    }
  }, [answered, disabled, selected]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.selectButton,
        {
          borderColor: borderColor,
        },
      ]}>
      <CLText type="Body2" color={textColor}>
        {text}
      </CLText>
    </TouchableOpacity>
  );
};

const QuizContentContainer: FC<QuizContentContainerProps> = ({
  quizBundle,
  selectedIndex,
  seconds,
  isActive,
  setSeconds,
  onChangeSelectedIndex,
}) => {
  const focusedQuiz = quizBundle?.quizzes[quizBundle.currentQuizzesIndex];
  const isSuccess = focusedQuiz?.selectedIndex === focusedQuiz?.answerIndex;

  if (!quizBundle) {
    return <></>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <QuizTimer seconds={seconds} isActive={isActive} setSeconds={setSeconds} />

      <View style={styles.infoBox}>
        <CLText type="Body4" color={color.GRAY_SCALE_5}>
          문제 {(quizBundle?.currentQuizzesIndex ?? 0) + 1}
        </CLText>
        <CLText type="Body4" color={color.GRAY_SCALE_5}>
          난이도 :{' '}
          {focusedQuiz?.origin.difficulty && QUIZ_DIFFICULTY[focusedQuiz?.origin.difficulty]}
        </CLText>
      </View>

      <CLText type="H4" color={color.GRAY_SCALE_7} mt={20} ml={24} mr={24}>
        {focusedQuiz?.origin.question}
      </CLText>

      <View style={styles.optionBox}>
        {focusedQuiz?.options.map((option, index) => {
          return (
            <SelectButton
              key={`quiz-option-${index}`}
              selected={selectedIndex === index}
              disabled={focusedQuiz.selectedIndex !== null}
              answered={focusedQuiz?.answerIndex === index}
              text={`${index + 1}. ${option}`}
              onPress={() => onChangeSelectedIndex(index)}
            />
          );
        })}
      </View>

      {focusedQuiz?.selectedIndex !== null && (
        <View style={styles.resultBox}>
          <CLText type="Body4" color={color.GRAY_SCALE_7}>
            {isSuccess ? '✅ 정답입니다! 👏' : '❌ 틀렸습니다! 😭'}
          </CLText>

          {isSuccess ? (
            <CLText type="Body4" color={color.BLUE}>
              정답 {(focusedQuiz?.answerIndex ?? 0) + 1}번
            </CLText>
          ) : (
            <CLText type="Body4" color={color.RED}>
              선택한 답 {(focusedQuiz?.selectedIndex ?? 0) + 1}번{'  '}
              <CLText type="Body4" color={color.BLUE}>
                정답 {(focusedQuiz?.answerIndex ?? 0) + 1}번
              </CLText>
            </CLText>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default QuizContentContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.WHITE,
  },
  contentContainer: {},
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  optionBox: {
    gap: 12,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  selectButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: color.WHITE,
    borderWidth: 2,
  },

  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 24,
  },
});
