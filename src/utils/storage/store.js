import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const legalAgreementKey = '@accepted_privacy_policy_and_terms_and_conditions'

export const legalAgreement = {
  get: async () => {
    try {
      const value = await AsyncStorage.getItem(legalAgreementKey)
      return Boolean(value === "true")
    } catch (e) {
      return false
      // TODO: handle reading error
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem(legalAgreementKey, String(value))
    } catch (e) {
      // TODO: handle saving error
    }
  }
}

export const legalAgreementContext = createContext();

export function useLegalAgreement() {
  return useContext(legalAgreementContext);
}

export function ProvideLegalAgreement({ children }) {
  const [accepted, setAccepted] = useState(null)

  const fetch = () => legalAgreement.get().then(v => setAccepted(v))

  useEffect(() => { fetch(); }, [])

  const accept = () => legalAgreement.set(true).then(fetch)
  const decline = () => legalAgreement.set(false).then(fetch)

  const state = {
    accepted,
    accept,
    decline,
  };

  return (
    <legalAgreementContext.Provider value={state}>
      {children}
    </legalAgreementContext.Provider>
  )

}