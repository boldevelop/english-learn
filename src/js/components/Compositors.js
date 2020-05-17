import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCompositorsSong} from "../actions";
import {getCompleteTasksOfComp} from "../helpers";

export const Compositors = () => {
    const compositors = useSelector(state => state.compositors)
    const progress = useSelector(state => state.progress)
    const dispatch = useDispatch()

    return !!compositors.length && (
        <Group separator="hide">
            <CardGrid>
                {compositors.map(compositor => {
                    let isLoadProgress = true
                    let progressValue
                    let numberOfTasks
                    let completeIds

                    if (progress.length) {
                        numberOfTasks = compositor.taskLength;
                        completeIds = getCompleteTasksOfComp(progress, compositor.id)
                        progressValue = completeIds.length / numberOfTasks * 100
                        isLoadProgress = false
                    }

                    return (
                        <Card
                            key={compositor.id}
                            size="l"
                            mode="shadow"
                            onClick={() => dispatch(setSelectedCompositorsSong(compositor))}
                            style={{ marginBottom: 16 }}
                        >
                            <Div>
                                <Title
                                    level="1"
                                    weight="semibold"
                                    style={{ marginBottom: 16 }}
                                >
                                    {compositor.name}
                                </Title>
                            </Div>
                            <Div>
                                {!isLoadProgress &&
                                    <InfoRow header={`Прогресс ${completeIds.length}/${numberOfTasks}`}>
                                        <Progress value={progressValue}/>
                                    </InfoRow>
                                }
                            </Div>
                        </Card>
                    )
                })}
            </CardGrid>
        </Group>
    )
}
