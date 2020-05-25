import {takeEvery, throttle} from "redux-saga/effects";
import * as TYPE from "../constants/actionTypes";
import {initialSaga} from "./initialLoadSaga";
import {formProgressSaga} from "./formProgressSaga";
import {selectedTranslateSaga} from "./selectedTranslateSaga";
import {goToTasksSaga} from "./goToTasksSaga";
import {endTasksSaga} from "./endTasksSaga";
import {goBackSaga, goToPageSaga} from "./navigation";
import {publishHistorySaga} from "./publishHistorySaga";
import {filterSongsSaga} from "./filterSongsSaga";

export default function* watcherSaga() {
  yield takeEvery(TYPE.INITIAL_LOAD, initialSaga)
  yield takeEvery(TYPE.FORM_PROGRESS, formProgressSaga)
  yield takeEvery(TYPE.SET_SELECTED_TRANSLATE, selectedTranslateSaga)
  yield takeEvery(TYPE.GO_TO_PAGE, goToPageSaga)
  yield takeEvery(TYPE.GO_BACK, goBackSaga)
  yield takeEvery(TYPE.GO_TO_TASKS, goToTasksSaga)
  yield takeEvery(TYPE.END_TASKS, endTasksSaga)
  yield takeEvery(TYPE.PUBLISH_HISTORY, publishHistorySaga)
  yield throttle(3000, TYPE.SET_FILTER_SONG, filterSongsSaga)
}