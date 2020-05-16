import React from 'react';
import { Group, CardGrid, Card, Text, Title, Div, Separator } from "@vkontakte/vkui";
import {shallowEqual, useSelector} from "react-redux";

export const Translate = () => {
    const translate = useSelector(state => state.translate, shallowEqual)

    return translate && (
        <Group separator="hide">
            <CardGrid>
                {!!translate.text.length && translate.text.map( item =>
                    item.type ? (
                        <Title key={Math.random()} level="2" weight="semibold">
                            {item.type}
                        </Title>
                    ) : (
                        <Card key={Math.random()} size="l" mode="shadow">
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
