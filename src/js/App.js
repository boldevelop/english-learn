import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import { Compositors } from './components/Compositors';
import { Songs } from './components/Songs';
import {View, Panel, PanelHeader, PanelHeaderBack, ModalRoot, ModalCard} from "@vkontakte/vkui";
import Icon56MusicOutline from '@vkontakte/icons/dist/56/music_outline';
import {initialLoad, setSelectedCompositor, goBack, setSelectedTranslate, toggleModalCardSong} from "./actions";
import ConfigProvider from "@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider";
import {Translate} from "./components/Translate";

const App = () => {
	const activePanel = useSelector(state => state.activePanel)
	const compositors = useSelector(state => state.compositors)
	const stateHistory = useSelector(state => state.history, shallowEqual)
	const translate = useSelector(state => state.translate, shallowEqual)
	const popout = useSelector(state => state.popout, shallowEqual)
	const songs = useSelector(state => state.songs, shallowEqual)
	const selectedCompositorName = useSelector(state => state.selectedCompositorName)
	const activeModalData = useSelector(state => state.modalCardSong, shallowEqual)
	const [scheme, SetScheme] = useState("bright_light")
	const dispatch = useDispatch()

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				SetScheme(data.scheme)
			}
		});
		window.addEventListener('popstate', () => dispatch(goBack()));
		dispatch(initialLoad());
	}, [dispatch]);

	const onClickCompositors = (compositorData) => {
		dispatch(setSelectedCompositor(compositorData))
	}

	const onClickSong = (ModalCardData) => {
		dispatch(toggleModalCardSong(ModalCardData))
	}

	const closeModalData = {
		modalId: null,
		songName: '',
		songId: null
	}

	const modal = (
		<ModalRoot
			activeModal={activeModalData.modalId}
			onClose={() => dispatch(toggleModalCardSong(closeModalData))}
		>
			<ModalCard
				id='card-song'
				onClose={() => dispatch(toggleModalCardSong(closeModalData))}
				icon={<Icon56MusicOutline />}
				actionsLayout="vertical"
				header={activeModalData.songName}
				caption={selectedCompositorName}
				actions={
					[
						{
							title: 'Перевод',
							mode: 'commerce',
							action: () => {
								dispatch(toggleModalCardSong(closeModalData))
								dispatch(setSelectedTranslate(activeModalData.songId))
							}
						},
						{
							title: 'Упражнения',
							mode: 'destructive',
							action: () => {
								console.log('tasks');
							}
						}
					]
				}
			/>
		</ModalRoot>
	)

	return (
		<ConfigProvider isWebView={true} scheme={scheme}>
			<View id="compositors"
				  history={stateHistory} // Ставим историю как массив панелей.
				  onSwipeBack={() => dispatch(goBack())} // При свайпе выполняется данная функция.
				  activePanel={activePanel}
				  popout={popout}
				  modal={modal}
			>
				<Panel id='all'>
					<PanelHeader>Композиторы</PanelHeader>
					{!!compositors.length && <Compositors
						onClick={onClickCompositors}
						compositors={compositors}
					/>}
				</Panel>

				<Panel id='selected'>
					<PanelHeader
						left={
							<PanelHeaderBack onClick={() => window.history.back()} />
						}
					>
						Композиции
					</PanelHeader>
					<Songs songs={songs} onClick={onClickSong} />
				</Panel>

				<Panel id='task'>
					task
				</Panel>

				<Panel id="translate">
					<PanelHeader
						left={
							<PanelHeaderBack onClick={() => window.history.back()} />
						}
					>
						Перевод
					</PanelHeader>
					{translate && <Translate translate={translate}/>}
				</Panel>

			</View>
		</ConfigProvider>
	);
}

export default App;

