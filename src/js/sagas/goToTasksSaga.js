import {call, put, select} from "redux-saga/effects";
import {goToPage, setPopout, setSongTasks} from "../actions";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import React from "react";
import tasksData from "../data/tasks";

export function* goToTasksSaga() {
    try {
        const selectedSong = yield select(state => state.selectedSong)
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