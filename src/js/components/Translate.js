import React from 'react';
import { Group, CardGrid, Title, Banner } from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {setSelectedStroke, toggleModalCard} from "../actions";

export const Translate = () => {
    const translate = useSelector(state => state.translate, shallowEqual)
    const dispatch = useDispatch()

    const onClickStroke = strokeData => {
        dispatch(setSelectedStroke(strokeData))
        dispatch(toggleModalCard('history-settings'))
    }

    return translate && (
        <Group separator="hide">
            <CardGrid>
                {!!translate.text.length && translate.text.map( item =>
                    item.type ? (
                        <Title key={Math.random()} level="2" weight="regular" style={{ marginTop: 20, color: 'var(--my-accent)' }}>
                            {item.type}
                        </Title>
                    ) : (
                        <Banner
                            key={Math.random()}
                            className={`custom-banner custom-banner_translate`}
                            header={item.en}
                            subheader={item.ru}
                            asideMode="expand"
                            onClick={() => onClickStroke(item)}
                        />
                    )
                )}

            </CardGrid>
        </Group>
    )
}
