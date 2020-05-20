import React from 'react';
import {Group, CardGrid, Title, Banner, Div} from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {setSelectedStroke, toggleModalCard} from "../actions";
import Card from "@vkontakte/vkui/dist/components/Card/Card";

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
                <Card size="l" style={{ marginBottom: 20 }}>
                    <Div>
                        <div>
                            <span role='img' aria-label="wink">🎧</span>
                            &nbsp;Включай трек на фоне
                        </div>
                        <div>
                            <span role='img' aria-label="wink">🤩</span>
                            &nbsp;Проникайся эмоциями исполнителя и смыслом песни
                        </div>
                        <div>
                            <span role='img' aria-label="wink">😎</span>
                            &nbsp;За одно повторяй английский
                        </div>
                        <div>
                            <span role='img' aria-label="wink">😀</span>
                            &nbsp;Нажми на самую душевную строчку и раскажи о ней всем
                        </div>
                    </Div>
                </Card>
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
