import { paragraphTypes as types } from "../types"
import termsAndConditions from "./documents/terms-and-conditions"
import privacyPolicy from "./documents/privacy-policy"
import licenses from "./documents/licenses"


const t = Object.freeze({
  title____: types.title,
  header___: types.header,
  paragraph: types.paragraph,
  list_____: types.list,
})

const earlyReleaseMessage = [
  [t.paragraph, "This app is open source and everyone can participate in developing it at https://github.com/Bodypace/Mobile."],
  [t.paragraph, "It's also in early development phase with just a small fraction of all expected features implemented."],
  [t.paragraph, "Upcomming updates will add those missing features."],
  [t.paragraph, "If you are interested in what that means exactly or in general what is being planned for the future, check out: https://bodypace.org/future."],
  [t.paragraph, "Online accounts are comming soon and will be optional. For now everything is local on your phone."],
]

export default {
  documents: {
    title: 'Bodypace early release documents and notes',
    toc: termsAndConditions,
    priv: privacyPolicy,
    licenses: licenses,
    message: earlyReleaseMessage
  },
  navigator: {
    diet: "Diet",
    settings: "Settings"
  },
  screen: {
    welcome: {
      title: "Welcome to early release",
      message: earlyReleaseMessage,
      toc: termsAndConditions,
      priv: privacyPolicy
    },
    settings: {
      appearance: "Appearance",
      language: "Language",
      theme: "Theme",
      servings: "Servings",
      glass_size: "Glass size",
      agreements: "Agreements",
      toc: "Terms and Conditions",
      priv: "Privacy Policy",
      licenses: "Licenses",
      notes: "Notes",
      early_release_notes: "Early release notes",
    }
  },
  components: {
    legalNote: {
      title: "By continuing you accept our",
      toc: "Terms and Conditions",
      and: "and",
      priv: "Privacy Policy",
    }
  }
}