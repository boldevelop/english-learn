import {put, select} from "redux-saga/effects";
import {setProgress} from "../actions";

export function* formProgressSaga() {
    try {
        const allSongs = yield select(state => state.songs)
        const progress = createProgressArray(allSongs)
        yield put(setProgress(progress))
    } catch (e) {
        console.log(e)
    }
}

function createProgressArray(allSongs) {
    const progress = []
    allSongs.forEach((comp) => {
        const songs = []
        comp.songs.forEach(song => {
            songs.push({
                songId: song.id,
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