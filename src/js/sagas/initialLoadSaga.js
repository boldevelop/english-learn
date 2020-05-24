import React from 'react';
import {call, put} from "redux-saga/effects";
import {setCompositors, setPopout, setUser} from "../actions";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import bridge from "@vkontakte/vk-bridge";
import compositorsData from "../data/compositors";
import * as STORAGE_KEYS from "../constants/storageKeys";

export function* initialSaga() {
    try {
        yield put(setPopout(<ScreenSpinner size='large' />))
        const payload = yield call(bridge.send, 'VKWebAppGetUserInfo', {})
        yield put(setUser(payload))
        yield call(loadCompositorsSaga)
        yield call(getProgressFromStorageSaga)
    } catch (e) {
        console.log(e)
    } finally {
        yield put(setPopout(null))
    }
}

function* getProgressFromStorageSaga() {
    try {
        yield call(
            bridge.send,
            'VKWebAppStorageGet',
            {
                keys: [STORAGE_KEYS.PROGRESS]
            })
    } catch(e) {
        console.log(e)
    }
}

function* loadCompositorsSaga() {
    try {
        const compositors = yield call(loadCompositors)
        yield put(setCompositors(compositors))
    } catch(e) {
        console.log(e)
    }
}

function loadCompositors() {
    return Promise.resolve(compositorsData)
}