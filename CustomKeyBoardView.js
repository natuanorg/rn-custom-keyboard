//@flow

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, StyleSheet, Platform } from 'react-native';

import {isIphoneX} from "react-native-iphone-x-helper";

export default class KeyBoard extends Component{
    state: Object
    backSpaceRequest: number
    insertTextRequest: number
    clearFocusRequest: number
    clearAllRequest: number

    static propTypes = {
        insertText: PropTypes.func.isRequired,
        clearFocus: PropTypes.func.isRequired,
        clearAll: PropTypes.func.isRequired,
        KeyBoardView: PropTypes.any.isRequired,
    }

    constructor() {
        super(...arguments)
    }

    _handleDelete = () => {
        this.backSpaceRequest && cancelAnimationFrame(this.backSpaceRequest)
        this.backSpaceRequest = requestAnimationFrame(() => {
            this.props.backSpace(this.props.tag);
        })
    };

    _handleKeyPress = (key) => {
        this.insertTextRequest && cancelAnimationFrame(this.insertTextRequest)
        this.insertTextRequest = requestAnimationFrame(() => {
            this.props.insertText(this.props.tag, key);
        })
    }

    _clearFocus = () => {
        this.clearFocusRequest && cancelAnimationFrame(this.clearFocusRequest)
        this.clearFocusRequest = requestAnimationFrame(() => {
            this.props.clearFocus(this.props.tag)
        })
    }

    _handlerClearAll = () => {
        this.clearAllRequest && cancelAnimationFrame(this.clearAllRequest)
        this.clearAllRequest = requestAnimationFrame(() => {
            this.props.clearAll(this.props.tag)
        })
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        console.log(`CustomKeyboardView.componentWillReceiveProps`)
    }

    componentWillUnmount() {
        console.log(`CustomKeyboardView.componentWillUnmount`)
        this.clearFocusRequest && cancelAnimationFrame(this.clearFocusRequest)
        this.insertTextRequest && cancelAnimationFrame(this.insertTextRequest)
        this.backSpaceRequest && cancelAnimationFrame(this.backSpaceRequest)
        this.clearAllRequest && cancelAnimationFrame(this.clearAllRequest)
    }

    render() {

        console.log(`CustomKeyboardView.render`)

        const {KeyBoardView} = this.props

        return (
            <View style={styles.container} ref="keyboard" pointerEvents="box-none">
                <View style={{
                    backgroundColor: '#f6f5f2',
                    height: this.props.keyboardContainerHeight,
                }} key="keyboard">
                    <KeyBoardView
                        {...this.props}
                        onKeyPress={this._handleKeyPress}
                        onDelete={this._handleDelete}
                        onClearAll={this._handlerClearAll}
                        keyboardContainerHeight={this.props.keyboardContainerHeight}
                        keyboardViewHeight={this.props.keyboardViewHeight}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    keyBoard: {
        backgroundColor: '#f6f5f2',
        height: Platform.OS === 'ios' ? (isIphoneX() ? 286 : 252) : 306,
    },
    top: {
        height: 36,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#a5a5a5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topLeft: {
        paddingLeft: 15,
        flexDirection: 'row',
    },
    topDesText: {
        color: '#adadad',
        fontSize: 15,
        paddingHorizontal: 8,
    },
    topCompleteText: {
        color: '#0297fa',
        fontSize: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
    }
})

