import React from 'react';
import { Group, CardGrid, Card, Div, InfoRow, Progress, Title } from "@vkontakte/vkui";

export const Songs = ({ onClick, songs }) => {
    return (
        <Group separator="hide">
            <CardGrid>
                {songs.map(item => (
                    <Card key={item.id} size="l" mode="shadow" onClick={() => onClick('all')} style={{ marginBottom: 16 }}>
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
