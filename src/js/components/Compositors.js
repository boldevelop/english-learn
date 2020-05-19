import React from 'react';
import { Group, CardGrid, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCompositorsSong} from "../actions";
import {getCompleteTasksOfComp} from "../helpers";
import Banner from "@vkontakte/vkui/dist/components/Banner/Banner";

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

                        subheader = `Выполнено ${completeIds.length} из ${numberOfTasks}`
                        actions = (
                            <InfoRow>
                                <Progress value={progressValue}/>
                            </InfoRow>
                        )
                    }

                    const header = <Title level="1" weight="regular" style={{marginBottom: 32}}>{compositor.name}</Title>

                    return (
                        <Banner
                            className={'custom-banner'}
                            kei={compositor.id}
                            mode="tint"
                            asideMode="expand"
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
