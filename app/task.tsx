import { SafeAreaView, Text } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import React from 'react';
import { useRouter } from 'expo-router';
import styles from '@/assets/styles';
import theme from '@/config/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_APPBAR_HEIGHT = 80;
const MEDIUM_FAB_HEIGHT = 56;

const Task = () => {
    const router = useRouter();
    const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar.Header mode='small' style={styles.appbar}>
            <Appbar.BackAction onPress={() => router.back()}/>
            <Appbar.Content title="Tarefa" />
            <Appbar.Action icon={"bell"}/>
        </Appbar.Header>
      <Text>Task</Text>
      <Appbar style={{ height: BOTTOM_APPBAR_HEIGHT + bottom, position: 'absolute', bottom: 0, left: 0, right: 0 }} safeAreaInsets={{ bottom }}>
      <Appbar.Action icon="archive" onPress={() => {}} />
      <Appbar.Action icon="tag" onPress={() => {}} />
      <Appbar.Action icon="delete" onPress={() => {}} />
      <FAB
        mode="flat"
        size="medium"
        icon="plus"
        onPress={() => {}}
        style={[
          { top: (BOTTOM_APPBAR_HEIGHT - MEDIUM_FAB_HEIGHT) / 2, position: 'absolute', right: 16 }
        ]}
      />
      </Appbar>
    </SafeAreaView>
  )
}

export default Task