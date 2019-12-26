import React, {Component} from 'react'

import PropTypes from 'prop-types'

import {
    AppRegistry,
    AppState,
    findNodeHandle,
    Keyboard,
    NativeAppEventEmitter,
    NativeModules,
    Platform,
    TextInput
} from 'react-native'

import CustomKeyBoardView from './CustomKeyBoardView'
import {isIphoneX} from "react-native-iphone-x-helper"

const {CustomKeyboard} = NativeModules

const {
    install, uninstall,
    insertText, backSpace, doDelete,
    moveLeft, moveRight,
    switchSystemKeyboard,
    clearAll, hideKeyboard
} = CustomKeyboard

export {
    install, uninstall,
    insertText, backSpace, doDelete,
    moveLeft, moveRight,
    switchSystemKeyboard,
    clearAll, hideKeyboard
}

const keyboardTypeRegistry = {}

export const currentHeight = Platform.OS === 'ios' ? (isIphoneX() ? 286 : 252) : 252

export function addKeyBoardShowListener(listener) {
    if(Platform.OS === 'android') {
        return NativeAppEventEmitter.addListener('showCustomKeyboard', (data) => {
            listener(data)
        })
    } else {
        Keyboard.addListener('keyboardDidShow', () => {
            listener()
        })
        return 'keyboardDidShow'
    }
}

export function addKeyBoardHideListener(listener) {
    if(Platform.OS === 'android') {
        return NativeAppEventEmitter.addListener('hideCustomKeyboard', (data) => {
            listener(data)
        })
    } else {
        Keyboard.addListener('keyboardDidHide', () => {
            listener()
        })
        return 'keyboardDidHide'
    }
}

export function removeKeyBoardListener(subscribtion) {
    console.log(`removeKeyBoardListener`)
    if(Platform.OS === 'android') {
        NativeAppEventEmitter.removeSubscription(subscribtion)
    } else {
        Keyboard.removeListener(subscribtion)
    }
}

export function register(type, factory) {
    console.log(`register`)
    keyboardTypeRegistry[type] = factory
}

export function clearFocus(tag) {
    console.log(`clearFocus: ${tag}`)
    TextInput.State.blurTextInput(tag)
}

export function onSubmit(tag) {

}

class CustomKeyboardContainer extends Component {
    render() {
        console.log(`CustomKeyboardContainer.render`)
        const {tag, type} = this.props
        const factory = keyboardTypeRegistry[type]
        if (!factory) {
            console.warn(`Custom keyboard type ${type} not registered.`)
            return null
        }
        const Comp = factory()
        return <Comp tag={tag}/>
    }
}

AppRegistry.registerComponent("CustomKeyboard", () => CustomKeyboardContainer)

export class CustomTextInput extends Component {
    static propTypes = {
        ...TextInput.propTypes,
        customKeyboardType: PropTypes.string,
    }

    constructor() {
        super(...arguments)
        this.state = {text: this.props.defaultValue || ''}
    }

    componentDidMount() {
        this.installTime = setTimeout(() => {
            install(findNodeHandle(this.input), this.props.customKeyboardType)
            AppState.addEventListener('change', this._handleAppStateChange)
        }, 300)
    }

    componentWillUnmount() {
        this.installTime && clearTimeout(this.installTime)
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'background') {
            //检查键盘
            if (TextInput.State.currentlyFocusedField() === findNodeHandle(this.input)) {
                TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField())
                return true
            }
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.customKeyboardType !== this.props.customKeyboardType) {
            install(findNodeHandle(this.input), newProps.customKeyboardType)
        }
        if (newProps.value !== null && newProps.value !== undefined && newProps.value !== this.state.text) {
            this.setState({text: newProps.value})
        }
    }

    onRef = ref => {
        this.input = ref
        this.props.textInputRef && this.props.textInputRef(ref)
    }

    _onChangeText = (text) => {
        this.setState({text})
        this.props.onChangeText && this.props.onChangeText(text)
    }

    render() {
        const {customKeyboardType, ...others} = this.props
        if (!customKeyboardType) {
            return (
                <TextInput {...others} />
            )
        }
        return (
            <TextInput {...others}
                       ref={this.onRef}
                       onChangeText={this._onChangeText}
                       value={this.state.text}
            />
        )
    }
}

export function keyBoardAPI(keyBoardName) {
    return function (KeyBoardView) {
        class KeyBoard extends Component {
            render() {
                return (
                    <CustomKeyBoardView
                        insertText={insertText}
                        clearFocus={clearFocus}
                        clearAll={clearAll}
                        backSpace={backSpace}
                        keyboardContainerHeight={currentHeight}
                        keyboardViewHeight={252}
                        KeyBoardView={KeyBoardView}
                        {...this.props}
                    />
                )
            }
        }

        register(keyBoardName, () => KeyBoard)
        return KeyBoard
    }
}
