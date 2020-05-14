import * as TYPE from "../constants/actionTypes";

export const initialLoad = () => ({ type: TYPE.INITIAL_LOAD });
export const setUser = user => ({ type: TYPE.SET_USER, payload: user });
export const setCompositors = compositors => ({ type: TYPE.SET_COMPOSITORS, payload: compositors });
export const setSelectedCompositorsSong = compositorData => ({ type: TYPE.SET_SELECTED_COMPOSITORS_SONG, payload: compositorData }); // rename set Selected Songs
export const setSelectedCompositorName = name => ({ type: TYPE.SET_SELECTED_COMPOSITOR_NAME, payload: name });
export const setSongs = songs => ({ type: TYPE.SET_SONGS, payload: songs });
export const setPopout = spinner => ({ type: TYPE.SET_POPOUT, payload: spinner });
export const setActivePanel = panel => ({ type: TYPE.ACTIVE_PANEL, payload: panel });
export const goBack = () => ({ type: TYPE.GO_BACK });
export const goToPage = name => ({ type: TYPE.GO_TO_PAGE, payload: name });
export const pushHistory = pageName => ({ type: TYPE.PUSH_HISTORY, payload: pageName });
export const popHistory = lastIndex => ({ type: TYPE.POP_HISTORY, payload: lastIndex });
export const setSelectedTranslate = songId => ({ type: TYPE.SET_SELECTED_TRANSLATE, payload: songId });
export const setTranslate = translate => ({ type: TYPE.SET_TRANSLATE, payload: translate });
export const toggleModalCardSong = cardSongData => ({ type: TYPE.TOGGLE_MODAL_CARD_SONG, payload: cardSongData });