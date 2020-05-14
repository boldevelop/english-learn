import React from 'react';
import * as TYPE from "../constants/actionTypes";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

const initialState = {
    history: ['all'],
    activePanel: 'all',
    selectedCompositorName: '',
    user: null,
    popout: <ScreenSpinner size='large' />,
    compositors: [],
    songs: [],
    translate: null,
    modalCardSong: {
        modalId: null,
        songName: '',
        tasksId: [],
        songId: null
    },
    songTasks: {
        songName: '',
        tasks: [],
        length: 0,
    }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case TYPE.SET_SONG_TASKS:
            return {
                ...state,
                songTasks: action.payload
            }
        case TYPE.SET_SELECTED_COMPOSITOR_NAME:
            return {
                ...state,
                selectedCompositorName: action.payload
            }
        case TYPE.TOGGLE_MODAL_CARD_SONG:
            return {
                ...state,
                modalCardSong: action.payload
            }
        case TYPE.POP_HISTORY:
            return {
                ...state,
                history: state.history.filter((item, i) => i !== action.payload)
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
