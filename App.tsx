/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'

import Home from './components/Home'

const App = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  </>
)

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default App
