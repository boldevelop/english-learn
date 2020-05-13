import {
    ACTIVE_PANEL,
    INITIAL_LOAD,
    SET_USER,
    SET_POPOUT,
    SET_COMPOSITORS,
    SET_SELECTED_COMPOSITOR,
    SET_SONGS, GO_BACK, GO_TO_PAGE, PUSH_HISTORY, POP_HISTORY, SET_SELECTED_TRANSLATE, SET_TRANSLATE,
    TOGGLE_MODAL_CARD_SONG, SET_SELECTED_COMPOSITOR_NAME
} from "../constants/actionTypes";

export const initialLoad = () => ({ type: INITIAL_LOAD });
export const setUser = user => ({ type: SET_USER, payload: user });
export const setCompositors = compositors => ({ type: SET_COMPOSITORS, payload: compositors });
export const setSelectedCompositor = compositorData => ({ type: SET_SELECTED_COMPOSITOR, payload: compositorData }); // rename set Selected Songs
export const setSelectedCompositorName = name => ({ type: SET_SELECTED_COMPOSITOR_NAME, payload: name });
export const setSongs = songs => ({ type: SET_SONGS, payload: songs });
export const setPopout = spinner => ({ type: SET_POPOUT, payload: spinner });
export const setActivePanel = panel => ({ type: ACTIVE_PANEL, payload: panel });
export const goBack = () => ({ type: GO_BACK });
export const goToPage = name => ({ type: GO_TO_PAGE, payload: name });
export const pushHistory = pageName => ({ type: PUSH_HISTORY, payload: pageName });
export const popHistory = lastIndex => ({ type: POP_HISTORY, payload: lastIndex });
export const setSelectedTranslate = songId => ({ type: SET_SELECTED_TRANSLATE, payload: songId });
export const setTranslate = translate => ({ type: SET_TRANSLATE, payload: translate });
export const toggleModalCardSong = cardSongData => ({ type: TOGGLE_MODAL_CARD_SONG, payload: cardSongData });