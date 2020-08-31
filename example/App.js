/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
    TouchableOpacity
} from 'react-native';
import * as CustomKeyboard from 'react-native-natuan-custom-keyboard'
import AppContainer from "./AppContainer";

export default class App extends Component{
  render() {
    return (<AppContainer/>)
  }
};
