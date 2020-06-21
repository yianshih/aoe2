import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, View, RefreshControl, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Content,
    Button,
    Text,
    Subtitle,
    Toast

} from 'native-base'
import Colors from '../../constants/Colors'
import * as actions from '../../store/actions/index'
import { auth } from '../../services/firebase'
import MatchOverview from '../../components/MatchOverview/MatchOverview'
import MatchHistory from '../../components/MatchHistory/MatchHistory'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from '../../components/UI/Spinner/Spinner'
import PlayerCard from '../../components/PlayerCard/PlayerCard'

const SingleMapScreen = props => {

    const gameData = useSelector(state => state.profile.singleMap)
    const steamId = useSelector(state => state.profile.steamId)
    const playerName = useSelector(state => state.profile.name)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState()
    const dispatch = useDispatch()

    // if (gameData === 'unplayed') {
    //     alert("At least 10 games to view")
    // }

    const loadGameData = useCallback(async () => {
        try {
            await dispatch(actions.fetchGameData(steamId, 3))
        } catch (error) {
            setError(error.message);
        }
    }, [dispatch])

    useEffect(() => {
        loadGameData()
    }, [])


    const onRefresh = useCallback(async () => {

        setRefreshing(true)
        try {
            await loadGameData()
            setRefreshing(false)
        } catch (error) {
            setError(error.message)
        }

    }, [refreshing])

    // const refreshHandler = async () => {
    //     console.log('refreshing')
    //     try {
    //         await dispatch(actions.fetchGameData(steamId, 3))
    //         await dispatch(actions.fetchProfile(auth().currentUser.displayName))
    //     } catch (error) {
    //         setError(error.message);
    //     }

    //     Toast.show({
    //         text: "Updated",
    //         style: {
    //             backgroundColor: Colors.danger
    //         },
    //     })

    // }

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
                {/* <Button iconLeft transparent onPress={refreshHandler}>
                    <Ionicons name="refresh" size={30} color={Colors.primary} />
                </Button> */}
            </View>
        )
    }

    if (gameData !== null && gameData !== 'unplayed') {
        content = (
            <View>
                <MatchOverview
                    //refreshHandler={refreshHandler}
                    gameData={gameData}
                    title="1v1 Random Map" />
                <MatchHistory gameType="3" />
            </View>
        )
    }

    if (error) {
        content = (
            <View>
                <Text>Something went wrong!</Text>
                <Button onPress={loadGameData}>
                    <Text>Try Again</Text>
                </Button>
            </View>
        )
    }
    return (
        <Container>
            <Content>
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                <PlayerCard
                    steamId={steamId}
                    playerName={playerName}
                    gameType='3'
                    {...props}
                />
                {/* <View style={styles.card}>
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

export default SingleMapScreen