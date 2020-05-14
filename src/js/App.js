import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import { Compositors } from './components/Compositors';
import { Songs } from './components/Songs';
import {View, Panel, PanelHeader, PanelHeaderBack, ModalRoot, ModalCard} from "@vkontakte/vkui";
import Icon56MusicOutline from '@vkontakte/icons/dist/56/music_outline';
import {
	initialLoad,
	setSelectedCompositorsSong,
	goBack,
	setSelectedTranslate,
	toggleModalCardSong,
	goToPage, goToTasks
} from "./actions";
import ConfigProvider from "@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider";
import {Translate} from "./components/Translate";
import {Task} from "./components/Task";

const App = () => {
	const activePanel = useSelector(state => state.activePanel)
	const compositors = useSelector(state => state.compositors)
	const stateHistory = useSelector(state => state.history, shallowEqual)
	const translate = useSelector(state => state.translate, shallowEqual)
	const popout = useSelector(state => state.popout, shallowEqual)
	const songs = useSelector(state => state.songs, shallowEqual)
	const songTasks = useSelector(state => state.songTasks, shallowEqual)
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
		dispatch(setSelectedCompositorsSong(compositorData))
	}

	const onClickSong = (ModalCardData) => {
		dispatch(toggleModalCardSong(ModalCardData))
	}

	const onClickNextButtonTask = (taskId) => {
		const isLast = taskId === songTasks.length - 1;
		dispatch(goToPage(isLast ? 'selected' : `task-${taskId}`)) // vmesto goto clear history to select
	}

	const closeModalData = {
		modalId: null,
		songName: '',
		tasksId: [],
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
								dispatch(toggleModalCardSong(closeModalData))
								dispatch(goToTasks({
									tasksId: activeModalData.tasksId,
									songName: activeModalData.songName
								}))
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

				{/* перенести в отдельный view */}
				<Panel id='task-0'>
					<Task
						songName={songTasks.songName}
						task={songTasks.tasks[0]}
						last={3}
						numberTask={0}
						onClickNextButtonTask={onClickNextButtonTask}
					/>
				</Panel>

				<Panel id='task-1'>
					<Task
						songName={songTasks.songName}
						task={songTasks.tasks[1]}
						last={3}
						numberTask={1}
						onClickNextButtonTask={onClickNextButtonTask}
					/>
				</Panel>

				<Panel id='task-2'>
					<Task
						songName={songTasks.songName}
						task={songTasks.tasks[2]}
						last={3}
						numberTask={2}
						onClickNextButtonTask={onClickNextButtonTask}
					/>
				</Panel>

				<Panel id='task-3'>
					<Task
						songName={songTasks.songName}
						task={songTasks.tasks[3]}
						last={3}
						numberTask={3}
						onClickNextButtonTask={onClickNextButtonTask}
					/>
				</Panel>

				<Panel id='task-4'>
					<Task
						songName={songTasks.songName}
						task={songTasks.tasks[4]}
						last={3}
						numberTask={4}
						onClickNextButtonTask={onClickNextButtonTask}
					/>
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

