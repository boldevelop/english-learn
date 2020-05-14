import React, {useState} from 'react';
import {Group, CardGrid, Title, Separator, PanelHeader} from "@vkontakte/vkui";
import Button from "@vkontakte/vkui/dist/components/Button/Button";

export const Task = ({ task, numberTask, last, onClickNextButtonTask, songName }) => {

    const [isShowNextButton, setStateNextButton] = useState(false)

    const onClickAnswer = (id) => {
        setStateNextButton(true)
    }

    const onClickNextButton = () => {
        onClickNextButtonTask(numberTask + 1)
    }

    return (
        <>
            <PanelHeader>{songName}</PanelHeader>
            <Group separator="hide">
                <Title level="3" weight="medium" style={{ marginBottom: 16 }}>{task.question}</Title>
                <Separator />
                <CardGrid>
                    {task.answers.map((answer, i) => (
                        <Button mode="overlay_outline" key={i} onClick={() => onClickAnswer(answer.id)}>{answer.text}</Button>
                    ))}
                </CardGrid>
                {isShowNextButton && <Button size="xl" mode="secondary" onClick={onClickNextButton}>Next</Button>}
            </Group>
        </>
    )
}