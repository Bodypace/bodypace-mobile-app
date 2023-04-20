import { StyleSheet } from "react-native";
import { palette } from "./theme/palette";
import { sizes } from "./theme/sizes";

export const theme = {
  sizes,
  colors: {
    palette,
    screen: {
      background: palette.white
    }
  }
};

export const globalStyles = StyleSheet.create({
  selectedLink: {
    color: palette.heart_3,
    fontWeight: 'bold',
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  spaced: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flex: {
    flex: 1,
  },
  productButton: {
    alignItems: 'center',
    fontSize: sizes.font.idk,
    margin: sizes.gap.mid,
    padding: sizes.gap.small,
    backgroundColor: palette.white,
    borderRadius: sizes.radius.mid,
  },
})