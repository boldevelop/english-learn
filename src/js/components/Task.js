import React, {useState} from 'react';
import {Group, Div, FixedLayout, PanelHeader, Separator} from "@vkontakte/vkui";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {endTasks, goToNextTask, pushCompletedTask} from "../actions";
import Text from "@vkontakte/vkui/dist/components/Typography/Text/Text";

const metaSymbols = ['*', '$', '#']

const createQuestionFromMatch = (match, style, displayType) => {
    const accentPart = displayType === 'inline' ? (
        <span style={{ color: 'var(--my-accent)', ...style }}>
            {match[2]}
        </span>
    ) : (
        <div style={{ color: 'var(--my-accent)', ...style }}>
            {match[2]}
        </div>
    )
    return (
        <Div>
            <Text style={{ fontSize: '1.1rem', lineHeight: '1.3rem' }}>
                {match[1]}
                {accentPart}
                {match[3]}
            </Text>
        </Div>
    )
}

const parserForQuestion = (question) => {
    let metaSymbol

    // find stroke with "some text #another# text" and identify symbol which stroke have
    for (const sym of metaSymbols) {
        const regExp = new RegExp(`\\${sym}(.+?)\\${sym}`, "g")
        if (question.match(regExp) !== null) {
            metaSymbol = sym
        }
    }

    // exec regexp with detected symbol to "some text #another# text"
    const regExpForMatch = new RegExp(`(.*?)\\${metaSymbol}(.+?)\\${metaSymbol}(.*)`, "g")
    const match = regExpForMatch.exec(question)
    switch (metaSymbol) {
        case '$':
            return createQuestionFromMatch(match, {}, 'inline')
        case '*':
            return createQuestionFromMatch(match, { marginTop: '5px', fontStyle: 'italic' })
        case '#':
            return createQuestionFromMatch(match, { marginTop: '5px', textTransform: 'uppercase' })
        default:
            return createQuestionFromMatch([null ,question], {})
    }
}

export const Task = ({ numberTask }) => {
    const selectedTask = useSelector(state => state.selectedTask, shallowEqual)
    const selectedSong = useSelector(state => state.selectedSong, shallowEqual)
    const [isShowNextButton, setStateNextButton] = useState(false)
    const [userAnswerNumber, setUserAnswerNumber] = useState(-1)
    const dispatch = useDispatch()

    const task = selectedTask[numberTask]
    const lengthOfTask = selectedTask.length
    const nextNumberTask = numberTask + 1
    const songName = selectedSong.name
    const isLast = nextNumberTask === selectedTask.length

    const onClickNextButtonTask = () => {
        if (userAnswerNumber === task.correct) {
            dispatch(pushCompletedTask(task.id))
        }

        dispatch(isLast ? endTasks() : goToNextTask(`task-${nextNumberTask}`))
    }

    const onClickAnswer = (buttonId) => {
        if (isShowNextButton) {
            return;
        }
        setUserAnswerNumber(buttonId);
        setStateNextButton(true)
    }

    const setColorForButton = (answerId, userAnswerId) => {
        if (userAnswerNumber === -1) {
            return "var(--action_sheet_action_foreground)" // начальное состояние всех кнопок
        }
        if (answerId === userAnswerId) {
            if (userAnswerId === task.correct) {
                return "var(--field_valid_border)" // правильный вариант
            } else {
                return "var(--dynamic_red)" // неправильный вариант
            }
        }
        return "var(--background_highlighted)" // остальные
    }

    if (userAnswerNumber === -1) {
        task.answers.sort(() => Math.random() - 0.5)
    }

    const question = parserForQuestion(task.question)

    return (
        <>
            <PanelHeader>{`${songName} ${nextNumberTask}/${lengthOfTask}`}</PanelHeader>
            {question}
            <Separator />
            <Div>
                <Group>
                    {task.answers.map((answer, i) => (
                        <Div key={i}>
                            <Button
                                mode={"tertiary"}
                                onClick={() => onClickAnswer(answer.id)}
                                stretched
                                size='l'
                                style={{ color: setColorForButton(answer.id, userAnswerNumber) }}
                            >
                                {answer.text}
                            </Button>
                        </Div>
                    ))}
                </Group>
            </Div>

            {isShowNextButton &&
                <FixedLayout vertical="bottom">
                    <Div>
                        <Button size="xl" mode="secondary" onClick={onClickNextButtonTask}>
                            {isLast ? 'Завершить' : 'Перейти к следующему'}
                        </Button>
                    </Div>
                </FixedLayout>
            }
        </>
    )
}