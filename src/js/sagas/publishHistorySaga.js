import {call, put, select} from "redux-saga/effects";
import {setPopout, setSelectedStroke, toggleModalCard} from "../actions";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import bridge from "@vkontakte/vk-bridge";
import * as CANVAS from "../constants/canvas";
import React from "react";

export function* publishHistorySaga(action) {
    try {
        yield put(setPopout(<ScreenSpinner size='large' />))
        yield put(toggleModalCard(null))
        const selectedStroke = yield select(state => state.selectedStroke)
        yield put(setSelectedStroke({}))
        const canvas = action.payload.canvas
        const ctx = canvas.getContext('2d')
        const withTranslate = action.payload.withTranslate
        const bgColor = action.payload.bgColor
        const textColor = action.payload.textColor
        const blob = formBlobFromCanvasData({ctx, withTranslate, bgColor, textColor, selectedStroke, canvas})
        yield call(bridge.send, "VKWebAppShowStoryBox", {
            "background_type" : "image",
            blob
        })
    } catch (e) {
        console.log(e)
    } finally {
        yield put(setPopout(null))
        action.payload.canvas.getContext('2d').clearRect(0, 0, CANVAS.height, CANVAS.width);
    }
}

function formBlobFromCanvasData({ctx, withTranslate, selectedStroke, bgColor, textColor, canvas}) {
    ctx.font = "62px sans"
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = textColor
    ctx.fillText(selectedStroke.en, CANVAS.width / 2, CANVAS.height / 2, CANVAS.width)
    if (withTranslate) {
        ctx.fillText(selectedStroke.ru, CANVAS.width / 2, (CANVAS.height + 140) / 2, CANVAS.width)
    }
    return canvas.toDataURL("image/png")
}