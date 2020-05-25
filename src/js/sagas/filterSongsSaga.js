import {put, select, call} from "redux-saga/effects";
import {setFiltered, setSongs} from "../actions";
import allSongsData from "../data/allSongs";
import React from "react";

export function* filterSongsSaga() {
    try {
        yield put(setFiltered(true))
        const searchValue = yield select(state => state.searchValue)
        const activeTag = yield select(state => state.activeTag)
        const songs = yield call(filterSong, searchValue, activeTag)
        yield put(setSongs(songs))
    } catch(e) {
        console.log(e)
    } finally {
        yield put(setFiltered(false))
    }
}

function filterSong(searchValue, activeTag) {
    const songs = []
    allSongsData.forEach(compositor => {
        // задан тег
        if (activeTag) {
            if (compositor.type.toLowerCase() === activeTag.toLowerCase()) {
                if (searchValue) {
                    // установленный тег соотвествует типу производителя
                    const c = searchAndAddSongs(compositor, searchValue)
                    if (c) {
                        songs.push(c)
                    }
                } else {
                    songs.push(compositor)
                }
            }
        } else {
            // нету заданного тега
            if (searchValue) {
                const c = searchAndAddSongs(compositor, searchValue)
                if (c) {
                    songs.push(c)
                }
            } else {
                songs.push(compositor)
            }

        }
    })
    return Promise.resolve(songs)
}

function searchAndAddSongs(compositor, searchValue) {
    if (isInclude(compositor.name, searchValue)) {
        // есть соответствие в композиторе
        return compositor
    } else {
        // значит проверяем внутренние песни
        const tempComp = {
            ...compositor
        }
        tempComp.songs = []
        compositor.songs.forEach(song => {
            if (isInclude(song.name, searchValue)) {
                tempComp.songs.push(song)
            }
        })

        return tempComp.songs.length ? tempComp : null
    }
}

function isInclude(text, value) {
    return text.toLowerCase().indexOf(value.toLowerCase()) !== -1
}