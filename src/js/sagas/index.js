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
  setTranslate,
  toggleModalCard,
  setSongTasks,
  setProgress,
  setSelectedCompositor,
  goBack,
  clearCompletedTask, setSelectedStroke
} from "../actions";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import compositorsData from "../../data/compositors.json";
import songsData from "../../data/songs.json";
import translatedData from "../../data/translates.json";
import tasksData from "../../data/tasks.json";
import * as CANVAS from "../constants/canvas";

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
  yield takeEvery(TYPE.PUBLISH_HISTORY, publishHistorySaga)
}

function* publishHistorySaga(action) {
  try {
    yield put(setPopout(<ScreenSpinner size='large' />))
    yield put(toggleModalCard(null))
    const selectedStroke = yield select(state => state.selectedStroke)
    yield put(setSelectedStroke({}))
    const canvas = action.payload.canvas
    const ctx = canvas.getContext('2d')
    const withTranslate = action.payload.withTranslate
    const bgColor = action.payload.bgColor
    const textColor = action.payload.textColor
    const blob = formBlobFromCanvasData({ctx, withTranslate, bgColor, textColor, selectedStroke, canvas})
    yield call(bridge.send, "VKWebAppShowStoryBox", {
      "background_type" : "image",
      blob
    })
  } catch (e) {
    console.log(e)
  } finally {
    yield put(setPopout(null))
    action.payload.canvas.getContext('2d').clearRect(0, 0, CANVAS.height, CANVAS.width);
  }
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
    yield call(setCompletedTaskSaga)
    yield put(goBack())
  } catch(e) {
    console.log(e)
  }
}

function* setCompletedTaskSaga() {
  try {
    const completedTasks = yield select(state => state.currentCompletedTasks)
    const compositorId = yield select(state => state.selectedCompositor.id)
    const songId = yield select(state => state.selectedSong.id)
    const progress = yield select(state => state.progress)
    yield call(addCompletedIdsToProgress, progress, compositorId, songId, completedTasks)
    yield put(setProgress(progress))
    yield put(clearCompletedTask())
  } catch (e) {

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

function* goToTasksSaga() {
  try {
    const selectedSong = yield select(state => state.selectedSong)
    console.log(selectedSong)
    yield put(setPopout(<ScreenSpinner size='large' />))
    const tasks = yield call(loadTasks, selectedSong.tasksId)
    tasks.sort(() => Math.random() - 0.5)
    yield put(setSongTasks(tasks))
  } catch(e) {
    console.log(e)
  } finally {
    yield put(setPopout(null))
    yield put(goToPage('task-0'))
  }
}

function* goBackSaga() {
  try {
    const stateHistory = yield select(state => state.history)
    if (stateHistory.length === 1) {  // Если в массиве одно значение:
      yield call(bridge.send, 'VKWebAppClose', {"status": "success"}); // Отправляем bridge на закрытие сервиса.
    } else if (stateHistory.length > 1) { // Если в массиве больше одного значения:
      const lastIndex = stateHistory.length - 1;
      yield put(toggleModalCard(null))
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
    yield call(loadCompositorsSaga)
  } catch (e) {
      console.log(e)
  } finally {
    yield put(setPopout(null))
    yield put({type: 'INITIAL_COMPLETE'})
  }
}

function* getProgressSaga() {
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

function* selectedCompositorSaga(action) {
  try {
    yield put(goToPage('selected'))
    yield put(setSongs([])) // clear its need it or component will be get progress from old-prev songs
    yield put(setPopout(<ScreenSpinner size='large' />))
    const songs = yield call(loadSongs, action.payload.songId)
    yield put(setSelectedCompositor(action.payload))
    yield put(setSongs(songs))
  } catch (e) {
    console.log(e)
  } finally {
    yield put(setPopout(null))
  }
}

function* selectedTranslateSaga() {
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
    const songs = []
    comp.songId.forEach(id => {
      songs.push({
        songId: id,
        completeTasksIds: []
      })
    })
    progress.push({
      compId: comp.id,
      completeTasksIds: [],
      songs: songs
    })
  })
  return progress
}

async function addCompletedIdsToProgress(progress, compId, songId, complIds) {
  const addedIds = [];

  progress.forEach(progressComp => {

    if (progressComp.compId === compId) {
      // для дев разработки использую 4 таска с одиними и теми же айдишниками
      // а в progressComp хранятся все эти айдишники
      // progressComp.completeTasksIds = progressComp.completeTasksIds.concat(complIds)

      progressComp.songs.forEach(progressSong => {
        if (progressSong.songId === songId) {
          // локанично но мне нужно узнать какие айдишники добавил,
          // для дев разработки использую 4 таска с одиними и теми же айдишниками
          // а в progressComp хранятся все эти айдишники
          // progressSong.completeTasksIds = [ ...new Set([...progressSong.completeTasksIds,...complIds])]

          progressSong.completeTasksIds = progressSong.completeTasksIds.concat(
              complIds.filter( complId => {
                if (progressSong.completeTasksIds.indexOf(complId) === -1) {
                  //  айдишника нет
                  addedIds.push(complId)
                  return true;
                } else {
                  //  айдишник повторяется
                  return false;
                }
              })
          )
        }
      })
      progressComp.completeTasksIds = progressComp.completeTasksIds.concat(addedIds)
    }
  })

  if (addedIds.length) {
    await bridge.send('VKWebAppStorageSet', {
      key: STORAGE_KEYS.PROGRESS,
      value: JSON.stringify(progress),
    });
  }
}

function formBlobFromCanvasData({ctx, withTranslate, selectedStroke, bgColor, textColor, canvas}) {
  ctx.font = "62px sans"
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = textColor
  ctx.fillText(selectedStroke.en, CANVAS.width / 2, CANVAS.height / 2, CANVAS.width)
  if (withTranslate) {
    ctx.fillText(selectedStroke.ru, CANVAS.width / 2, (CANVAS.height + 140) / 2, CANVAS.width)
  }
  return canvas.toDataURL("image/png")
}