import { useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';

import { Button } from '@components/Button';
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { ListEmpty } from '@components/ListEmpty';
import { Loading } from '@components/Loading';
import { PlayerCard } from '@components/PlayerCard';
import { AppError } from '@utils/AppError';

import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playersRemoveByGroup';


import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

type RouteParams = {
    group: string;
}

export function Players() {
    const [isLoading, setisLoading] = useState(true)
    const [newPlayerName, setNewPlayerName] = useState('')
    const [team, setTeam] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

    // const navigation = useNavigation()

    const route = useRoute()
    const { group } = route.params as RouteParams

    const newPlayerNameRef = useRef<TextInput>(null)



    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')

        }


        const newPlayer = {
            name: newPlayerName,
            team,
        }


        try {
            await playerAddByGroup(newPlayer, group);
            newPlayerNameRef.current?.blur()

            setNewPlayerName('')
            fetchPlayersByTeam()

        }

        catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                Alert.alert('Nova pessoa', 'Não foi possível adicionar a pessoa.')

            }
        }
    }




    async function fetchPlayersByTeam() {
        try {
            setisLoading(true)
            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        }
        catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.')
        }
        finally {
            setisLoading(false)

        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group)
            fetchPlayersByTeam()
        }
        catch (error) {
            console.log(error)
            Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa.')
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group)

            // navigation.navigate('groups')

        }
        catch (error) {
        }
    }

    async function handleGroupRemove() {
        Alert.alert('Remover', 'Deseja realmente remover a turma?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() },
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam()
    }, [team]);


    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="adicine a galera e separe os times"
            />

            <Form>
                <Input
                    inputRef={newPlayerNameRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />
                <ButtonIcon
                    onPress={handleAddPlayer}
                    icon='add'
                />
            </Form>



            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isAtive={item === team}
                            onPress={() => { setTeam(item) }}
                        />

                    )}
                    horizontal
                />


                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>


            {isLoading ? <Loading /> :

                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard
                            onRemove={() => handlePlayerRemove(item.name)}
                            name={item.name}
                        />

                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty
                            message='Não há pessoas nesse time.'
                        />
                    )}

                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}

                />
            }
            <Button
                title='Remover Turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />

        </Container>
    )
}