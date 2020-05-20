import {goToTasks, setSelectedTranslate, toggleModalCard} from "../actions";
import Icon56MusicOutline from '@vkontakte/icons/dist/56/music_outline';
import {ModalCard} from "@vkontakte/vkui";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export const CardSong = ({ id }) => {
    const dispatch = useDispatch()
    const selectedCompositorName = useSelector(state => state.selectedCompositor.name)
    const selectedSongName = useSelector(state => state.selectedSong.name)

    const closeModalCard = () => dispatch(toggleModalCard(null))

    return (
        <ModalCard
            id={id}
            className='modal-card__song'
            onClose={closeModalCard}
            icon={<Icon56MusicOutline fill='var(--my-accent)'/>}
            actionsLayout="vertical"
            header={selectedSongName}
            caption={selectedCompositorName}
            actions={
                [
                    {
                        title: 'Перевод',
                        mode: 'commerce',
                        action: () => {
                            closeModalCard()
                            dispatch(setSelectedTranslate())
                        }
                    },
                    {
                        title: 'Упражнения',
                        mode: 'destructive',
                        action: () => {
                            closeModalCard()
                            dispatch(goToTasks())
                        }
                    }
                ]
            }
        />
    )
}