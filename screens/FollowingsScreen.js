import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, TouchableWithoutFeedback, RefreshControl, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Body,
    Content,
    Left,
    Right,
    Title,
    Icon,
    Button,
    List,
    ListItem,
    Text,
    Subtitle,
    Thumbnail
} from 'native-base';
import Spinner from '../components/UI/Spinner/Spinner'
import Colors from '../constants/Colors'
import FollowingCard from '../components/FollowingCard/FollowingCard'
import axios from 'axios'
import { set } from 'react-native-reanimated'
import { calculateTimeAgo } from '../shared/utility'

const FollowingsScreen = props => {

    const followings = useSelector(state => state.profile.followings)
    const [refreshing, setRefreshing] = useState(false)
    const [playerData, setPlayerData] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const dispatch = useDispatch()

    const onRefresh = useCallback(async (currentfollowings) => {

        setRefreshing(true)
        try {
            fetchData(currentfollowings)
            setRefreshing(false)
        } catch (error) {
            setError(error.message)
        }

    }, [refreshing])

    const fetchData = (currentFollowings) => {
        let didCancel = false
        setLoading(true)
        const requests = []
        // axios.get(`https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=${followings[1].id}`).then(res =>{
        //     console.log("res : ",res)
        // })
        for (let i = 1; i < currentFollowings.length; i++) {
            const request = axios.get(`https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=${currentFollowings[i].id}`)
            requests.push(request)
        }
        const results = []
        axios.all(requests).then(axios.spread((...responses) => {
            for (let i = 0; i < responses.length; i++) {
                //console.log("responses[i] : ",responses[i].data.last_match.finished)
                results.push({
                    id: responses[i].data.steam_id,
                    name: responses[i].data.name,
                    country: responses[i].data.country,
                    finished: responses[i].data.last_match.finished ? calculateTimeAgo(responses[i].data.last_match.finished) : 'Playing'
                })
            }
            setLoading(false)
            setPlayerData(results)
        })).catch(error => {
            console.log(error)
        })

        return () => { didCancel = true }

    }

    useEffect(() => {
        if (followings.length > 1) fetchData(followings)
    }, [followings])

    // let content = playerData
    //     ? <List>
    //         {playerData.map(f => (
    //             <TouchableWithoutFeedback
    //                 key={f.id}
    //                 onPress={() => navigation.navigate('PlayerScreen', {
    //                     playerSteamId: f.id,
    //                     playerName: f.name
    //                 })}
    //             >
    //                 <ListItem>
    //                     <Left>
    //                         <Thumbnail square style={{ marginRight: 10 }} small source={{ uri: `https://www.countryflags.io/${f.country}/shiny/64.png` }} />
    //                         <Text>{f.name}</Text>
    //                     </Left>
    //                     <Body>
    //                         <Subtitle style={{ fontSize: 15 }}>{f.finished}</Subtitle>
    //                     </Body>
    //                     <Right>
    //                         <Icon name="ios-arrow-forward" />
    //                     </Right>
    //                 </ListItem>
    //             </TouchableWithoutFeedback>)
    //         )}
    //     </List>
    //     : null


    //console.log("playerData : ",playerData)
    //console.log("followings : ", followings)

    return (
        <Container>
            <Content>
                <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(followings)} />
                {loading
                    ? <View style={{ marginTop: 20 }}>
                        <Spinner />
                    </View>
                    : playerData
                        ? <List>
                            {playerData.map(f => (
                                <TouchableWithoutFeedback
                                    key={f.id}
                                    onPress={() => props.navigation.navigate('PlayerScreen', {
                                        playerSteamId: f.id,
                                        playerName: f.name
                                    })}
                                >
                                    <ListItem>
                                        <Left>
                                            <Thumbnail square style={{ marginRight: 10 }} small source={{ uri: `https://www.countryflags.io/${f.country}/shiny/64.png` }} />
                                            <Text>{f.name}</Text>
                                        </Left>
                                        <Body>
                                            <Subtitle style={{ fontSize: 15 }}>{f.finished}</Subtitle>
                                        </Body>
                                        <Right>
                                            <Icon name="ios-arrow-forward" />
                                        </Right>
                                    </ListItem>
                                </TouchableWithoutFeedback>)
                            )}
                        </List>
                        : <View>
                            <Subtitle>You don't have any followings yet</Subtitle>
                        </View>}
            </Content>
        </Container >
    )


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    }
})

export default FollowingsScreen