import React from 'react';
import { Group, CardGrid, Card, Text, Title, Div, Separator } from "@vkontakte/vkui";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {setSelectedStroke, toggleModalCard} from "../actions";

export const Translate = () => {
    const dispatch = useDispatch()

    const translate = useSelector(state => state.translate, shallowEqual)

    const onClickStroke = async (strokeData) => {
        dispatch(setSelectedStroke(strokeData))
        dispatch(toggleModalCard('history-settings'))
    }

    return translate && (
        <Group separator="hide">
            <CardGrid>
                {!!translate.text.length && translate.text.map( item =>
                    item.type ? (
                        <Title key={Math.random()} level="2" weight="semibold">
                            {item.type}
                        </Title>
                    ) : (
                        <Card key={Math.random()} size="l" mode="shadow" onClick={() => onClickStroke(item)}>
                            <Div>
                                <Title level="3" weight="semibold">{item.en}</Title>
                                <Separator style={{ margin: '12px 0' }} />
                                <Text weight="regular">{item.ru}</Text>
                            </Div>
                        </Card>
                    )
                )}

            </CardGrid>
        </Group>
    )
}
