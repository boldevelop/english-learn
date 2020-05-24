import {Snackbar} from "@vkontakte/vkui";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import React from "react";
import {useDispatch} from "react-redux";
import {setPopout} from "../actions";
import Icon24Error from '@vkontakte/icons/dist/24/error';

export const SnackbarError = ({message, type}) => {
    const dispatch = useDispatch()
    let icon

    if (type === 'error') {
        icon = (
            <Avatar size={24} style={{backgroundColor: 'var(--dynamic_red)'}}>
                <Icon24Error fill='#fff' width={14} height={14} />
            </Avatar>
        )
    } else {
        icon = (
            <Avatar size={24} style={{backgroundColor: 'var(--field_valid_border)'}}>
                <Icon24Error fill='#fff' width={14} height={14} />
            </Avatar>
        )
    }

    return (
        <Snackbar
            layout='vertical'
            onClose={() => dispatch(setPopout(null))}
            before={icon}
            duration={3000}
        >
            {message}
        </Snackbar>
    )
}