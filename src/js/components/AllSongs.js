import {Panel, PanelHeader} from "@vkontakte/vkui";
import {Compositors} from "./Compositors";
import React from "react";

export const AllSongs = ({ id }) => (
    <Panel id={id}>
        <PanelHeader>Songlish</PanelHeader>
        <Compositors />
    </Panel>
)