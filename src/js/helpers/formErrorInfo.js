import React from 'react';

export const formErrorInfo = (data) => {
    let info = null
    const errorType = data.error_type;
    const errorData = data.error_data;
    if (errorType === 'client_error') {
        info = (
            <>
                <div>Код ошибки: {errorData.error_code}</div>
                <div>Описание: {errorData.error_reason}</div>
                <div>Подробно: {errorData.error_description}</div>
            </>
        )
    }
    if (errorType === 'api_error') {
        info = (
            <>
                <div>Код ошибки: {errorData.error_code}</div>
                <div>Описание: {errorData.error_msg}</div>
            </>
        )
    }
    if (errorType === 'auth_error') {
        info = (
            <>
                <div>Код ошибки: {errorData.error}</div>
                <div>Описание: {errorData.error_reason}</div>
                <div>Подробно: {errorData.error_description}</div>
            </>
        )
    }
    return info
}