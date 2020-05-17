import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {setSelectedSong, toggleModalCard} from "../actions";
import {getCompleteTasksOfSong} from "../helpers";

export const Songs = () => {
    const selectedCompositorId = useSelector(state => state.selectedCompositor.id, shallowEqual)
    const songs = useSelector(state => state.songs, shallowEqual)
    const progress = useSelector(state => state.progress, shallowEqual)
    const dispatch = useDispatch()

    const onClickCard = (songData) => {
        dispatch(setSelectedSong(songData))
        dispatch(toggleModalCard('card-song'))
    }

    return (
        <Group separator="hide">
            <CardGrid>
                {songs.map(song => {
                    const numberOfTasks = song.tasksId.length;
                    const completeIds = getCompleteTasksOfSong(progress, selectedCompositorId, song.id)
                    const progressValue = completeIds.length / numberOfTasks * 100

                    return (
                        <Card
                            key={song.id}
                            size="l"
                            mode="shadow"
                            onClick={() => onClickCard(song)}
                            style={{ marginBottom: 16 }}
                        >
                            <Div>
                                <Title level="1" weight="semibold" style={{ marginBottom: 16 }}>{song.name}</Title>
                            </Div>
                            <Div>
                                <InfoRow header={`Прогресс ${completeIds.length}/${numberOfTasks}`}>
                                    <Progress value={progressValue}/>
                                </InfoRow>
                            </Div>
                        </Card>
                    )
                })}
            </CardGrid>
        </Group>
    )
}
