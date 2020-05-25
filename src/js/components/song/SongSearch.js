import React, {useState} from "react";
import {Div, FixedLayout, Input, Counter} from "@vkontakte/vkui";
import AnimateHeight from 'react-animate-height';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import {Tags} from "./partials/Tags";
import {useDispatch, useSelector} from "react-redux";
import {setFilterSong, setSearchValue} from "../../actions";

export const SongSearch = () => {
    const searchValue = useSelector(state => state.searchValue)
    const activeTag = useSelector(state => state.activeTag)
    const [height, setHeight] = useState(0)
    const dispatch = useDispatch()

    const isClosed = height === 0
    const rotateDeg = isClosed ? 0 : -180

    const onChange = e => {
        const { value } = e.currentTarget
        dispatch(setSearchValue(value))
        dispatch(setFilterSong())
    }

    const toggleFilters = () => {
        setHeight(isClosed ? 'auto' : 0)
    }

    return (
        <FixedLayout vertical="top" filled={true} className='custom-fixed-layout'>
            <Div className='search'>
                <div onClick={toggleFilters} className='search__trigger'>
                    <div className='search__trigger'>
                        <div style={{ marginRight: 8 }}>Фильтры</div>
                        {!!activeTag && (
                            <Counter size="s">{activeTag}</Counter>
                        )}
                    </div>
                    <Icon16Dropdown
                        fill='var(--my-accent)'
                        className='search__trigger-icon'
                        style={{ transform: `rotate(${rotateDeg}deg)`}}
                    />
                </div>
                <AnimateHeight duration={ 300 } height={ height } contentClassName='search__content'>
                    <div className='search__input'>
                        <Input
                            type="text"
                            placeholder='Schulz'
                            name="search"
                            value={searchValue}
                            onChange={onChange}
                        />
                    </div>
                    <Tags />
                </AnimateHeight>
            </Div>
        </FixedLayout>
    )
}