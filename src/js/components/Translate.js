import React, {useRef} from 'react';
import { Group, CardGrid, Card, Text, Title, Div, Separator } from "@vkontakte/vkui";
import {shallowEqual, useSelector} from "react-redux";
import bridge from '@vkontakte/vk-bridge';

const canvasWith = 1080
const canvasHeight = 1920

export const Translate = () => {
    const canvasRef = useRef(null)
    const translate = useSelector(state => state.translate, shallowEqual)

    const onClickStroke = async (strokeData) => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.font = "62px sans"
        ctx.fillStyle = "#ABB8C3";
        ctx.fillRect(0, 0, canvasWith, canvasHeight);
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = "#00D084"
        const emo = String.fromCodePoint(0x1F60E)
        ctx.fillText(strokeData.en  + emo, canvasWith / 2, canvasHeight / 2, canvasWith)

        try {
            const blob = canvasRef.current.toDataURL("image/png")
            await bridge.send(
                "VKWebAppShowStoryBox",
                {
                    "background_type" : "image",
                    blob
                });
        } catch(e) {
            console.log(e)
        } finally {
            ctx.clearRect(0, 0, canvasWith, canvasWith);
        }
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
                <canvas ref={canvasRef} width={canvasWith} height={canvasHeight} style={{display: 'none'}}/>
            </CardGrid>
        </Group>
    )
}
