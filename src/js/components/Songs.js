import React from 'react';
import { Group, CardGrid, InfoRow, Progress, Title } from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {setSelectedSong, toggleModalCard} from "../actions";
import {getCompleteTasksOfSong} from "../helpers";
import Banner from "@vkontakte/vkui/dist/components/Banner/Banner";
import Caption from "@vkontakte/vkui/dist/components/Typography/Caption/Caption";
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';

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
                    const isComplete = completeIds.length === numberOfTasks
                    const completeClass = isComplete ? 'complete' : ''
                    const completeIcon = isComplete ? <Icon28CheckCircleOutline fill='var(--field_valid_border)'/> : ''

                    let header = <Title level="1" weight="regular" style={{marginBottom: 32, display: 'flex', justifyContent: 'space-between' }}>
                        {song.name}&nbsp;{completeIcon}
                    </Title>
                    if (song.feat) {
                        header = (
                            <>
                                <Title level="1" weight="regular" style={{ display: 'flex', justifyContent: 'space-between' }}>{song.name}&nbsp;{completeIcon}</Title>
                                <Caption
                                    level="1"
                                    weight="regular"
                                    style={{
                                        marginBottom: 16,
                                        color: 'var(--header_search_field_tint)'
                                    }}>
                                    feat: {song.feat}
                                </Caption>
                            </>
                        )
                    }



                    return (
                        <Banner
                            className={`custom-banner custom-banner_song ${completeClass}`}
                            key={song.id}
                            mode="tint"
                            asideMode="expand"
                            onClick={() => onClickCard(song)}
                            header={header}
                            subheader={`Выполнено ${completeIds.length} из ${numberOfTasks}`}
                            actions={
                                <InfoRow>
                                    <Progress value={progressValue}  className={`custom-progress ${completeClass}`}/>
                                </InfoRow>
                            }
                        />
                    )
                })}
            </CardGrid>
        </Group>
    )
}
