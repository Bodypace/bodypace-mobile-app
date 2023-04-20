import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { sizes, colors, globalStyles } from '../../utils'


export default function Group({ style, title, value = '', children }) {
  return (
    <View style={[styles.group, globalStyles.elevated, style]}>
      {(title !== undefined || !!value) &&
        <View style={globalStyles.spaced}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.title}>{value}</Text>
        </View>
      }
      {children}
    </View>
  )
}


const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.palette.white,
    margin: sizes.gap.mid,
    borderRadius: sizes.radius.mid,
    borderColor: colors.palette.silver,
  },
  title: {
    fontSize: sizes.font.medium,
    padding: sizes.gap.mid,
  },
})