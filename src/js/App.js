import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import { Compositors } from './components/Compositors';
import { Songs } from './components/Songs';
import {
	View,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	ModalRoot,
	ModalCard
} from "@vkontakte/vkui";
import Icon56MusicOutline from '@vkontakte/icons/dist/56/music_outline';
import {
	initialLoad,
	goBack,
	setSelectedTranslate,
	toggleModalCard,
	goToTasks, setProgress, formProgress
} from "./actions";
import ConfigProvider from "@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider";
import {Translate} from "./components/Translate";
import {Task} from "./components/Task";
import * as STORAGE_KEYS from "./constants/storageKeys";
import {HistorySetting} from "./components/HistorySettings";

const App = () => {
	const activePanel = useSelector(state => state.activePanel)
	const stateHistory = useSelector(state => state.history, shallowEqual)
	const popout = useSelector(state => state.popout, shallowEqual)
	const selectedCompositorName = useSelector(state => state.selectedCompositor.name)
	const selectedSongName = useSelector(state => state.selectedSong.name)
	const activeModalData = useSelector(state => state.modalCard)
	const [scheme, setScheme] = useState("bright_light")
	const dispatch = useDispatch()

	const storageResponseHandler = (fetchedStorage) => {
		if (Array.isArray(fetchedStorage.keys)) {
			const data = {}
			fetchedStorage.keys.forEach(({key, value}) => {
				try {
					data[key] = value !== undefined ? JSON.parse(value) : {}
					switch (key) {
						case STORAGE_KEYS.PROGRESS:
							if (!data[key]) {
								dispatch(formProgress())
							} else {
								dispatch(setProgress(data[STORAGE_KEYS.PROGRESS]))
							}
							break;
						default:
							break;
					}
				} catch (e) {
					console.log(e);
				}
			})
		}
		console.log(fetchedStorage)
	}

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			switch (type) {
				case 'VKWebAppUpdateConfig':
					setScheme(data.scheme)
					break
				case 'VKWebAppStorageGetResult':
					storageResponseHandler(data)
					break
				case 'VKWebAppShowStoryBoxResult':
					console.log('data', data)
					break
				case 'VKWebAppShowStoryBoxFailed':
					console.log('data', data)
					break
				default:
					break
			}
		})
		window.addEventListener('popstate', () => {
			dispatch(goBack())
		})
		dispatch(initialLoad())
	}, [dispatch]);

	const closeModalCard = () => dispatch(toggleModalCard(null))

	const modal = (
		<ModalRoot
			activeModal={activeModalData}
			onClose={closeModalCard}
		>
			<ModalCard
				id='card-song'
				className='modal-card__song'
				onClose={closeModalCard}
				icon={<Icon56MusicOutline fill='var(--my-accent)'/>}
				actionsLayout="vertical"
				header={selectedSongName}
				caption={selectedCompositorName}
				actions={
					[
						{
							title: 'Перевод',
							mode: 'commerce',
							action: () => {
								closeModalCard()
								dispatch(setSelectedTranslate())
							}
						},
						{
							title: 'Упражнения',
							mode: 'destructive',
							action: () => {
								closeModalCard()
								dispatch(goToTasks())
							}
						}
					]
				}
			/>
			<HistorySetting id={'history-settings'}/>
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
					<PanelHeader>Исполнители</PanelHeader>
					<Compositors />
				</Panel>

				<Panel id='selected'>
					<PanelHeader
						left={<PanelHeaderBack onClick={() => window.history.back()} />}
					>
						Треки
					</PanelHeader>
					<Songs />
				</Panel>

				{/* перенести в отдельный view */}
				<Panel id='task-0'>
					<Task numberTask={0}/>
				</Panel>

				<Panel id='task-1'>
					<Task numberTask={1}/>
				</Panel>

				<Panel id='task-2'>
					<Task numberTask={2}/>
				</Panel>

				<Panel id='task-3'>
					<Task numberTask={3}/>
				</Panel>

				<Panel id='task-4'>
					<Task numberTask={4}/>
				</Panel>

				<Panel id="translate">
					<PanelHeader
						left={<PanelHeaderBack onClick={() => window.history.back()} />}
					>
						Перевод
					</PanelHeader>
					<Translate />
				</Panel>

			</View>
		</ConfigProvider>
	);
}

export default App;

