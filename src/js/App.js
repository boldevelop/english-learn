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
} from "@vkontakte/vkui";
import {
	initialLoad,
	goBack,
	toggleModalCard,
	setProgress, formProgress, setPopout
} from "./actions";
import ConfigProvider from "@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider";
import {Translate} from "./components/Translate";
import {Task} from "./components/Task";
import * as STORAGE_KEYS from "./constants/storageKeys";
import {HistorySetting} from "./components/HistorySettings";
import {CardSong} from "./components/CardSong";
import {formErrorInfo} from "./helpers/formErrorInfo";
import {SnackbarError} from "./components/SnackbarError";

const App = () => {
	const activePanel = useSelector(state => state.activePanel)
	const stateHistory = useSelector(state => state.history, shallowEqual)
	const popout = useSelector(state => state.popout, shallowEqual)
	const activeModalData = useSelector(state => state.modalCard)
	const songName = useSelector(state => state.selectedSong.name)
	const [scheme, setScheme] = useState("bright_light")
	const dispatch = useDispatch()

	useEffect(() => {
		const storageResponseHandler = (fetchedStorage) => {
			if (Array.isArray(fetchedStorage.keys)) {
				const data = {}
				fetchedStorage.keys.forEach(({key, value}) => {
					try {
						data[key] = value ? JSON.parse(value) : {}
						switch (key) {
							case STORAGE_KEYS.PROGRESS:
								if (data[key] && data[key].progress) {
									dispatch(setProgress(data[key].progress))
								} else {
									dispatch(formProgress())
								}
								break;
							default:
								break;
						}
					} catch (error) {
						dispatch(
							setPopout(<SnackbarError message='Проблема с получением данных из Storage' type='error' />)
						)
					}
				})
			}
		}

		bridge.subscribe(({ detail: { type, data } }) => {
			if (data.hasOwnProperty('error_type') && data.hasOwnProperty('error_data') && type !== 'VKWebAppShowStoryBoxFailed') {
				const info = formErrorInfo(data)
				dispatch(setPopout(<SnackbarError message={info} type='error' />))
			}

			switch (type) {
				case 'VKWebAppUpdateConfig':
					setScheme(data.scheme)
					break
				case 'VKWebAppStorageGetResult':
					storageResponseHandler(data)
					break
				case 'VKWebAppShowStoryBoxResult':
					dispatch(setPopout(<SnackbarError message='Опубликовано' type='info'/>))
					break
				case 'VKWebAppShowStoryBoxFailed':
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


	const modal = (
		<ModalRoot
			activeModal={activeModalData}
			onClose={() => dispatch(toggleModalCard(null))}
		>
			<CardSong id='card-song' />
			<HistorySetting id='history-settings' />
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
						{songName}
					</PanelHeader>
					<Translate />
				</Panel>

			</View>
		</ConfigProvider>
	);
}

export default App;

