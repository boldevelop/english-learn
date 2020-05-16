import React from 'react';
import { takeEvery, call, put, select } from "redux-saga/effects";
import * as TYPE from "../constants/actionTypes";
import * as STORAGE_KEYS from "../constants/storageKeys";
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
  setTranslate, toggleModalCardSong, setSongTasks, setProgress, setSelectedCompositor, goBack
} from "../actions";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import compositorsData from "../../data/compositors.json";
import songsData from "../../data/songs.json";
import translatedData from "../../data/translates.json";
import tasksData from "../../data/tasks.json";

export default function* watcherSaga() {
  yield takeEvery(TYPE.INITIAL_LOAD, initialSaga)
  yield takeEvery(TYPE.INITIAL_COMPLETE, getProgressSaga)
  yield takeEvery(TYPE.FORM_PROGRESS, formProgressSaga)
  yield takeEvery(TYPE.SET_SELECTED_COMPOSITORS_SONG, selectedCompositorSaga)
  yield takeEvery(TYPE.SET_SELECTED_TRANSLATE, selectedTranslateSaga)
  yield takeEvery(TYPE.GO_TO_PAGE, goToPageSaga)
  yield takeEvery(TYPE.GO_BACK, goBackSaga)
  yield takeEvery(TYPE.GO_TO_TASKS, goToTasksSaga)
  yield takeEvery(TYPE.END_TASKS, endTasksSaga)
  yield takeEvery(TYPE.GO_TO_NEXT_TASK, goToNextTaskSaga)
}

function* formProgressSaga() {
  try {
    const compositors = yield select(state => state.compositors)
    const progress = createProgressArray(compositors)
    yield put(setProgress(progress))
  } catch (e) {
    console.log(e)
  }
}

function* goToNextTaskSaga(action) {
  try {
    yield put(setActivePanel(action.payload))
  } catch(e) {
    console.log(e)
  }
}

function* endTasksSaga() {
  try {
    yield put(goBack())
  } catch(e) {
    console.log(e)
  }
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

function* goToTasksSaga(action) {
  try {
    const tasksId = action.payload.tasksId // В качестве аргумента принимаем id заданий
    const songName = action.payload.songName
    yield put(setPopout(<ScreenSpinner size='large' />));
    const tasks = yield call(loadTasks, tasksId)
    yield put(setSongTasks({tasks, songName}))
  } catch(e) {
    console.log(e)
  } finally {
    yield put(setPopout(null));
    yield put(goToPage('task-0'));
  }
}

function* goBackSaga() {
  try {
    const stateHistory = yield select(state => state.history)
    if (stateHistory.length === 1) {  // Если в массиве одно значение:
      yield call(bridge.send, 'VKWebAppClose', {"status": "success"}); // Отправляем bridge на закрытие сервиса.
    } else if (stateHistory.length > 1) { // Если в массиве больше одного значения:
      const lastIndex = stateHistory.length - 1;
      yield put(toggleModalCardSong({ modalId: null, songName: '', songId: null}))
      yield put(popHistory(lastIndex)) // удаляем последний элемент в массиве.
      yield put(setActivePanel(stateHistory[lastIndex - 1]))// Меняем активную панель
    }
  } catch(e) {
    console.log(e)
  }
}

function* initialSaga() {
  try {
    yield put(setPopout(<ScreenSpinner size='large' />))
    yield call(bridge.send, 'VKWebAppInit')
    const payload = yield call(bridge.send, 'VKWebAppGetUserInfo')
    yield put(setUser(payload))
    console.log('loadcompositors start')
    yield call(loadCompositorsSaga)
    console.log('loadcompositors end')
  } catch (e) {
      console.log(e)
  } finally {
    yield put(setPopout(null))
    yield put({type: 'INITIAL_COMPLETE'})
  }
}

function* getProgressSaga() {
  try {
    console.log('start getProgress')
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

function* selectedCompositorSaga(action) {
  try {
    yield put(goToPage('selected'));
    yield put(setPopout(<ScreenSpinner size='large' />));
    const songs = yield call(loadSongs, action.payload.songId);
    yield put(setSelectedCompositor(action.payload));
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
    yield put(setTranslate(translate));
  } catch (e) {
    console.log(e);
  } finally {
    yield put(setPopout(null));
  }
}

function* loadCompositorsSaga() {
  const compositors = yield call(loadCompositors)
  yield put(setCompositors(compositors))
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

function loadTasks(tasksId) {
  let tasks = []
  for (const id of tasksId) {
    tasksData.forEach(currentTask => {
      if (currentTask.id === id) {
        tasks.push(currentTask)
      }
    })
  }
  return Promise.resolve(tasks)
}

function createProgressArray(compositors) {
  const progress = []
  compositors.forEach((comp) => {
    progress.push({
      compId: comp.id,
      completeTaskIds: []
    })
  })
  return progress
}
