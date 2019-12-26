//@flow

import {
    keyBoardAPI,

    addKeyBoardHideListener,
    addKeyBoardShowListener,
    removeKeyBoardListener,

    currentHeight,

    CustomTextInput,
    hideKeyboard
} from './customKeyboard'

import NumberKeyBoardView from './views/NumberKeyBoard'
import SafeKeyBoardView from './views/SafeKeyBoard'
import AwareCusKeyBoardScrollView from './AwareCusKeyBoardScrollView'

export {
    addKeyBoardHideListener,
    removeKeyBoardListener,
    addKeyBoardShowListener,

    currentHeight,

    CustomTextInput,
    AwareCusKeyBoardScrollView,

    NumberKeyBoardView,
    SafeKeyBoardView,
    keyBoardAPI,
    hideKeyboard
}
