import {call, put, select} from "redux-saga/effects";
import {goToPage, setPopout, setTranslate} from "../actions";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import React from "react";
import translatedData from "../data/translates";

export function* selectedTranslateSaga() {
    try {
        const selectedSong = yield select(state => state.selectedSong)
        yield put(goToPage('translate'))
        yield put(setPopout(<ScreenSpinner size='large' />))
        const translate = yield call(loadTranslate, selectedSong.translateId)
        yield put(setTranslate(translate))
    } catch (e) {
        console.log(e)
    } finally {
        yield put(setPopout(null))
    }
}

function loadTranslate(translatedId) {
    return Promise.resolve(translatedData.filter((el) => el.id === translatedId)[0])
}