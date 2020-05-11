import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";

export const Compositors = ({ onClick, compositors }) => {
    return (
        <Group separator="hide">
            <CardGrid>
                {compositors.map(item => (
                    <Card key={item.id} size="l" mode="shadow" onClick={() => onClick(item.songId)} style={{ marginBottom: 16 }}>
                        <Div>
                            <Title level="1" weight="semibold" style={{ marginBottom: 16 }}>{item.name}</Title>
                        </Div>
                        <Div>
                            <InfoRow header="Прогресс">
                                <Progress value={40} />
                            </InfoRow>
                        </Div>
                    </Card>
                ))}
            </CardGrid>
        </Group>
    )
}
