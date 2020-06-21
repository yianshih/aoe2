import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Card,
    CardItem,
    Text,
    Body,
    Button,
    Toast,
    Right,
    Left,
    Segment,
    Subtitle,
    Icon,
    ListItem,
    List,
    Container,
    Content
} from 'native-base'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet, RefreshControl, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import Colors from '../../constants/Colors'
import {
    LineChart
} from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { findGameTypeShort, findMap, findMonth } from '../../constants/StringData'
import { calculateTimeAgo } from '../../shared/utility'
import Spinner from '../UI/Spinner/Spinner'

const MatchesOverview = props => {

    //console.log('[ MatchesOverview ] props : ', props)
    const [error, setError] = useState('')

    //const screenWidth = Dimensions.get("window").width
    const steamId = useSelector(state => state.profile.steamId)
    const [matchData, setMatchData] = useState()
    const [refreshing, setRefreshing] = useState(false)
    //const [dataCount, setDataCount] = useState(10)

    useEffect(() => {
        if (steamId) fetchHistory()
    }, [steamId])

    const fetchHistory = async () => {
        //let targetPlayer = props.steamId ? props.steamId : steamId
        if (!props.steamId) return
        try {
            //console.log("targetPlayer : ", targetPlayer)
            const response = await fetch(`https://aoe2.net/api/player/matches?game=aoe2de&steam_id=${props.steamId}&count=10`)
            if (!response.ok) {
                setError('Player Not Found!')
                //throw new Error('Something went wrong!')
            }
            const resData = await response.json()
            //let tempRate = []
            //let tempDate = []
            let matches = []

            for (let i = 0; i < resData.length; i++) {
                if (!resData[i].finished) continue
                let isWon
                for (let j = 0; j < resData[i].players.length; j++) {
                    if (resData[i].players[j].steam_id === props.steamId) {
                        if (resData[i].players[j].won === null) isWon = 'Processing'
                        else if (resData[i].players[j].won) isWon = 'Victory'
                        else isWon = 'Defeat'
                    }
                }
                //const date = new Date(resData[i].finished * 1000);
                //const convertedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                matches.push({
                    players: resData[i].players,
                    id: resData[i].match_id,
                    gameType: findGameTypeShort(resData[i].leaderboard_id),
                    mapType: findMap(resData[i].map_type),
                    won: isWon,
                    timeAgo: calculateTimeAgo(resData[i].finished),
                    //started: convertedDate,
                    finishedOri: resData[i].finished,
                    startedOri: resData[i].started
                })
                // tempRate.push(resData[i].rating)
                // tempDate.push(convertedDate)
            }
            setMatchData(matches)

        } catch (error) {
            console.log('Fetch Match History failed : ', error)
            //throw error
        }
    }

    const onRefresh = useCallback(async () => {

        setRefreshing(true)
        try {
            await fetchHistory()
            setRefreshing(false)
        } catch (error) {
            setError(error.message)
        }

    }, [refreshing])

    const matches = matchData
        ? matchData.map(m => {
            return (
                <TouchableWithoutFeedback
                    key={m.id}
                    onPress={() => props.navigation.navigate('MatchDetail', {
                        matchDate: m.started,
                        players: m.players,
                        started: m.startedOri,
                        finished: m.finishedOri,
                        mapType: m.mapType,
                        gameType: m.gameType,
                    })}>
                    <ListItem style={styles.matchItem}>
                        <Left>
                            <Text
                                style={{
                                    color: m.won === 'Processing'
                                        ? Colors.chessQueen
                                        : m.won === 'Defeat'
                                            ? 'red'
                                            : Colors.primary
                                }}>{m.won === 'Victory' ? 'Victory' : m.won === 'Processing' ? 'Processing' : 'Defeat'}</Text>
                        </Left>
                        <Body>
                            <View style={styles.itemRight}>
                                <Text>{` ${m.gameType} `}</Text>
                                <View style={{ marginLeft: 30 }}>
                                    <Subtitle style={{ fontSize: 15 }}>{` ${m.timeAgo} `}</Subtitle>
                                </View>
                            </View>
                        </Body>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                </TouchableWithoutFeedback>)
        })
        : null

    return (
        error
            ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>{error}</Text>
            </View>
            : matchData
                ? <Container>
                    <Content>
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        <List>
                            {matches}
                        </List>
                    </Content>
                </Container>
                : props.steamId
                    ? <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Subtitle style={{ fontSize: 15 }}>Player Not Found</Subtitle>
                    </View>
                    : <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                        <Spinner />
                    </View>

    )
}

const styles = StyleSheet.create({
    cardHeader: {
        backgroundColor: '#e0e0e0'
    },
    matchItem: {
        borderColor: '#dadada',
        borderBottomWidth: 1,
        //margin: 10,
    },
    itemRight: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'

    }
})

export default MatchesOverview