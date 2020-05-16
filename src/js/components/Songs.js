import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {setSelectedSong, toggleModalCardSong} from "../actions";

export const Songs = () => {
    const songs = useSelector(state => state.songs, shallowEqual)
    const progress = useSelector(state => state.progress, shallowEqual)
    const dispatch = useDispatch()

    const onClickCard = (songData) => {
        dispatch(setSelectedSong(songData))
        dispatch(toggleModalCardSong('card-song'))
    }

    return (
        <Group separator="hide">
            <CardGrid>
                {songs.map(item => {
                    return (
                        <Card
                            key={item.id}
                            size="l"
                            mode="shadow"
                            onClick={() => onClickCard(item)}
                            style={{ marginBottom: 16 }}
                        >
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
