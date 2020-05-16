import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {toggleModalCardSong} from "../actions";

export const Songs = () => {
    const songs = useSelector(state => state.songs, shallowEqual)
    const dispatch = useDispatch()

    return (
        <Group separator="hide">
            <CardGrid>
                {songs.map(item => {
                    const modalCardData = {
                        songId: item.translateId,
                        songName: item.name,
                        tasksId: item.taskId,
                        modalId: 'card-song'
                    }
                    return (
                        <Card key={item.id} size="l" mode="shadow" onClick={() => dispatch(toggleModalCardSong(modalCardData))} style={{ marginBottom: 16 }}>
                            <Div>
                                <Title level="1" weight="semibold" style={{ marginBottom: 16 }}>{item.name}</Title>
                            </Div>
                            <Div>
                                <InfoRow header="Прогресс">
                                    <Progress value={40} />
                                </InfoRow>
                            </Div>
                        </Card>
                    )
                })}
            </CardGrid>
        </Group>
    )
}
