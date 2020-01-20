import * as CustomKeyboard from 'react-native-natuan-custom-keyboard'
import React, {Component} from 'react'
import {NumberKeyBoardView} from './views'
CustomKeyboard.keyBoardAPI('numberKeyBoardWithDot')(class extends Component{
    render() {
        return (
            <NumberKeyBoardView
                keyboardType={"number-pad"}
                disableOtherText={true}
                {...this.props}
            />
        )
    }
})
