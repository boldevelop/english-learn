import React from 'react';
import { Group, CardGrid, InfoRow, Progress, Title, Banner, Avatar } from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCompositorsSong} from "../actions";
import {getCompleteTasksOfComp} from "../helpers";

const identifyEmojiByType = (type) => {
    switch (type) {
        case 'rap':
            return ' 🤙🏿'
        case 'pop':
            return ' 🕺🏽'
        case 'star':
            return ' 🔥'
        case 'popular':
            return ' 💥'
        default:
            return ''
    }
}

export const Compositors = () => {
    const compositors = useSelector(state => state.compositors)
    const progress = useSelector(state => state.progress)
    const dispatch = useDispatch()

    return !!compositors.length && (
        <Group separator="hide">
            <CardGrid>
                {compositors.map(compositor => {
                    let progressValue
                    let numberOfTasks
                    let completeIds

                    let actions = null
                    let subheader = null

                    if (progress.length) {
                        numberOfTasks = compositor.taskLength;
                        completeIds = getCompleteTasksOfComp(progress, compositor.id)
                        progressValue = completeIds.length / numberOfTasks * 100

                        const completeClass = completeIds.length === numberOfTasks ? 'custom-progress_complete' : ''
                        subheader = `Выполнено ${completeIds.length} из ${numberOfTasks}`

                        actions = (
                            <InfoRow>
                                <Progress value={progressValue} className={`custom-progress ${completeClass}`}/>
                            </InfoRow>
                        )
                    }

                    const header = <Title level="1" weight="regular" style={{marginBottom: 22}}>
                        {compositor.name} {identifyEmojiByType(compositor.type)}
                    </Title>

                    return (
                        <Banner
                            className={'custom-banner'}
                            key={compositor.id}
                            mode="tint"
                            asideMode="expand"
                            before={<Avatar size={72} src={'https://sun9-64.userapi.com/c845420/v845420461/1b6cdc/cujqHbNvawE.jpg?ava=1'} />}
                            onClick={() => dispatch(setSelectedCompositorsSong(compositor))}
                            header={header}
                            subheader={subheader}
                            actions={actions}
                        />
                    )
                })}
            </CardGrid>
        </Group>
    )
}
