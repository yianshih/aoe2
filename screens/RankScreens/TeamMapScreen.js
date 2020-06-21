import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Body,
    Content,
    Left,
    Right,
    Title,
    Icon,
    Button,
    Text,
    List,
    ListItem,
    Col,
    Card,
    CardItem
} from 'native-base'
import Colors from '../../constants/Colors'
import * as actions from '../../store/actions/index'
import { auth } from '../../services/firebase'
import MatchOverview from '../../components/MatchOverview/MatchOverview'
import MatchHistory from '../../components/MatchHistory/MatchHistory'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from '../../components/UI/Spinner/Spinner'
import PlayerCard from '../../components/PlayerCard/PlayerCard'

const TeamMapScreen = props => {

    const gameData = useSelector(state => state.profile.teamMap)
    const [error, setError] = useState()
    const steamId = useSelector(state => state.profile.steamId)
    const playerName = useSelector(state => state.profile.name)
    const dispatch = useDispatch()

    const loadGameData = useCallback(async () => {

        try {
            await dispatch(actions.fetchGameData(steamId, 4))
            await dispatch(actions.fetchProfile(auth().currentUser.displayName))
        } catch (error) {
            setError(error.message);
        }
    }, [dispatch])

    useEffect(() => {
        if (gameData === null) loadGameData()
    }, [loadGameData])

    const refreshHandler = () => {
        console.log('refreshing')
        loadGameData()
    }

    let content = (
        <View style={styles.loading}>
            <View style={{ marginTop: 10 }}>
                <Spinner />
            </View>
        </View>
    )

    if (gameData === 'unplayed') {
        content = (
            <View style={styles.loading}>
                <Subtitle style={{ fontSize: 15 }}>At lease 10 games played to view</Subtitle>
                <Button iconLeft transparent onPress={refreshHandler}>
                    <Ionicons name="refresh" size={30} color={Colors.primary} />
                </Button>
            </View>
        )
    }

    if (gameData !== null && gameData !== 'unplayed') {
        content = (
            <View>
                <MatchOverview
                    refreshHandler={refreshHandler}
                    gameData={gameData}
                    title="Team Random Map" />
                <MatchHistory gameType="4" />
            </View>
        )
    }

    if (error) {
        content = (
            <View>
                <Text>Something went wrong!</Text>
                <Text>{error}</Text>
                <Button onPress={loadGameData}>
                    <Text>Try Again</Text>
                </Button>
            </View>
        )
    }

    return (
        <Container>
            <Content>
                <PlayerCard
                    steamId={steamId}
                    playerName={playerName}
                    gameType='4'
                    {...props}
                />
                {/* <View view={styles.card}>
                    {content}
                </View> */}
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 20
    },
    loading: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default TeamMapScreen