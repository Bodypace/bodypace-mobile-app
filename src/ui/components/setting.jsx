import React from "react";
import { View, Pressable, Text, TextInput, StyleSheet } from "react-native";
import { sizes, colors, globalStyles, useDatabase } from "../../utils"
import Icon from "./icon";


export const Editable = ({ style, children, input, setInput, postfix, ktype = 'numeric' }) => {
  const inputRef = React.useRef(null)
  const focus = () => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }

  return (
    <Pressable style={style} onPress={focus}>
      <Text style={styles.text}>{children}</Text>
      {/* TODO: on keyboard close trigger lose focucs */}
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          ref={inputRef}
          value={input}
          onChangeText={setInput}
          keyboardType={ktype}
        />
        {postfix !== undefined &&
          <Text style={styles.text}>{postfix}</Text>
        }
      </View>
    </Pressable>
  );
}

const EditableSetting = ({ children, name, postfix }) => {
  const database = useDatabase();
  const setting = database[name];

  // TODO: this is too much of code for storing and updating value.
  // database util should be already smooth so that this is not required
  // and here using only setting and database.setSetting should be enough without flickering
  const [input, setInput] = React.useState(String(setting))

  React.useEffect(() => {
    if (String(input) !== String(setting)) setInput(String(setting))
  }, [setting])

  React.useEffect(() => {
    if (String(input) !== String(setting)) database.setGlassSize(Number(input))
  }, [input])

  return (
    <Editable
      style={[styles.setting, globalStyles.spaced]}
      children={children}
      input={input}
      setInput={setInput}
      postfix={postfix}
    />
  )
}

export default function Setting({ children, name = null, postfix, onPress}) {
  if (name === null) {
    return (
      <Pressable onPress={onPress}>
        <Text style={styles.setting}>{children}</Text>
      </Pressable>
    )
  }

  return <EditableSetting children={children} name={name} postfix={postfix} />
}

const styles = StyleSheet.create({
  setting: {
    fontSize: sizes.font.idk,
    margin: sizes.gap.big,
    padding: sizes.gap.large,
    backgroundColor: colors.palette.anti_flash_white,
    borderRadius: sizes.radius.mid,
  },
  text: {
    // TODO: TextInput changes the height of value text and thus we need to center
    // "label" (text on the left)
    // because of that EditableSettings are taller than "name === null" settings.
    // figure out how to make TextInput shorter (if possible) to unify all settings height.
    textAlignVertical: 'center',
  },
})
