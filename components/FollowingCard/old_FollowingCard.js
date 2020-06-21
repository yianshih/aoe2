import React, { Component, useState, useEffect, Fragment } from 'react';
import { Image, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../constants/Colors'
import Spinner from '../UI/Spinner/Spinner'

const FollowingCard = props => {

    //console.log("FollowingCard : ",props)

    const [matchData, setMatchData] = useState()

    const fetchLastMatch = async () => {

        try {
            const responseSingle = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=3&steam_id=${props.steamId}&count=1`)
            const responseTeam = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=${props.steamId}&count=1`)
            const matchHistory = await fetch(`https://aoe2.net/api/player/matches?game=aoe2de&steam_id=${props.steamId}&count=1`)
            if (!responseSingle.ok || !responseTeam.ok) {
                setError('Server No Response!')
                console.log('Server No Response!')
                throw new Error('Something went wrong!')
            }

            let resDataSingle = await responseSingle.json()
            let resDataTeam = await responseTeam.json()
            let resDataMatchHistory = await matchHistory.json()

            //if (resDataUnranked.length < 1) resDataUnranked
            const startDate = new Date(resDataMatchHistory[0].started * 1000)

            const convertedStarted = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`

            setMatchData({
                single: resDataSingle.length > 0 ? resDataSingle[0] : 'unplayed',
                team: resDataTeam.length > 0 ? resDataTeam[0] : 'unplayed',
                date: convertedStarted
            })

        } catch (error) {
            console.log('Fetch Match History failed : ', error)
            throw error
        }
    }

    useEffect(() => {
        fetchLastMatch()
    }, [])

    //console.log("matchData : ", matchData)
    const content = matchData
        ? <Fragment>
            <CardItem>
                <Left>
                    {/* <Thumbnail source={{ uri: 'Image URL' }} /> */}
                    <Ionicons name="heart" size={30} color={Colors.danger} />
                    <TouchableWithoutFeedback onPress={() => props.navigation.navigate('PlayerScreen', {
                        playerSteamId: props.steamId,
                        playerName: props.name
                    })} >
                        <Body>
                            <Text>{props.name}</Text>
                            <Text note>{`Last Match ${matchData.date}`}</Text>
                        </Body>
                    </TouchableWithoutFeedback>
                </Left>

            </CardItem>

            <CardItem>
                <Body>
                    {/* <Image source={{ uri: 'Image URL' }} style={{ height: 200, width: 200, flex: 1 }} /> */}
                    <Text>
                    </Text>
                </Body>
            </CardItem>
            <CardItem>
                <Left>
                    {matchData.single === 'unplayed'
                        ? null
                        : <View style={{ flexDirection: 'row', marginHorizontal: 0 }}>
                            <Ionicons name="account" size={30} color={Colors.primary} />
                            <Text style={{ color: 'grey', fontSize: 20 }}>{matchData.single.rating}</Text>
                        </View>}

                    {matchData.team === 'unplayed'
                        ? null
                        : <View style={{ flexDirection: 'row', marginHorizontal: matchData.single === 'unplayed' ? 0 : 20 }}>
                            <Ionicons name="account-group" size={30} color='orange' />
                            <Text style={{ color: 'grey', fontSize: 20 }}>{matchData.team.rating}</Text>
                        </View>}

                </Left>

            </CardItem>
        </Fragment >
        : <CardItem>
            <Spinner />
        </CardItem>

    return (
        <Card style={{ flex: 0 }}>
            {content}
        </Card>
    )
}

export default FollowingCard
