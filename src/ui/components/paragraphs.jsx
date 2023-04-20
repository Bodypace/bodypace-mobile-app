import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { paragraphTypes as types, sizes, colors } from "../../utils";


function Entry({ type, data }) {
  const style = type === types.title ?
    styles.title : type === types.header ?
      styles.header :
      styles.paragraph;

  if (type === types.list) {
    return (<>{
      data.map(item => <Text key={item} style={styles.paragraph}> * {item}</Text>)
    }</>)
  }

  return <Text style={style}>{data}</Text>
}

export function Paragraphs({paragraphs}) {
  return (
    <ScrollView style={styles.body}>
      {paragraphs.map(([a, b]) => (
        <Entry key={b} type={a} data={b} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  body: {
    margin: sizes.gap.large,
    borderTopWidth: sizes.gap.line,
    borderBottomWidth: sizes.gap.line,
    borderColor: colors.palette.heart_2,
  },
  title: {
    fontSize: sizes.font.big,
    marginTop: sizes.gap.small,
  },
  header: {
    fontSize: sizes.font.medium,
    marginTop: sizes.gap.mid,
  },
  paragraph: {
    fontSize: sizes.font.small,
    marginTop: sizes.gap.big,
    color: colors.palette.grey,
  },
})