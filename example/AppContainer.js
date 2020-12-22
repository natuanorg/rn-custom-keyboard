import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import * as CustomKeyboard from "react-native-natuan-custom-keyboard";

class HomeScreen extends React.Component {

    componentDidMount() {
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            this.showKeyboardTimer()
        })
        this.willBlurListener = this.props.navigation.addListener('willBlur', () => {
            this.clearKeyboardTimer()
        })
    }

    componentWillUnmount() {
        this.clearKeyboardTimer()
        this.willFocusListener && this.willFocusListener.remove()
        this.willBlurListener && this.willBlurListener.remove()
    }

    clearKeyboardTimer () {
        this.input && this.input.blur()
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Home!</Text>
                <CustomKeyboard.CustomTextInput
                    textInputRef={this.textInputRef}
                    customKeyboardType="numberKeyBoardWithDot"
                    placeholder="numberKeyBoardWithDot"
                />
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.toggle}>
                    <Text>Toggle</Text>
                </TouchableOpacity>
            </View>
        );
    }

    showKeyboardTimer () {
        console.log('ASearch.showKeyboardTimer.showKeyboardSecondTime', this.showKeyboardSecondTime)
        if (this.showKeyboardSecondTime) {
            const isFocused = this.props.navigation.isFocused();
            isFocused && this.input && this.input.focus();
        }else {
            this.showKeyboardSecondTime = true
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                const isFocused = this.props.navigation.isFocused();
                isFocused && this.input && this.input.focus();
            }, 300);
        }
    }

    textInputRef = (ref) => {
        this.input = ref
    }

    toggle = () => {
        if (this.input.isFocused()) {
            this.input.blur()
        } else {
            this.input.focus()
        }
    }
}

class SettingsScreen extends React.Component {

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
            </View>
        );
    }
}

class ProfileScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Profile</Text>
                <CustomKeyboard.CustomTextInput
                    textInputRef={this.textInputRef}
                    customKeyboardType="numberKeyBoardWithDot"
                    placeholder="numberKeyBoardWithDot"
                />
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.toggle}>
                    <Text>Toggle</Text>
                </TouchableOpacity>
            </View>
        )
    }

    textInputRef = (ref) => {
        this.input = ref
    }

    toggle = () => {
        if (this.input.isFocused()) {
            this.input.blur()
        } else {
            this.input.focus()
        }
    }
}

const TabNavigator = createBottomTabNavigator({
    Settings: SettingsScreen,
    Home: HomeScreen,
    Profile: ProfileScreen
});

export default createAppContainer(TabNavigator);
