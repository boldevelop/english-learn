import * as TYPE from "../constants/actionTypes"

export const initialLoad = () => ({ type: TYPE.INITIAL_LOAD })
export const setUser = user => ({ type: TYPE.SET_USER, payload: user })
export const setCompositors = compositors => ({ type: TYPE.SET_COMPOSITORS, payload: compositors })
export const setSelectedCompositorsSong = compositorData => ({ type: TYPE.SET_SELECTED_COMPOSITORS_SONG, payload: compositorData })
export const setSelectedCompositor = compositorData => ({ type: TYPE.SET_SELECTED_COMPOSITOR, payload: compositorData })
export const setSelectedSong = songData => ({ type: TYPE.SET_SELECTED_SONG, payload: songData })
export const setSongs = songs => ({ type: TYPE.SET_SONGS, payload: songs })
export const setPopout = spinner => ({ type: TYPE.SET_POPOUT, payload: spinner })
export const setActivePanel = panel => ({ type: TYPE.ACTIVE_PANEL, payload: panel })
export const goBack = () => ({ type: TYPE.GO_BACK })
export const goToPage = name => ({ type: TYPE.GO_TO_PAGE, payload: name })
export const goToTasks = () => ({ type: TYPE.GO_TO_TASKS })
export const pushHistory = pageName => ({ type: TYPE.PUSH_HISTORY, payload: pageName })
export const popHistory = lastIndex => ({ type: TYPE.POP_HISTORY, payload: lastIndex })
export const setSelectedTranslate = () => ({ type: TYPE.SET_SELECTED_TRANSLATE })
export const setTranslate = translate => ({ type: TYPE.SET_TRANSLATE, payload: translate })
export const setSongTasks = tasks => ({ type: TYPE.SET_SONG_TASKS, payload: tasks })
export const toggleModalCard = cardId => ({ type: TYPE.TOGGLE_MODAL_CARD, payload: cardId })
export const endTasks = tasksLength => ({ type: TYPE.END_TASKS, payload: tasksLength })
export const goToNextTask = taskId => ({ type: TYPE.GO_TO_NEXT_TASK, payload: taskId })
export const setProgress = progress => ({ type: TYPE.SET_PROGRESS, payload: progress })
export const formProgress = () => ({ type: TYPE.FORM_PROGRESS })
export const pushCompletedTask = (id) => ({ type: TYPE.PUSH_COMPLETED_TASK, payload: id })
export const clearCompletedTask = () => ({ type: TYPE.CLEAR_COMPLETED_TASK })
export const setSelectedStroke = strokeObj => ({ type: TYPE.SET_SELECTED_STROKE, payload: strokeObj })
export const publishHistory = ({ canvas, withTranslate, bgColor, textColor, toDataUrl }) => ({ type: TYPE.PUBLISH_HISTORY, payload: { canvas, withTranslate, bgColor, textColor } })