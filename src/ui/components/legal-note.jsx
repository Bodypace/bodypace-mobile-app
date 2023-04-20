import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { langEn, sizes, colors, globalStyles } from "../../utils"


const Link = ({ children, onPress, highlight }) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.link, highlight && globalStyles.selectedLink]}>
        {children}
      </Text>
    </Pressable>
  )
}

export function LegalNote({ onPress, highlight = null }) {
  const lang = langEn.components.legalNote

  return (
    <>
      <Text style={styles.text}>{lang.title}</Text>
      <View style={styles.links}>
        <Link
          onPress={() => onPress('toc')}
          highlight={highlight === 'toc'}
        >
          {lang.toc}
        </Link>
        <Text style={styles.text}>{lang.and}</Text>
        <Link
          onPress={() => onPress('priv')}
          highlight={highlight === 'priv'}
        >
          {lang.priv} 
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    marginBottom: sizes.gap.big,
  },
  text: {
    textAlign: 'center',
    color: colors.palette.grey,
    marginHorizontal: sizes.gap.small,
  },
  link: {
    textDecorationLine: 'underline'
  },
})