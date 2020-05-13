import React from 'react';
import {
    ACTIVE_PANEL,
    SET_USER,
    SET_POPOUT,
    SET_COMPOSITORS,
    SET_SONGS,
    PUSH_HISTORY,
    POP_HISTORY, SET_TRANSLATE,
    TOGGLE_MODAL_CARD_SONG, SET_SELECTED_COMPOSITOR_NAME
} from "../constants/actionTypes";
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
        songId: null
    }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_COMPOSITOR_NAME:
            return {
                ...state,
                selectedCompositorName: action.payload
            }
        case TOGGLE_MODAL_CARD_SONG:
            return {
                ...state,
                modalCardSong: action.payload
            }
        case POP_HISTORY:
            return {
                ...state,
                history: state.history.filter((item, i) => i !== action.payload)
            }
        case PUSH_HISTORY:
            return {
                ...state,
                history: [...state.history, action.payload]
            }
        case SET_TRANSLATE:
            return {
                ...state,
                translate: action.payload
            }
        case SET_SONGS:
            return {
                ...state,
                songs: action.payload
            }
        case SET_COMPOSITORS:
            return {
                ...state,
                compositors: action.payload
            }
        case SET_POPOUT:
            return {
                ...state,
                popout: action.payload
            }
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case ACTIVE_PANEL:
            return {
                ...state,
                activePanel: action.payload
            }
        default:
            return state
    }
}

export default rootReducer;
