import React from "react";
import { StatusBar } from "expo-status-bar";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { WithFonts, ProvideThemes, ProvideDatabase, ProvideLegalAgreement } from './src/utils'
import Screens from "./src/ui/navigation";
import Welcome from "./src/ui/screens/welcome";
import { Screen } from "./src/ui/components";

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
