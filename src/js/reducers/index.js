import React from 'react';
import * as TYPE from "../constants/actionTypes";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

const initialState = {
    history: ['all'],
    activePanel: 'all',

    selectedCompositor: {},
    selectedSong: {},
    selectedTask: [],
    selectedStroke: {},

    user: null,
    popout: <ScreenSpinner size='large' />,

    compositors: [],
    songs: [],
    translate: null,

    modalCard: null,
    /*
    {
      compId: comp.id,
      completeTasksIds: [],
      songs: [
        {
            songId: song.id
            completeTasksIds: []
        }
      ]
    }
     */
    progress: [],
    currentCompletedTasks: [],
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case TYPE.SET_SELECTED_STROKE:
            return {
                ...state,
                selectedStroke: action.payload
            }
        case TYPE.CLEAR_COMPLETED_TASK:
            return {
                ...state,
                currentCompletedTasks: []
            }
        case TYPE.PUSH_COMPLETED_TASK:
            return {
                ...state,
                currentCompletedTasks: state.currentCompletedTasks.concat([action.payload])
            }
        case TYPE.SET_SELECTED_SONG:
            return {
                ...state,
                selectedSong: action.payload
            }
        case TYPE.SET_SELECTED_COMPOSITOR:
            return {
                ...state,
                selectedCompositor: action.payload
            }
        case TYPE.SET_PROGRESS:
            return {
                ...state,
                progress: action.payload
            }
        case TYPE.SET_SONG_TASKS:
            return {
                ...state,
                selectedTask: action.payload
            }
        case TYPE.TOGGLE_MODAL_CARD:
            return {
                ...state,
                modalCard: action.payload
            }
        case TYPE.POP_HISTORY:
            return {
                ...state,
                history: state.history.filter((item, i) => i < action.payload)
            }
        case TYPE.PUSH_HISTORY:
            return {
                ...state,
                history: [...state.history, action.payload]
            }
        case TYPE.SET_TRANSLATE:
            return {
                ...state,
                translate: action.payload
            }
        case TYPE.SET_SONGS:
            return {
                ...state,
                songs: action.payload
            }
        case TYPE.SET_COMPOSITORS:
            return {
                ...state,
                compositors: action.payload
            }
        case TYPE.SET_POPOUT:
            return {
                ...state,
                popout: action.payload
            }
        case TYPE.SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case TYPE.ACTIVE_PANEL:
            return {
                ...state,
                activePanel: action.payload
            }
        default:
            return state
    }
}

export default rootReducer;
