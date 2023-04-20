import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { sizes, colors, globalStyles } from "../../utils"


function ButtonUnstyled({ style, onPress, children }) {
  return (
    <Pressable style={style} onPress={onPress}>
      <Text style={styles.text}>
        {children}
      </Text>
    </Pressable>
  )
}

export function Button({ style, onPress, disable, children }) {
  const disabled = !!disable ? styles.disabled : undefined

  return (
    <ButtonUnstyled
      style={[styles.button, globalStyles.elevated, disabled, style]}
      onPress={onPress}
    >
      {children}
    </ButtonUnstyled>
  )
}


const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: sizes.gap.big,
    padding: sizes.gap.big,
    borderRadius: sizes.radius.mid,
    backgroundColor: colors.palette.heart_4,
  },
  disabled: {
    backgroundColor: colors.palette.silver,
  },
  text: {
    fontSize: sizes.font.small,
  },
})