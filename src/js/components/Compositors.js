import React from 'react';
import {Group, CardGrid, InfoRow, Progress, Title, Banner, Avatar, Div} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCompositorsSong} from "../actions";
import {getCompleteTasksOfComp} from "../helpers";
import Card from "@vkontakte/vkui/dist/components/Card/Card";

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
                <Card size="l">
                    <Div>
                        <div><span role='img' aria-label="ear">👂</span> Выбирай своего любимого исполнителя </div>
                        <div><span role='img' aria-label="student hat">🎓</span> Выполняй задания на основе его треков </div>
                        <div><span role='img' aria-label="hands">🙌</span> Делись своей любимой строчкой в историю </div>
                        <div><span role='img' aria-label="wink">😉</span> И еще можешь прикрепить его песню </div>
                    </Div>
                </Card>
            </CardGrid>
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
                            before={<Avatar size={72} src={`./img/comp-${compositor.id}.jpg`} />}
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
