import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Screen, Logo, Title, Paragraphs, Button, LegalNote } from "../components";
import { useLegalAgreement, langEn, logger } from "../../utils";
import Splash from "./splash";


export default function WelcomeScreen({ children }) {
  const { accepted, accept } = useLegalAgreement()
  const [selected, setSelected] = useState(null)

  const confirm = () => {
    selected === null
      ? accept()
      : setSelected(null)
  }

  logger.info('accepted: ', accepted)

  if (accepted === null) return <Splash />;
  if (accepted) return children;

  const lang = langEn.screen.welcome;

  return (
    <Screen style={styles.screen}>
      <Logo />
      <Title>{lang.title}</Title>
      <Paragraphs paragraphs={lang[selected] || lang.message} />
      <Button style={styles.button} onPress={confirm} disable={selected !== null}>
        {selected ? 'Go back' : 'Continue'}
      </Button>
      <LegalNote onPress={setSelected} highlight={selected} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
  },
  button: {
    width: '80%',
  }
})