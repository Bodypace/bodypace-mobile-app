import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native';
import { colors } from '../../utils';

export default function Screen({ style, children }) {
  return (
    <View style={styles.screen}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.screen.background,
  },
  container: {
    flex: 1,
  }
})