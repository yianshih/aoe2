import React, { Component, useState, useEffect, Fragment } from 'react';
import { Image, View, TouchableWithoutFeedback } from 'react-native';
import {
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Thumbnail,
    Text,
    Button,
    Icon,
    Left,
    Body,
    Right,
    ListItem,
    Subtitle,
    List,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../constants/Colors'
import { calculateTimeAgo } from '../../shared/utility'
import Spinner from '../UI/Spinner/Spinner'

const FollowingCard = ({ name, steamId, navigation }) => {

    //console.log("FollowingCard : ",

    const [matchData, setMatchData] = useState()
    const [error, setError] = useState()

    useEffect(() => {

        const fetchLastMatch = async () => {

            try {
                //const matchHistory = await 
                const matchHistory = await fetch(`https://aoe2.net/api/player/matches?game=aoe2de&steam_id=${steamId}&count=1`)

                if (!matchHistory.ok) {
                    setError('Server No Response!')
                    console.log('Server No Response!')
                    throw new Error('Something went wrong!')
                }
                let resDataMatchHistory = await matchHistory.json()
                const currentPlayer = resDataMatchHistory[0].players.filter(p => p.steam_id === steamId)[0]

                setMatchData({
                    lastDate: resDataMatchHistory[0].finished ? calculateTimeAgo(resDataMatchHistory[0].finished) : 'Playing',
                    player: currentPlayer,
                })

            } catch (error) {
                console.log('Fetch Match History failed : ', error)
                throw error
            }
        }
        fetchLastMatch()
    }, [steamId])

    //console.log("matchData : ", matchData)
    const content = matchData
        ? <TouchableWithoutFeedback
            onPress={() => navigation.navigate('PlayerScreen', {
                playerSteamId: steamId,
                playerName: name
            })}
        >
            <ListItem>
                <Left>
                    <Thumbnail square style={{ marginRight: 10 }} small source={{ uri: `https://www.countryflags.io/${matchData.player.country}/shiny/64.png` }} />
                    <Text>{name}</Text>
                </Left>
                <Body>
                    <Subtitle style={{ fontSize: 15 }}>{matchData.lastDate}</Subtitle>
                </Body>
                <Right>
                    <Icon name="ios-arrow-forward" />
                </Right>
            </ListItem>
        </TouchableWithoutFeedback>
        : <TouchableWithoutFeedback
            onPress={() => navigation.navigate('PlayerScreen', {
                playerSteamId: steamId,
                playerName: name
            })}
        >
            <ListItem>
                <Left>
                    <Spinner />
                    <View style={{ marginLeft: 10 }}>
                        <Text>{name}</Text>
                    </View>
                </Left>
                <Body>
                    <Spinner />
                </Body>
                <Right>
                    <Icon name="ios-arrow-forward" />
                </Right>
            </ListItem>
        </TouchableWithoutFeedback>
    // : <CardItem>
    //     <Spinner />
    // </CardItem>

    return (content

    )
}

export default FollowingCard
