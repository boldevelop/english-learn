import React from 'react';
import {Group, CardGrid} from "@vkontakte/vkui";
import {useSelector} from "react-redux";
import {Song} from "./Song";

export const Compositors = () => {
    const compositors = useSelector(state => state.songs)

    return !!compositors.length && (
        <Group separator="hide">
            <CardGrid>
                {compositors.map((compositor, i) => {
                    return compositor.songs.map(song => (
                        <Song
                            key={compositor.id + song.id}
                            song={song}
                            compositor={compositor}
                        />
                    ))
                })}
            </CardGrid>
        </Group>
    )
}
