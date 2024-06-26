import React, { FC, useEffect, useId, useMemo, useRef } from 'react';
import { Dimensions, SectionList, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateTime } from 'luxon';

import CLText from './common/CLText';
import QuizListItem from './QuizListItem';
import { usePreventDoubleClick } from '../hooks/usePreventDoubleClick';
import useQuizBundle from '../hooks/useQuizBundle';
import { ScreenParamList } from '../routes/NavigationContainer';
import { useObserverStore } from '../stores/observer';
import { QuizBundle } from '../stores/quiz-bundle-list';
import { color } from '../styles/color';
import { ObserverKey, ScreenListScrollToTopObserverParams } from '../types';

type QuizRecordListProps = {};

const SCREEN_NAME = {
  again: 'QuizDetail',
  complete: 'RecordDetail',
} as const;

const SCREEN_HEIGHT = Dimensions.get('window').height;

const QuizRecordList: FC<QuizRecordListProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ScreenParamList>>();
  const { preventDoubleClick } = usePreventDoubleClick();
  const { quizBundleList, quizReset } = useQuizBundle({});
  const { add, remove } = useObserverStore();

  const sectionListRef = useRef<SectionList>(null);
  const cid = useId();

  // console.log('✅ QuizRecordList ', quizBundleList.length);

  const data = useMemo(
    () => [
      {
        title: `완료됨 (${quizBundleList.filter((q) => q.status === 'complete').length})`,
        data: quizBundleList
          .filter((q) => q.status === 'complete')
          // 최신순으로 정렬
          .sort((a, b) => {
            return (
              DateTime.fromISO(b.completedAt ?? '').toMillis() -
              DateTime.fromISO(a.completedAt ?? '').toMillis()
            );
          }),
      },
      {
        title: `다시 풀기 (${quizBundleList.filter((q) => q.status === 'again').length})`,
        data: quizBundleList
          .filter((q) => q.status === 'again')
          // 최신순으로 정렬
          .sort((a, b) => {
            return (
              DateTime.fromISO(b.createdAt ?? '').toMillis() -
              DateTime.fromISO(a.createdAt ?? '').toMillis()
            );
          }),
      },
    ],
    [quizBundleList],
  );

  const handlePressCategory = preventDoubleClick((quizBundle: QuizBundle) => {
    if (quizBundle.status === 'again') {
      quizReset({ id: quizBundle?.id ?? -1, type: 'again' });
    }

    navigation.push(SCREEN_NAME[quizBundle.status as 'again' | 'complete'], {
      quizBundleId: quizBundle.id,
    });
  });

  useEffect(() => {
    const observer = {
      id: cid,
      listener: (value: ScreenListScrollToTopObserverParams) => {
        if (value === 'RecordTab') {
          sectionListRef.current?.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            animated: true,
          });
        }
      },
    };
    add(ObserverKey.ScreenListScrollToTop, observer);
    return () => {
      remove(ObserverKey.ScreenListScrollToTop, observer.id);
    };
  }, [add, cid, remove]);

  return (
    <View>
      <SectionList
        ref={sectionListRef}
        sections={data}
        stickySectionHeadersEnabled={true}
        renderItem={({ item }) => {
          return (
            <QuizListItem
              quizBundleId={item.id}
              containerStyle={styles.listItem}
              onPress={() => {
                handlePressCategory(item);
              }}
            />
          );
        }}
        renderSectionHeader={({ section: { title } }) => {
          return (
            <View style={styles.header}>
              <CLText type="Body2">{title}</CLText>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default QuizRecordList;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: SCREEN_HEIGHT * 0.2,
  },

  header: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.GRAY_SCALE_2,
    fontSize: 32,
    backgroundColor: '#fff',
  },

  listItem: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
});
