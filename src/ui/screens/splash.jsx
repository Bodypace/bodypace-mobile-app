import React from "react";
import { View, StyleSheet } from "react-native";
import { Logo } from '../components'


export default function Splash() {

  return (
    <View style={styles.screen}>
      <Logo />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})