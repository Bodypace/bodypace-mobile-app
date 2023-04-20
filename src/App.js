import React from "react";
import { StatusBar } from "expo-status-bar";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { WithFonts, ProvideThemes, ProvideDatabase, ProvideLegalAgreement } from './utils'
import Screens from "./ui/navigation";
import Welcome from "./ui/screens/welcome";
import { Screen } from "./ui/components";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <WithFonts Placeholder={Screen}>
      <ProvideLegalAgreement>
        <ProvideDatabase>
          <ProvideThemes>
            <Welcome>
              <Screens navigator={Tab} />
            </Welcome>
            <StatusBar style="dark" />
          </ProvideThemes>
        </ProvideDatabase>
      </ProvideLegalAgreement>
    </WithFonts>
  );
}
