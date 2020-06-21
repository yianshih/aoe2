import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
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
    Container,
    Content,
    Thumbnail
} from 'native-base'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import { findCiv, findColor } from '../constants/StringData'
import BlinkView from 'react-native-blink-view'
import { calculateTimeDiff } from '../shared/utility'

const MatchDetail = props => {

    //const startTime = new Date(props.route.params.started * 1000)
    //const finishedTime = new Date(props.route.params.finished * 1000)
    const duration = calculateTimeDiff(props.route.params.started, props.route.params.finished)
    //console.log("MatchDetail props : ", props)
    const [error, setError] = useState()

    const TeamContent = props => {
        return props.team.map((p, index) => {
            const rateChange = p.rating_change ? `${p.rating_change > 0 ? ' ( +' + p.rating_change + ' )' : ' ( ' + p.rating_change + ' )'}` : ''
            const rate = p.rating ? p.rating + rateChange : ''
            return (
                (p.steam_id || p.name)
                    ? <ListItem
                        key={index}
                        onPress={() => props.nav.replace('PlayerScreen', {
                            playerSteamId: p.steam_id,
                            playerName: p.name
                        })}>
                        {/* <Left>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <View style={{ flexDirection: 'row' }}>
                                <Thumbnail square style={{ marginRight: 10, width: 30, height: 30 }} source={{ uri: `https://www.countryflags.io/${p.country}/shiny/32.png` }} />
                                    <Text numberOfLines={1} style={{ color: p.color ? findColor(p.color) : 'black', fontWeight: '600' }}>{p.name ? p.name : 'Unknown Name'}</Text>
                                </View>
                                <View style={styles.rate}>
                                    <Subtitle style={{ fontSize: 15 }}>{`[ ${rate} ]`}</Subtitle>
                                </View>
                            </View>
                        </Left> */}
                        <Left>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', overflow: 'hidden' }}>
                                        {p.country ? <Thumbnail square style={{ marginRight: 10, width: 30, height: 30 }} source={{ uri: `https://www.countryflags.io/${p.country}/shiny/64.png` }} /> : null}
                                        {p.name ? <Text numberOfLines={1} style={{ color: findColor(p.color), fontWeight: '600' }}>{p.name}</Text> : 'Unknown Name'}
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
                        {/* <Body>
                            <Text>{findCiv(p.civ)}</Text>
                        </Body> */}
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

    const MatchContent = () => {

        const players = props.route.params.players
        //const num_players = players.length

        const categorizedPlayers = players.reduce(
            (playersSoFar, player) => {
                if (!playersSoFar[player.team]) playersSoFar[player.team] = []
                playersSoFar[player.team].push(player)
                return playersSoFar
            }, {})

        return (
            <List>
                {Object.keys(categorizedPlayers).map((teamNo, index) => {
                    return (
                        <View key={teamNo + index}>
                            <ListItem itemDivider>
                                <View style={styles.team}>
                                    {
                                        categorizedPlayers[teamNo][0].won
                                            ? <Ionicons name="crown" color="#FFBB00" size={30} />
                                            : null}
                                    <Text>{`TEAM ${teamNo}`}</Text>
                                </View>

                            </ListItem>
                            <TeamContent nav={props.navigation} team={categorizedPlayers[teamNo]} />
                        </View>)
                })}
            </List>)
        // <List>
        //     {teamArray.map((team, index) => {
        //         return (
        //             <View key={index}>
        //                 <ListItem itemDivider>
        //                     <View style={styles.team}>
        //                         {
        //                             team[0].won
        //                                 ? <Ionicons name="crown" color="#FFBB00" size={30} />
        //                                 : null}
        //                         <Text>TEAM {index + 1}</Text>
        //                     </View>

        //                 </ListItem>
        //                 <TeamContent nav={props.navigation} team={team} />
        //             </View>)
        //     })}
        // </List>)
    }


    return (
        <Container>
            <Content>
                {error
                    ? <View style={styles.unknownGame}>
                        <Text style={{ fontSize: 20 }}>Unknown Error</Text>
                    </View>
                    : <View>
                        <Card>
                            <CardItem header style={styles.lastMatchHeader}>
                                <Left>
                                    <View style={styles.live}>
                                        <View>
                                            <Text style={{ fontSize: 25 }}>{props.route.params.gameType}</Text>
                                        </View>
                                        <View>
                                            <Text note>{props.route.params.matchDate}</Text>
                                        </View>
                                    </View>
                                </Left>
                                <Right>
                                    <Subtitle style={{ fontSize: 20 }}>{`${duration}`}</Subtitle>
                                </Right>
                            </CardItem>
                            <View>
                                <CardItem>
                                    <Left>
                                        <Ionicons name="map-outline" size={30} color="#4caf50"></Ionicons>
                                        <Text>{props.route.params.mapType}</Text>
                                    </Left>
                                    <Right>
                                    </Right>
                                </CardItem>
                                <List>
                                    <MatchContent />
                                </List>
                            </View>
                        </Card>
                    </View>}
            </Content>
        </Container>
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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

export default MatchDetail