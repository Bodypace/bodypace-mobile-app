import React from "react"
import { Text, StyleSheet } from "react-native"
import { sizes } from "../../utils";


export function Title({ style, children }) {
  return (
    <Text style={[styles.text, style]}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    margin: sizes.gap.big,
    fontSize: sizes.font.big,
  }
})