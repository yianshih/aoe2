import React, { useState, useEffect, Fragment } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Subtitle } from 'native-base';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../constants/Colors'
import Circle from '../Circle/Circle'
import Spinner from '../UI/Spinner/Spinner'
import MatchHistory from '../MatchHistory/MatchHistory'

const PlayerCard = props => {

    //console.log("PlayerCard : ",props)
    const playerSteamId = props.steamId
    const [matchData, setMatchData] = useState()
    const [error, setError] = useState()

    const fetchLastMatch = async () => {
        if (!playerSteamId) return
        try {
            //const response = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${props.gameType}&steam_id=${props.steamId}&count=1`)
            const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${props.gameType}&steam_id=${playerSteamId}`)
            if (!response.ok) {
                setError('Player Not Found!')
                //console.log('Server No Response!')
                //throw new Error('Something went wrong!')
            }

            let resData = await response.json()

            let convertedStarted = 'Unknown'
            if (resData.leaderboard.length > 0) {
                const startDate = new Date(resData.leaderboard[0].last_match_time * 1000)
                convertedStarted = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
            }

            //const games = resData.leaderboard.length > 0 ? resData.leaderboard[0].games : 'Unknown'
            const winRate = resData.leaderboard.length > 0 ? ((resData.leaderboard[0].wins / resData.leaderboard[0].games) * 100).toFixed(0) : 'Unknown'
            setMatchData({
                games: resData.leaderboard.length > 0 ? resData.leaderboard[0].games : 'unplayed',
                winRate: winRate,
                gameData: resData.leaderboard.length > 0 ? resData.leaderboard[0] : 'unplayed',
                date: convertedStarted
            })

        } catch (error) {
            console.log('Fetch Match History failed : ', error)
            //throw error
        }
    }

    useEffect(() => {
        fetchLastMatch()
    }, [playerSteamId])

    //console.log("matchData : ", matchData)
    const content = matchData
        ? matchData.gameData !== 'unplayed'
            ? <Fragment>
                <CardItem>
                    <Left>
                        <View style={{ alignItems: 'flex-start' }}>
                            {/* <Thumbnail source={{ uri: 'Image URL' }} /> */}
                            {/* <Ionicons name="heart" size={30} color={Colors.danger} /> */}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                {+props.gameType === 3
                                    ? <Ionicons name="account" size={30} color='#7c4dff' />
                                    : <Ionicons name="account-group" size={30} color='#cddc39' />}
                                <Text style={{ fontSize: 20 }}>{+props.gameType === 3 ? '1v1 Random Map' : 'Team Random Map'}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text note>{`Last Match ${matchData.date}`}</Text>
                            </View>
                        </View>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <View style={styles.overview}>
                            <Circle percent={100} color="#ef6c00" text={matchData.games} label='Played' />
                            <Circle percent={100} color={Colors.chessQueen} text={matchData.gameData.highest_rating} label='Highest Rate' />
                            <Circle percent={matchData.winRate} color={Colors.success} text={`${matchData.winRate}%`} label='WinRate' />
                            
                        </View>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <View style={{ flexDirection: 'row', marginHorizontal: 0 }}>
                            <View style={{ flexDirection: 'row', marginHorizontal: 0 }}>
                                <Ionicons name="chess-queen" size={30} color={Colors.chessQueen} />
                                <Text style={{ color: 'grey', fontSize: 20 }}>{matchData.gameData.rating}</Text>
                                {/* <Text note>{`(${matchData.gameData.highest_rating})`}</Text> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                <Ionicons name="podium" size={30} color='red' />
                                <Text style={{ color: 'grey', fontSize: 20 }}>{matchData.gameData.rank}
                                    <Subtitle style={{ fontSize: 15 }}>th</Subtitle>
                                </Text>
                            </View>
                        </View>
                    </Left>
                    <Right>
                        <Button
                            iconLeft
                            transparent
                            onPress={() => props.navigation.navigate('PlayerDetailScreen', {
                                gameType: props.gameType,
                                playerSteamId: props.steamId,
                                playerName: props.playerName ? props.playerName : props.route.params.playerName
                            })} >
                            <Text>View Details</Text>
                            <Icon name="ios-arrow-forward" />
                        </Button>
                    </Right>
                </CardItem>
                <CardItem>
                    <View style={{ flex: 1 }}>
                        <MatchHistory
                            gameType={props.gameType}
                            steamId={playerSteamId}
                        />
                    </View>
                </CardItem>
            </Fragment >
            : <Fragment>
                <CardItem>
                    <Left>
                        <View style={{ alignItems: 'flex-start' }}>
                            {/* <Thumbnail source={{ uri: 'Image URL' }} /> */}
                            {/* <Ionicons name="heart" size={30} color={Colors.danger} /> */}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                {+props.gameType === 3
                                    ? <Ionicons name="account" size={30} color='#7c4dff' />
                                    : <Ionicons name="account-group" size={30} color='#cddc39' />}
                                <Text style={{ fontSize: 20 }}>{+props.gameType === 3 ? '1v1 Random Map' : 'Team Random Map'}</Text>
                            </View>
                        </View>
                    </Left>
                </CardItem>
                <CardItem>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Subtitle style={{ fontSize: 13 }}>At lease 10 games played to view</Subtitle>
                    </View>
                </CardItem>
            </Fragment>
        : <CardItem>
            <Spinner />
        </CardItem>

    return (
        <Card style={{ flex: 0 }}>
            {error
                ? <Text>{error}</Text>
                : playerSteamId
                    ? content
                    : <Text>Player Not Found</Text>}
        </Card >
    )
}

const styles = StyleSheet.create({
    overview: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
})

export default PlayerCard
