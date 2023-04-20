import React, { createContext, useContext } from 'react'
import lightTheme from '../../../assets/themes/light.json'

export const themesContext = createContext();

export function useThemes() {
  return useContext(themesContext);
}

export function useTheme() {
  return useThemes()["light"]
}

export function ProvideThemes({ children }) {
  const themes = {
    "light": lightTheme
  }

  return (
    <themesContext.Provider value={themes}>
      {children}
    </themesContext.Provider>
  )
}