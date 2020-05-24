import {call, put, select} from "redux-saga/effects";
import {clearCompletedTask, goBack, setProgress} from "../actions";
import bridge from "@vkontakte/vk-bridge";
import * as STORAGE_KEYS from "../constants/storageKeys";

export function* endTasksSaga() {
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
        console.log(e)
    }
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
            value: JSON.stringify({progress}),
        });
    }
}