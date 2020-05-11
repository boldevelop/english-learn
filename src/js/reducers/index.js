import React from 'react';
import {
    ACTIVE_PANEL,
    ACTIVE_VIEW,
    SET_USER,
    SET_POPOUT,
    SET_COMPOSITORS,
    SET_SONGS,
    PUSH_HISTORY,
    POP_HISTORY
} from "../constants/actionTypes";
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

const initialState = {
    history: ['all'],
    activeView: 'compositors',
    activePanel: 'all',
    user: null,
    popout: <ScreenSpinner size='large' />,
    compositors: [],
    songs: []
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
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
        case ACTIVE_VIEW:
            return {
                ...state,
                activeView: action.payload
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
