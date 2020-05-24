import React from 'react';
import { takeEvery, call, put } from "redux-saga/effects";
import * as TYPE from "../constants/actionTypes";
import {
  setPopout,
  setSongs,
  goToPage,
  setSelectedCompositor,
} from "../actions";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import songsData from "../data/songs.js";
import {initialSaga} from "./initialLoadSaga";
import {formProgressSaga} from "./formProgressSaga";
import {selectedTranslateSaga} from "./selectedTranslateSaga";
import {goToTasksSaga} from "./goToTasksSaga";
import {endTasksSaga} from "./endTasksSaga";
import {goBackSaga, goToPageSaga} from "./navigation";
import {publishHistorySaga} from "./publishHistorySaga";

export default function* watcherSaga() {
  yield takeEvery(TYPE.INITIAL_LOAD, initialSaga)
  yield takeEvery(TYPE.FORM_PROGRESS, formProgressSaga)
  yield takeEvery(TYPE.SET_SELECTED_COMPOSITORS_SONG, selectedCompositorSaga)
  yield takeEvery(TYPE.SET_SELECTED_TRANSLATE, selectedTranslateSaga)
  yield takeEvery(TYPE.GO_TO_PAGE, goToPageSaga)
  yield takeEvery(TYPE.GO_BACK, goBackSaga)
  yield takeEvery(TYPE.GO_TO_TASKS, goToTasksSaga)
  yield takeEvery(TYPE.END_TASKS, endTasksSaga)
  yield takeEvery(TYPE.PUBLISH_HISTORY, publishHistorySaga)
}

function* selectedCompositorSaga(action) {
  try {
    yield put(goToPage('selected'))
    yield put(setSongs([])) // clear its need it or component will be get progress from old-prev songs
    yield put(setPopout(<ScreenSpinner size='large' />))
    const songs = yield call(loadSongsById, action.payload.songId)
    yield put(setSelectedCompositor(action.payload))
    yield put(setSongs(songs))
  } catch (e) {
    console.log(e)
  } finally {
    yield put(setPopout(null))
  }
}

function loadSongsById(songsId) {
  let songs = [];
  for (const id of songsId) {
    songsData.forEach(currentSong => {
      if (currentSong.id === id) {
        songs.push(currentSong);
      }
    })
  }
  return Promise.resolve(songs)
}