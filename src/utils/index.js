// display :: lang & fonts & theme & themes
import langEn from "./display/lang/en/lang-en";
import { paragraphTypes } from "./display/lang/types";
import { WithFonts, roboto, sanchez } from "./display/fonts";
import { theme, globalStyles } from "./display/theme";
import { useTheme, ProvideThemes } from "./display/themes";
// storage :: database & store
import { useDatabase, ProvideDatabase } from "./storage/database";
import { legalAgreement, ProvideLegalAgreement, useLegalAgreement } from "./storage/store";
// rest
import logger from "./logging";

const { sizes, colors } = theme;

const transform = (obj, f) => Object.keys(obj).reduce((a, c) => ({ ...a, [c]: f(c, obj[c]) }), {})

export {
  // display
  langEn, paragraphTypes,
  WithFonts, roboto, sanchez,
  sizes, colors, globalStyles,
  useTheme, ProvideThemes,

  // storage
  useDatabase, ProvideDatabase,
  legalAgreement, ProvideLegalAgreement, useLegalAgreement,

  // rest
  logger,
  transform,
}