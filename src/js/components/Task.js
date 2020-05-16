import React, {useState} from 'react';
import {Group, Div, CardGrid, Card, Title, FixedLayout, PanelHeader } from "@vkontakte/vkui";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {endTasks, goToNextTask} from "../actions";

export const Task = ({ numberTask }) => {
    const selectedTask = useSelector(state => state.selectedTask, shallowEqual)
    const selectedSong = useSelector(state => state.selectedSong, shallowEqual)
    const [isShowNextButton, setStateNextButton] = useState(false)
    const [userAnswerNumber, setUserAnswerNumber] = useState(-1)
    const dispatch = useDispatch()

    const task = selectedTask[numberTask]
    const songName = selectedSong.name

    const onClickNextButtonTask = () => {
        const nextNumberTask = numberTask + 1
        const isLast = nextNumberTask === selectedTask.length
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

    return (
        <>
            <PanelHeader>{songName}</PanelHeader>
            <CardGrid>
                <Card size="l" style={{ marginTop: '3rem' }}>
                    <Div>
                        <Title level="2" weight="semibold" style={{ marginBottom: 16 }}>{task.question}</Title>
                    </Div>
                </Card>
            </CardGrid>
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
                        <Button size="xl" mode="secondary" onClick={onClickNextButtonTask}>Next</Button>
                    </Div>
                </FixedLayout>
            }
        </>
    )
}