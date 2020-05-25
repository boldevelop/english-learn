import { Banner, InfoRow, Progress} from "@vkontakte/vkui";
import React from "react";
import {getCompleteTasksOfSong} from "../../helpers";
import {useDispatch, useSelector} from "react-redux";
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import {SongHeader} from "./SongHeader";
import {setSelectedCompositor, setSelectedSong, toggleModalCard} from "../../actions";

export const Song = ({ song, compositor }) => {
    const progress = useSelector(state => state.progress)
    const dispatch = useDispatch()

    let actions = null
    let completeIcon = null
    let subheader = null
    let completeClass = ''

    if (progress.length) {
        const numberOfTasks = song.tasksId.length
        const completeIds = getCompleteTasksOfSong(progress, compositor.id, song.id)
        const progressValue = completeIds.length / numberOfTasks * 100
        const isComplete = completeIds.length === numberOfTasks

        completeClass = isComplete ? 'complete' : ''
        completeIcon = isComplete ? <Icon28CheckCircleOutline fill='var(--field_valid_border)'/> : ''
        subheader = `Выполнено ${completeIds.length} из ${numberOfTasks}`

        actions = (
            <InfoRow>
                <Progress value={progressValue} className={`custom-progress`}/>
            </InfoRow>
        )
    }

    const header = <SongHeader
        feat={song.feat}
        songName={song.name}
        compId={compositor.id}
        compName={compositor.name}
        completeIcon={completeIcon}
    />

    const onClickSong = () => {
        dispatch(setSelectedSong(song))
        dispatch(setSelectedCompositor(compositor))
        dispatch(toggleModalCard('card-song'))
    }

    return (
        (
            <Banner
                className={`custom-banner ${completeClass}`}
                key={song.id}
                mode="tint"
                asideMode="expand"
                onClick={onClickSong}
                header={header}
                subheader={subheader}
                actions={actions}
            />
        )
    )
}