import {Avatar, Title} from "@vkontakte/vkui";
import Caption from "@vkontakte/vkui/dist/components/Typography/Caption/Caption";
import React from "react";

export const SongHeader = ({ feat, compId, compName, songName, completeIcon}) => {
    const songFeat = feat ? (
        <>
            <br />
            feat: {feat}
        </>
    ) : null

    return (
        <div className='custom-banner__header'>
            <div className='custom-banner__avatar'>
                <Avatar size={60} mode="image" src={`./img/comp-${compId}.jpg`} />
            </div>
            <div className='custom-banner__content'>
                <Title level="2" weight="regular" className='custom-banner__content-title'>
                    {compName}&nbsp;{completeIcon}
                </Title>
                <Caption
                    level="1"
                    weight="regular"
                    style={{color: 'var(--header_search_field_tint)'}}>
                    {songName}{songFeat}
                </Caption>
            </div>
        </div>
    )
}