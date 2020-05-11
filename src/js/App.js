import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import { Root } from '@vkontakte/vkui';
import { Compositors } from './components/Compositors';
import { Songs } from './components/Songs';
import { View, Panel, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui";
import { initialLoad, setSelectedCompositor, goBack } from "./actions";
import ConfigProvider from "@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider";

const App = () => {
	const activeView = useSelector(state => state.activeView)
	const activePanel = useSelector(state => state.activePanel)
	const compositors = useSelector(state => state.compositors)
	const stateHistory = useSelector(state => state.history, shallowEqual)
	const popout = useSelector(state => state.popout, shallowEqual)
	const songs = useSelector(state => state.songs, shallowEqual)
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

	const onClickCompositors = (arraySongsId) => {
		dispatch(setSelectedCompositor(arraySongsId))
	}

	const onGoToPage = () => {

	}

	return (
		<ConfigProvider isWebView={true} scheme={scheme}>
			<Root activeView={activeView} popout={popout}>
				<View id="compositors"
					  history={stateHistory} // Ставим историю как массив панелей.
					  onSwipeBack={() => dispatch(goBack())} // При свайпе выполняется данная функция.
					  activePanel={activePanel}
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
						<Songs songs={songs} onClick={() => window.history.back()} />
					</Panel>
					<Panel id='task'>
						task
					</Panel>
				</View>

				<View id="translate" activePanel="song">
					<Panel id="song">
						translate song
					</Panel>
				</View>

			</Root>
		</ConfigProvider>
	);
}

export default App;

