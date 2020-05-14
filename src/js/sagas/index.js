import React from 'react';
import { takeEvery, call, put, select } from "redux-saga/effects";
import * as TYPE from "../constants/actionTypes";
import bridge from '@vkontakte/vk-bridge';
import {
  setUser,
  setPopout,
  setCompositors,
  setActivePanel,
  setSongs,
  pushHistory,
  popHistory,
  goToPage,
  setTranslate, setSelectedCompositorName
} from "../actions";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import compositorsData from "../../data/compositors.json";
import songsData from "../../data/songs.json";
import translatedData from "../../data/translates.json";

export default function* watcherSaga() {
  yield takeEvery(TYPE.INITIAL_LOAD, initialSaga);
  yield takeEvery(TYPE.SET_SELECTED_COMPOSITORS_SONG, selectedCompositorSaga);
  yield takeEvery(TYPE.SET_SELECTED_TRANSLATE, selectedTranslateSaga);
  yield takeEvery(TYPE.GO_TO_PAGE, goToPageSaga);
  yield takeEvery(TYPE.GO_BACK, goBack);
}

function* goToPageSaga(action) {
  try {
    const name = action.payload // В качестве аргумента принимаем id панели для перехода
    window.history.pushState({panel: name}, name) // Создаём новую запись в истории браузера
    yield put(setActivePanel(name)) // Меняем активную панель на second
    yield put(pushHistory(name)) // Добавляем панель в историю
  } catch(e) {
    console.log(e)
  }
}

function* goBack() {
  try {
    const stateHistory = yield select(state => state.history)
    if (stateHistory.length === 1) {  // Если в массиве одно значение:
      yield call(bridge.send, 'VKWebAppClose', {"status": "success"}); // Отправляем bridge на закрытие сервиса.
    } else if (stateHistory.length > 1) { // Если в массиве больше одного значения:
      const lastIndex = stateHistory.length - 1;
      yield put(popHistory(lastIndex)) // удаляем последний элемент в массиве.
      yield put(setActivePanel(stateHistory[lastIndex - 1]))// Меняем активную панель
    }
  } catch(e) {
    console.log(e)
  }
}

function* initialSaga() {
  try {
    yield put(setPopout(<ScreenSpinner size='large' />));
    yield call(bridge.send, 'VKWebAppInit');
    const payload = yield call(bridge.send, 'VKWebAppGetUserInfo');
    yield put(setUser(payload));
    const compositors = yield call(loadCompositors);
    yield put(setCompositors(compositors));
  } catch (e) {
      console.log(e);
  } finally {
    yield put(setPopout(null));
  }
}

function* selectedCompositorSaga(action) {
  try {
    yield put(goToPage('selected'));
    yield put(setPopout(<ScreenSpinner size='large' />));
    const songs = yield call(loadSongs, action.payload.songId);
    yield put(setSelectedCompositorName(action.payload.name));
    yield put(setSongs(songs));
  } catch (e) {
    console.log(e);
  } finally {
    yield put(setPopout(null));
  }
}

function* selectedTranslateSaga(action) {
  try {
    yield put(goToPage('translate'));
    yield put(setPopout(<ScreenSpinner size='large' />));
    const translate = yield call(loadTranslate, action.payload);
    console.log(translate);
    yield put(setTranslate(translate));
  } catch (e) {
    console.log(e);
  } finally {
    yield put(setPopout(null));
  }
}

function loadCompositors() {
  return Promise.resolve(compositorsData)
}

function loadSongs(songsId) {
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

function loadTranslate(translatedId) {
  return Promise.resolve(translatedData.filter((el) => el.id === translatedId)[0])
}
