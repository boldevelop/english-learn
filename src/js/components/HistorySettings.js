import {publishHistory, toggleModalCard} from "../actions";
import {
    ANDROID,
    IOS,
    ModalPage,
    ModalPageHeader,
    PanelHeaderButton,
    usePlatform,
    Card,
    Text,
    Button
} from "@vkontakte/vkui";
import React, { useRef, useState } from "react";
import Swatch from 'react-color/lib/components/common/Swatch.js'
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import Checkbox from "@vkontakte/vkui/dist/components/Checkbox/Checkbox";
import CardGrid from "@vkontakte/vkui/dist/components/CardGrid/CardGrid";
import Headline from "@vkontakte/vkui/dist/components/Typography/Headline/Headline";
import * as CANVAS from "../constants/canvas";

const backgroundArrayColors = ['#FFFFFF', '#FCB900', '#FF6900', '#7BDCB5', '#7c3fcc', '#05386B', '#000000']
const textArrayColors = ['#000000', '#282828', '#00D084', '#430d00', '#7BDCB5', '#dcfa6e', '#FFFFFF']
const swatchStyles = {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    margin: '0 0 6px 0',
}

const ColorPicker = ({ type, onClick, colors, title }) => {
    return (
        <Div>
            <Headline weight="medium" >{title}</Headline>
            <Div style={{    display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center', }}>
                {colors.map( (color, i) => (
                    <Swatch
                        key={i}
                        color={color}
                        hex={color}
                        style={swatchStyles}
                        onClick={(color) => onClick(color, type) }
                        onHover={() => {}}
                        focusStyle={{
                            boxShadow: `0 0 4px ${color}`,
                        }}
                    />
                ))}
            </Div>

        </Div>
    )
}

export const HistorySetting = ({ id }) => {
    const selectedStroke = useSelector(state => state.selectedStroke, shallowEqual)

    const [bgColor, setBgColor] = useState('#7c3fcc')
    const [textColor, setTextColor] = useState('#000000')
    const [withTranslate, toggleWithTranslate] = useState(true)

    const canvasRef = useRef(null)
    const dispatch = useDispatch()
    const platform = usePlatform()

    const isAndroid = platform === ANDROID
    const isIos = platform === IOS

    const closeModalCard = () => dispatch(toggleModalCard(null))

    const textStyle = {
        textAlign: 'center',
        color: textColor
    }

    const cardStyle = {
        marginBottom: '1.5rem',
        backgroundColor: bgColor
    }

    const onClickSetColor = (color, type) => {
        if (type === 'text') {
            setTextColor(color)
        } else {
            setBgColor(color)
        }
    }

    const submitSettings = () => {
        dispatch(publishHistory({
            canvas: canvasRef.current,
            withTranslate,
            bgColor,
            textColor
        }))
    }

    return (
        <ModalPage
            id={id}
            onClose={() => {
                dispatch(toggleModalCard(null))
            }}
            header={
                <ModalPageHeader
                    left={isAndroid && <PanelHeaderButton onClick={closeModalCard}><Icon24Cancel /></PanelHeaderButton>}
                    right={
                        <>
                            {isAndroid && <PanelHeaderButton onClick={submitSettings}><Icon24Done /></PanelHeaderButton>}
                            {isIos && <PanelHeaderButton onClick={submitSettings}>Готово</PanelHeaderButton>}
                        </>
                    }
                >
                    В историю
                </ModalPageHeader>
            }>

            <Div>
                <Text weight="regular" style={{ marginBottom: '.5rem' }}>
                    <span role='img' aria-label="ear">🔥</span> Настройте под свои эмоции и поделитесь ею с друзьями
                </Text>
            </Div>

            <CardGrid>
                <Card size="l" style={cardStyle} >
                    <Div>
                        <Text style={textStyle}>{selectedStroke.en}</Text>
                        {withTranslate && <Text style={textStyle}>{selectedStroke.ru}</Text>}
                    </Div>
                </Card>
            </CardGrid>

            <Checkbox
                checked={withTranslate}
                onChange={() => toggleWithTranslate(!withTranslate)}
            >
                С русским переводом
            </Checkbox>

            <ColorPicker
                title='Цвет фона'
                colors={backgroundArrayColors}
                type='back'
                onClick={onClickSetColor}
            />

            <ColorPicker
                title='Цвет текста'
                colors={textArrayColors}
                type='text'
                onClick={onClickSetColor}
            />

            <Div>
                <Button onClick={submitSettings} size="xl" mode="secondary" style={{background: 'var(--my-accent)'}}>
                    Открыть редактор истории
                </Button>
            </Div>

            <canvas ref={canvasRef} width={CANVAS.width} height={CANVAS.height} style={{display: 'none'}}/>
        </ModalPage>
    )
}