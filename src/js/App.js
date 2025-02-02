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
	Snackbar
} from "@vkontakte/vkui";
import {
	initialLoad,
	goBack,
	toggleModalCard,
	setProgress, formProgress
} from "./actions";
import ConfigProvider from "@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider";
import {Translate} from "./components/Translate";
import {Task} from "./components/Task";
import * as STORAGE_KEYS from "./constants/storageKeys";
import {HistorySetting} from "./components/HistorySettings";
import {CardSong} from "./components/CardSong";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import Icon24Error from '@vkontakte/icons/dist/24/error';

const App = () => {
	const activePanel = useSelector(state => state.activePanel)
	const stateHistory = useSelector(state => state.history, shallowEqual)
	const popout = useSelector(state => state.popout, shallowEqual)
	const activeModalData = useSelector(state => state.modalCard)
	const [scheme, setScheme] = useState("bright_light")
	const [snackbar, setSnackbar] = useState(null)
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
						setSnackbar(<Snackbar
								layout='vertical'
								onClose={() => setSnackbar(null)}
								before={<Avatar size={24} style={{backgroundColor: 'var(--dynamic_red)'}}><Icon24Error fill='#fff' width={14} height={14} /></Avatar>}
								duration={1000}
							>
								Проблема с получением данных из Storage
							</Snackbar>
						);
					}
				})
			}
		}

		bridge.subscribe(({ detail: { type, data } }) => {
			if (data.hasOwnProperty('error_type') && data.hasOwnProperty('error_data') && type !== 'VKWebAppShowStoryBoxFailed') {
				const errorType = data.error_type;
				const errorData = data.error_data;
				let info = null
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
				setSnackbar(
					<Snackbar
						layout='vertical'
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={{backgroundColor: 'var(--dynamic_red)'}}><Icon24Error fill='#fff' width={14} height={14} /></Avatar>}
						duration={1000}
					>
					{info}
					</Snackbar>
				);
			}

			switch (type) {
				case 'VKWebAppUpdateConfig':
					setScheme(data.scheme)
					break
				case 'VKWebAppStorageGetResult':
					storageResponseHandler(data)
					break
				case 'VKWebAppShowStoryBoxResult':
					setSnackbar(
						<Snackbar
							layout='vertical'
							onClose={() => setSnackbar(null)}
							before={<Avatar size={24} style={{backgroundColor: 'var(--field_valid_border)'}}><Icon24Error fill='#fff' width={14} height={14} /></Avatar>}
							duration={3000}
						>
							Опубликовано
						</Snackbar>
					);
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
				  popout={popout || snackbar}
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

