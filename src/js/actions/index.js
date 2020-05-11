import {
    ACTIVE_PANEL,
    ACTIVE_VIEW,
    INITIAL_LOAD,
    SET_USER,
    SET_POPOUT,
    SET_COMPOSITORS,
    SET_SELECTED_COMPOSITOR,
    SET_SONGS, GO_BACK, GO_TO_PAGE, PUSH_HISTORY, POP_HISTORY
} from "../constants/actionTypes";

export const initialLoad = () => ({ type: INITIAL_LOAD });
export const setUser = user => ({ type: SET_USER, payload: user });
export const setCompositors = compositors => ({ type: SET_COMPOSITORS, payload: compositors });
export const setSelectedCompositor = songsId => ({ type: SET_SELECTED_COMPOSITOR, payload: songsId });
export const setSongs = songs => ({ type: SET_SONGS, payload: songs });
export const setPopout = spinner => ({ type: SET_POPOUT, payload: spinner });
export const setActiveView = view => ({ type: ACTIVE_VIEW, payload: view });
export const setActivePanel = panel => ({ type: ACTIVE_PANEL, payload: panel });
export const goBack = () => ({ type: GO_BACK });
export const goToPage = name => ({ type: GO_TO_PAGE, payload: name });
export const pushHistory = pageName => ({ type: PUSH_HISTORY, payload: pageName });
export const popHistory = lastIndex => ({ type: POP_HISTORY, payload: lastIndex });