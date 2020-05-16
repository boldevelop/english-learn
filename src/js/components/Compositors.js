import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCompositorsSong} from "../actions";

export const Compositors = () => {
    const compositors = useSelector(state => state.compositors)
    const progress = useSelector(state => state.progress)
    const dispatch = useDispatch()

    return !!compositors.length && (
        <Group separator="hide">
            <CardGrid>
                {compositors.map(item => {
                    let isLoadProgress = true
                    let progressValue

                    if (progress.length) {
                        const complete = progress.filter(p => p.compId === item.id)[0].completeTaskIds
                        progressValue = complete.length / item.taskLength * 100
                        isLoadProgress = false
                    }

                    return (
                        <Card
                            key={item.id}
                            size="l"
                            mode="shadow"
                            onClick={() => dispatch(setSelectedCompositorsSong(item))}
                            style={{ marginBottom: 16 }}
                        >
                            <Div>
                                <Title level="1" weight="semibold" style={{ marginBottom: 16 }}>{item.name}</Title>
                            </Div>
                            <Div>
                                {!isLoadProgress && <InfoRow header="Прогресс">
                                    <Progress value={progressValue}/>
                                </InfoRow>}
                            </Div>
                        </Card>
                    )
                })}
            </CardGrid>
        </Group>
    )
}
