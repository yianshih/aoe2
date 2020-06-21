import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux';
//import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Content,
    Button,
    Text,
    Subtitle,
    List,
    ListItem,
    Left,
    Right,
    Body,
    Icon
} from 'native-base'
import Colors from '../constants/Colors'
import PlayerMatchOverview from '../components/PlayerMatchOverview/PlayerMatchOverview'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
//import * as actions from '../store/actions/index'
import { updateFollowings } from '../services/firebase'
import PlayerCard from '../components/PlayerCard/PlayerCard';
import Spinner from '../components/UI/Spinner/Spinner'
import Bar from '../components/UI/Bar/Bar'
import { findCiv, findMap, findGameType } from '../constants/StringData'

const PlayerDetailScreen = props => {

    //console.log("PlayerScreen props : ",props.route.params.playerSteamId)
    const playerSteamId = props.route.params.playerSteamId
    const playerName = props.route.params.playerName
    const gameType = props.route.params.gameType
    const [error, setError] = useState()
    //const [matchData, setMatchData] = useState(null)
    const [mapData, setMapData] = useState()
    const [civData, setCivData] = useState()
    const [gamePlayed, setGamePlayed] = useState()
    const followings = useSelector(state => state.profile.followings)

    //console.log("PlayerDetailScreen : props ",props)

    useEffect(() => {
        //console.log('following changing')
        props.navigation.setOptions({
            title: playerName,
        })
    }, [])

    const fetchLastMatch = async () => {

        try {
            const response = await fetch(`https://aoe2.net/api/player/matches?game=aoe2de&steam_id=${playerSteamId}&count=2000`)
            if (!response.ok) {
                setError('Server No Response')
                console.log('Server No Response!')
                throw new Error('Something went wrong!')
            }

            const resData = await response.json()
            //processData(resData)
            const gameArray = resData.filter(g => (+g.leaderboard_id === +gameType && g.players[0].won !== null))
            processData(gameArray)

        } catch (error) {
            console.log('Fetch Match History failed : ', error)
            throw error
        }
    }

    useEffect(() => {
        fetchLastMatch()
    }, [])

    const processData = (data) => {
        const mapArray = []
        const civArray = []
        let totalPlayed = 0
        for (let i = 0; i < data.length; i++) {
            //if (+data[i].leaderboard_id !== +gameType && data[i].players[0].won === null) return

            let playerIndex = null
            //if (data[i].players[0].won !== null) totalPlayed += 1
            totalPlayed += 1
            for (let j = 0; j < data[i].players.length; j++) { // find player index
                if (data[i].players[j].steam_id === playerSteamId) {
                    //isWin = data[i].players[j].won
                    playerIndex = j
                    break
                }
            }
            let mapIndex = -1
            let civIndex = -1
            let isMapExists = false
            let isCivExists = false

            for (let j = 0; j < civArray.length; j++) {
                if (civArray[j].name === findCiv(data[i].players[playerIndex].civ)) {
                    isCivExists = true
                    civIndex = j
                }
            }
            for (let j = 0; j < mapArray.length; j++) {
                if (mapArray[j].name === findMap(data[i].map_type)) {
                    isMapExists = true
                    mapIndex = j
                }
            }

            if (isCivExists) {
                civArray[civIndex].played = civArray[civIndex].played + 1
                if (data[i].players[playerIndex].won) {
                    civArray[civIndex].wins = civArray[civIndex].wins + 1
                }
                // if (data[i].players[playerIndex].won !== null) {
                //     civArray[civIndex].played = civArray[civIndex].played + 1
                //     if (data[i].players[playerIndex].won) {
                //         civArray[civIndex].wins = civArray[civIndex].wins + 1
                //     }
                // }

            }
            else {
                civArray.push({
                    name: findCiv(data[i].players[playerIndex].civ),
                    played: 1,
                    wins: data[i].players[playerIndex].won ? 1 : 0
                })
                // if (data[i].players[playerIndex].won !== null) {
                //     civArray.push({
                //         name: findCiv(data[i].players[playerIndex].civ),
                //         played: 1,
                //         wins: data[i].players[playerIndex].won ? 1 : 0
                //     })
                // }

            }

            if (isMapExists) {  // map exists

                mapArray[mapIndex].played = mapArray[mapIndex].played + 1
                if (data[i].players[playerIndex].won) {
                    mapArray[mapIndex].wins = mapArray[mapIndex].wins + 1
                }
                // if (data[i].players[playerIndex].won !== null) {
                //     mapArray[mapIndex].played = mapArray[mapIndex].played + 1
                //     if (data[i].players[playerIndex].won) {
                //         mapArray[mapIndex].wins = mapArray[mapIndex].wins + 1
                //     }
                // }
            }
            else {
                mapArray.push({
                    name: findMap(data[i].map_type),
                    played: 1,
                    wins: data[i].players[playerIndex].won ? 1 : 0
                })
                // if (data[i].players[playerIndex].won !== null) {
                //     mapArray.push({
                //         name: findMap(data[i].map_type),
                //         played: 1,
                //         wins: data[i].players[playerIndex].won ? 1 : 0
                //     })
                // }
            }

        }
        setGamePlayed(totalPlayed)
        setMapData(mapArray.sort(compare))
        setCivData(civArray.sort(compare))

    } // end of process

    const compare = (a, b) => {
        if (+(a.wins / a.played) < +(b.wins / b.played)) {
            return 1
        }
        if (+(a.wins / a.played) > +(b.wins / b.played)) {
            return -1
        }
        return 0
    }

    const RenderMapData = () => {

        return mapData.map(m => {
            const winRate = ((m.wins / m.played) * 100).toFixed(0)
            //m.played > 10 && winRate > 10
            if (true) return (
                <ListItem key={m.name} style={{ paddingRight: 20 }}>
                    <View style={{ width: '40%' }}>
                        <Text numberOfLines={1}>{`${m.name} ( ${m.played} )`}</Text>
                        {/* <Text>{`( ${m.played} )`}</Text> */}
                    </View>
                    <Body>
                        <View>
                            <Bar value={winRate} />
                        </View>
                    </Body>
                </ListItem>)
            else return
        })
    }

    const RenderCivData = () => {

        return civData.map(m => {
            const winRate = ((m.wins / m.played) * 100).toFixed(0)
            //m.played > 10 && winRate > 10
            if (true) return (
                <ListItem key={m.name} style={{ paddingRight: 20 }}>
                    <View style={{ width: '40%' }}>
                        <Text numberOfLines={1}>{`${m.name} ( ${m.played} ) `}</Text>
                    </View>
                    <Body>
                        <View>
                            <Bar value={winRate} />
                        </View>
                    </Body>
                </ListItem>)
            else return
        })
    }

    return (
        <Container>
            <Content>

                {mapData && civData
                    ? <Fragment>
                        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                            <Text style={{ fontSize: 20 }}>{findGameType(gameType)}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Subtitle style={{ fontSize: 15 }}>{`by last ${gamePlayed} valid games`}</Subtitle>
                        </View>
                        <List>
                            <ListItem itemHeader first>
                                <Text style={{ color: '#8bc34a', fontSize: 25 }}>Win Rate By Map</Text>
                            </ListItem>
                            <RenderMapData />
                        </List>
                        <List>
                            <ListItem itemHeader first>
                                <Text style={{ color: '#8bc34a', fontSize: 25 }}>Win Rate By Civilization</Text>
                            </ListItem>
                            <RenderCivData />
                        </List>
                    </Fragment>
                    : <View style={{ margin: 10 }}>
                        <Spinner />
                        <Subtitle style={{ fontSize: 15 }}>This may take longer to process</Subtitle>
                    </View>}
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

export default PlayerDetailScreen