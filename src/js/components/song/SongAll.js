import {CardGrid, Group, Panel, PanelHeader, Spinner} from "@vkontakte/vkui";
import React from "react";
import {useSelector} from "react-redux";
import {Song} from "./Song";
import {SongSearch} from "./SongSearch";

export const SongAll = ({ id }) => {
    const compositors = useSelector(state => state.songs)
    const isFiltered = useSelector(state => state.filtered)

    const content = isFiltered ? (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%' }}>
            <Spinner size="large" style={{ marginTop: 20 }} />
        </div>
    ) : (
        <Group separator="hide">
            <CardGrid style={{ marginTop: 54 }}>
                {compositors.map(compositor => {
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
    console.log(isFiltered)
    return (
        <Panel id={id}>
            <PanelHeader>Songlish</PanelHeader>
            <SongSearch />
            {!!compositors.length && content}
        </Panel>
    )
}