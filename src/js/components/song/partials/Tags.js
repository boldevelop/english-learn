import React from "react";
import Ripples from "react-ripples";
import {useDispatch, useSelector} from "react-redux";
import {setFilterSong, setSearchValue, setTag} from "../../../actions";

const tags = ['hip-hop', 'pop', 'edm']

export const Tags = () => {
    const activeTag = useSelector(state => state.activeTag)
    const searchValue = useSelector(state => state.searchValue)
    const dispatch = useDispatch()

    const onClickTag = (text) => {
        dispatch(setTag(activeTag === text ? '' : text))
        dispatch(setSearchValue(searchValue))
        dispatch(setFilterSong())
    }

    const onClickClear = () => {
        dispatch(setTag(''))
        dispatch(setSearchValue(''))
        dispatch(setFilterSong())
    }

    return (
        <div className='tags'>
            {tags.map((text, i) => {
                return (
                    <Ripples key={i} color='#aa69ff' className='tags-item' onClick={() => onClickTag(text)}>
                        <span >{text}</span>
                    </Ripples>
                )
            })}
            <Ripples color='var(--header_text)' className='tags-item tags-item_clean' onClick={onClickClear}>
                <span >очистить</span>
            </Ripples>
        </div>
    )
}