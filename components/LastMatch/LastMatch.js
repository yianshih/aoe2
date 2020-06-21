import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Container,
    Content,
    Card,
    CardItem,
    Text,
    Body,
    Button,
    Toast,
    Right,
    Icon,
    Left,
    List,
    ListItem,
    Badge,
    Subtitle,
    Thumbnail
} from 'native-base'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet, RefreshControl } from 'react-native'
import Colors from '../../constants/Colors'
import { findCiv, findGameType, findMap, findColor, findMonth } from '../../constants/StringData'
//import BlinkView from 'react-native-blink-view'
import * as Animatable from 'react-native-animatable'
import Spinner from '../UI/Spinner/Spinner'
import { calculateTimeAgo } from '../../shared/utility'

const LastMatch = ({ navigation }) => {

    const [matchData, setMatchData] = useState()
    const steamId = useSelector(state => state.profile.steamId)
    const [isLive, setIsLive] = useState(false)
    const [error, setError] = useState()
    //const [unknownGame, setUnknownGame] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const fadeIn = {
        from: {
            opacity: 0.3,
        },
        to: {
            opacity: 1,
        },
    }

    const fetchMatch = async () => {

        try {
            const response = await fetch(`https://aoe2.net/api/player/matches?game=aoe2de&steam_id=${steamId}&count=1`)
            if (!response.ok) {
                setError('Server No Response!')
                //throw new Error('Something went wrong!')
            }

            const resData = await response.json()
            dataSetting(resData, true)

        } catch (error) {
            setError(error)
            console.log('Failed in Fetching Match History : ', error)
            //throw error
        }

    }

    const onRefresh = useCallback(async () => {

        setRefreshing(true)
        try {
            await fetchLastMatch()
            setRefreshing(false)
        } catch (error) {
            setError(error.message)
        }

    }, [refreshing])

    const dataSetting = (resData, finished) => {

        if (finished) {
            //const num_players = resData[0].num_players
            const players = resData[0].players
            const categorizedPlayers = players.reduce(
                (playersSoFar, player) => {
                    if (!playersSoFar[player.team]) playersSoFar[player.team] = []
                    playersSoFar[player.team].push(player)
                    return playersSoFar
                }, {})

            setMatchData({
                gameType: resData[0].leaderboard_id,
                mapType: resData[0].map_type,
                timeAgo: resData[0].finished ? calculateTimeAgo(resData[0].finished) : null,
                teamArray: categorizedPlayers
                //teamArray: teamArray

            })
        }
        else {
            const categorizedPlayers = resData.last_match.players.reduce(
                (playersSoFar, player) => {
                    if (!playersSoFar[player.team]) playersSoFar[player.team] = []
                    playersSoFar[player.team].push(player)
                    return playersSoFar
                }, {})

            setMatchData({
                gameType: resData.last_match.leaderboard_id,
                mapType: resData.last_match.map_type,
                timeAgo: resData.last_match.started ? calculateTimeAgo(resData.last_match.started) : null,
                teamArray: categorizedPlayers
                //teamArray: teamArray
            })
        }
    }

    const fetchLastMatch = async () => {

        //console.log('[ fetchLastMatch ] : ',steamId)
        try {
            const response = await fetch(`https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=${steamId}`)
            if (!response.ok) {
                setError('Match Not Found')
                //throw new Error('Something went wrong!')
            }
            const resData = await response.json()
            if (resData.last_match.finished === null) {
                setIsLive(true)
                dataSetting(resData, false)
            }
            else {
                setIsLive(false)
                fetchMatch()
            }

        } catch (error) {
            setError('Match Not Found')
            console.log('Failed in fetching Last Match : ', error)
            //throw error
        }

    }

    useEffect(() => {
        let didCancel = false
        fetchLastMatch()
        return () => { didCancel = true }
    }, [steamId])

    const TeamContent = props => {
        return props.team.map((p, index) => {
            const rateChange = p.rating_change ? `${p.rating_change > 0 ? ' ( +' + p.rating_change + ' )' : ' ( ' + p.rating_change + ' )'}` : ''
            const rate = p.rating ? p.rating + rateChange : ''
            return (
                (p.steam_id || p.name)
                    ? <ListItem key={index} onPress={() => navigation.navigate('PlayerScreen', {
                        playerSteamId: p.steam_id,
                        playerName: p.name
                    })}>
                        <Left>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', overflow: 'hidden' }}>
                                        {p.country ? <Thumbnail square style={{ marginRight: 10, width: 30, height: 30 }} source={{ uri: `https://www.countryflags.io/${p.country}/shiny/64.png` }} /> : null}
                                        <Text numberOfLines={1} style={{ color: findColor(p.color), fontWeight: '600' }}>{p.name ? p.name : 'Unknown'}</Text>
                                    </View>
                                    <View>
                                        <Subtitle style={{ fontSize: 15 }}>{`[ ${rate} ]`}</Subtitle>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ alignSelf: 'flex-end' }}>{findCiv(p.civ)}</Text>
                                </View>
                            </View>
                        </Left>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                    : <ListItem key={index}>
                        <Left>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <View>
                                    <Text numberOfLines={1} style={{ color: p.color ? findColor(p.color) : 'black', fontWeight: '600' }}>AI</Text>
                                </View>
                            </View>
                        </Left>
                        <Body>
                            <Text>{findCiv(p.civ)}</Text>
                        </Body>
                    </ListItem>
            )
        })
    }

    const MatchContent = () => (
        <List>
            {Object.keys(matchData.teamArray).map((teamNo, index) => {
                return (
                    <View key={teamNo + index}>
                        <ListItem itemDivider>
                            <View style={styles.team}>
                                {matchData.teamArray[teamNo][0].won
                                    ? <Ionicons name="crown" color="#FFBB00" size={30} />
                                    : null}
                                <Text>{`TEAM ${teamNo < 1 ? '?' : teamNo}`}</Text>
                            </View>

                        </ListItem>
                        <TeamContent team={matchData.teamArray[teamNo]} />
                    </View>)
            })}
        </List>)

    return (
        <Container>
            <Content>
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

                {error
                    ? <View style={styles.unknownGame}>
                        <Text style={{ fontSize: 20 }}>{error}</Text>
                    </View>
                    : matchData
                        ? <Card>
                            <CardItem header style={styles.lastMatchHeader}>
                                <Left>
                                    {isLive
                                        ? <View style={styles.live}>
                                            {/* <Text style={{ fontSize: 30 }}>Match</Text> */}
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ marginLeft: 10 }}>
                                                    <Animatable.Text animation={fadeIn} iterationCount="infinite" direction="alternate">
                                                        <Text style={{ color: 'red', fontWeight: '600', fontSize: 30 }}>Live</Text>
                                                    </Animatable.Text>
                                                </View>
                                            </View>
                                        </View>
                                        : <View>
                                            <Text style={{ fontSize: 25 }}>Last Match</Text>
                                        </View>}
                                </Left>
                                <Right>
                                    <Subtitle style={{ fontSize: 15 }}>{matchData.timeAgo}</Subtitle>
                                </Right>
                            </CardItem>
                            <View>
                                <CardItem>
                                    <Left>
                                        <Ionicons name="map-outline" size={30} color={Colors.primary}></Ionicons>
                                        <Text>{findMap(matchData.mapType)}</Text>
                                    </Left>
                                    <Right>
                                        <View style={styles.gameType}>
                                            {/* <Ionicons name="map" size={30} color={Colors.primary}></Ionicons> */}
                                            <Text>{findGameType(matchData.gameType)}</Text>
                                        </View>
                                    </Right>
                                </CardItem>
                                <List>
                                    <MatchContent />
                                </List>
                            </View>
                        </Card>
                        : <Spinner />}
            </Content>
        </Container >
    )
}


const styles = StyleSheet.create({
    title: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        borderWidth: 0,
    },
    unknownGame: {
        backgroundColor: '#EEFFBB',
        padding: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lastMatchHeader: {
        backgroundColor: 'white'
        //backgroundColor: '#EEFFBB'
    },
    gameInfo: {
        backgroundColor: 'red'
    },
    gameType: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    team: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    live: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveBadge: {
        borderRadius: 0,
    },
    refreshButton: {
        marginLeft: 0
    },
    rate: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overview: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
})

export default LastMatch