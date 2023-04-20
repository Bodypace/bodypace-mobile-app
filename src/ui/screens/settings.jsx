import React from "react";
import { ScrollView, View, Text } from "react-native";
import { Screen, Logo, Group, Setting, Modal, Button, Title, Paragraphs } from "../components"
import { sizes, langEn, useLegalAgreement } from '../../utils'


export default function Settings() {
  // const { decline } = useLegalAgreement();
  const langDocs = langEn.documents;
  const lang = langEn.screen.settings;

  const [textToDisplay, setTextToDisplay] = React.useState(null)

  return (
    <>
      <Screen>
        <Logo />
        <ScrollView>
          {/* <Group title={lang.appearance}>
          <Setting>{lang.language}</Setting>
          <Setting>{lang.theme}</Setting>
        </Group> */}
          <Group title={lang.servings}>
            <Setting name="glassSize" postfix=" ml">{lang.glass_size}</Setting>
          </Group>
          <Group title={lang.agreements}>
            <Setting onPress={() => setTextToDisplay('toc')}>{lang.toc}</Setting>
            <Setting onPress={() => setTextToDisplay('priv')}>{lang.priv}</Setting>
            {/* <Setting onPress={() => setTextToDisplay('licenses')}>{lang.licenses}</Setting> */}
            {/* <Button onPress={decline}>Logout</Button> */}
          </Group>
          <Group title={lang.notes}>
            <Setting onPress={() => setTextToDisplay('message')}>{lang.early_release_notes}</Setting>
          </Group>
          {/* TOOD: fix ScrollView or smth else so below is not necessary for last shadow to work*/}
          <View style={{ height: sizes.gap.mid }} />
        </ScrollView>
      </Screen>
      <Modal visible={!!textToDisplay} onClose={() => setTextToDisplay(null)}>
        <Title style={{marginHorizontal: 20}}>{langDocs.title}</Title>
        <Paragraphs paragraphs={langDocs[textToDisplay]} />
        <Button onPress={() => setTextToDisplay(null)}>
          Close
        </Button>
      </Modal>
    </>
  );
}