/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import * as CustomKeyboard from 'react-native-natuan-custom-keyboard'

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <CustomKeyboard.CustomTextInput
              customKeyboardType="numberKeyBoardWithDot"
              placeholder="numberKeyBoardWithDot"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

});

export default App;
