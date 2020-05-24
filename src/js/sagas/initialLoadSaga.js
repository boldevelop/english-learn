import React from 'react';
import {call, put} from "redux-saga/effects";
import {setPopout, setSongs, setUser} from "../actions";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import bridge from "@vkontakte/vk-bridge";
import allSongsData from "../data/allSongs";
import * as STORAGE_KEYS from "../constants/storageKeys";

export function* initialSaga() {
    try {
        yield put(setPopout(<ScreenSpinner size='large' />))
        const payload = yield call(bridge.send, 'VKWebAppGetUserInfo', {})
        yield put(setUser(payload))
        yield call(loadAllSongsSaga)
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

function* loadAllSongsSaga() {
    try {
        const allSongs = yield call(loadAllSongs)
        yield put(setSongs(allSongs))
    } catch(e) {
        console.log(e)
    }
}

function loadAllSongs() {
    return Promise.resolve(allSongsData)
}