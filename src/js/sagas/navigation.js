import {call, put, select} from "redux-saga/effects";
import {popHistory, pushHistory, setActivePanel, toggleModalCard} from "../actions";
import bridge from "@vkontakte/vk-bridge";

export function* goToPageSaga(action) {
    try {
        const name = action.payload // В качестве аргумента принимаем id панели для перехода
        window.history.pushState({panel: name}, name) // Создаём новую запись в истории браузера
        yield put(setActivePanel(name)) // Меняем активную панель на second
        yield put(pushHistory(name)) // Добавляем панель в историю
    } catch(e) {
        console.log(e)
    }
}

export function* goBackSaga() {
    try {
        const stateHistory = yield select(state => state.history)
        if (stateHistory.length === 1) {  // Если в массиве одно значение:
            yield call(bridge.send, 'VKWebAppClose', {"status": "success"}); // Отправляем bridge на закрытие сервиса.
        } else if (stateHistory.length > 1) { // Если в массиве больше одного значения:
            const lastIndex = stateHistory.length - 1;
            yield put(toggleModalCard(null))
            yield put(popHistory(lastIndex)) // удаляем последний элемент в массиве.
            yield put(setActivePanel(stateHistory[lastIndex - 1]))// Меняем активную панель
        }
    } catch(e) {
        console.log(e)
    }
}