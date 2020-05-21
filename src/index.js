import "core-js/features/map"
import "core-js/features/set"
import React from "react"
import ReactDOM from "react-dom"
import bridge from "@vkontakte/vk-bridge"
import App from "./js/App"
import { Provider } from 'react-redux'
import store from './js/store'
import './styles/styles.css'

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById("root"));
import("./eruda").then(({ default: eruda }) => { }); //runtime download
// if (process.env.NODE_ENV === "development") {
//     import("./eruda").then(({ default: eruda }) => { }); //runtime download
// }
