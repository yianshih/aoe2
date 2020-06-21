import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux';
//import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import {
    Container,
    Content,
    Text,
    Card,
    CardItem,
    Left,
    Right,
    Icon,
    Subtitle
} from 'native-base'
import Colors from '../constants/Colors'
//import PlayerMatchOverview from '../components/PlayerMatchOverview/PlayerMatchOverview'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
//import * as actions from '../store/actions/index'
import { updateFollowings } from '../services/firebase'
import PlayerCard from '../components/PlayerCard/PlayerCard';
//import Spinner from '../components/UI/Spinner/Spinner'
import MatchesOverview from '../components/MatchesOverview/MatchesOverview'
import * as Animatable from 'react-native-animatable'


const PlayerScreen = props => {

    //console.log("PlayerScreen props : ",props.route.params.playerSteamId)
    const playerSteamId = props.route.params.playerSteamId
    const playerName = props.route.params.playerName
    const [error, setError] = useState()
    //const [matchData, setMatchData] = useState(null)
    const [matchesDisplay, setMatchesDisplay] = useState(false)
    const animationRef = useRef(null)
    const followings = useSelector(state => state.profile.followings)
    const [isFollowed, setIsFollowed] = useState(followings.some(p => p.id === playerSteamId))



    useEffect(() => {
        //console.log('following changing')
        props.navigation.setOptions({
            title: playerName,
            headerRight: () => (
                <Ionicons
                    style={{ marginRight: 15 }}
                    name={isFollowed ? "heart" : "heart-outline"}
                    size={30}
                    color={Colors.danger}
                    onPress={() => followIconClicked()}
                />
            )
        })
    }, [followings, playerName])


    const followIconClicked = () => {

        //console.log('follow icon clicked')
        if (isFollowed) {
            setIsFollowed(false)
            const copyFollowings = [...followings]
            let index = -1
            for (let i = 0; i < copyFollowings.length; i++) {
                if (copyFollowings[i].id === playerSteamId) {
                    index = i
                }
            }
            if (index > -1) {
                copyFollowings.splice(index, 1)
            }
            updateFollowings(copyFollowings)
        }
        else {
            if (followings.length > 10) {
                return alert('Only 10 followings allowed')
            }
            setIsFollowed(true)
            updateFollowings([...followings, { id: playerSteamId, name: playerName }])
        }
    }

    // const fetchLastMatch = async () => {
    //     let didCancel = false
    //     try {
    //         //const responseUnranked = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=0&steam_id=${props.route.params.playerSteamId}&count=1`)
    //         const responseSingle = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=3&steam_id=${props.route.params.playerSteamId}&count=1`)
    //         const responseTeam = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=${props.route.params.playerSteamId}&count=1`)
    //         if (!responseSingle.ok || !responseTeam.ok) {
    //             //setError('Server No Response!')
    //             console.log('Server No Response!')
    //             throw new Error('Something went wrong!')
    //         }

    //         //let resDataUnranked = await responseUnranked.json()
    //         let resDataSingle = await responseSingle.json()
    //         let resDataTeam = await responseTeam.json()

    //         //if (resDataUnranked.length < 1) resDataUnranked

    //         setMatchData({
    //             gameData: {
    //                 single: resDataSingle.length > 0 ? resDataSingle[0] : 'unplayed',
    //                 team: resDataTeam.length > 0 ? resDataTeam[0] : 'unplayed',
    //                 //unranked: resDataUnranked.length > 0 ? resDataUnranked[0] : 'unplayed'
    //             }
    //         })

    //     } catch (error) {
    //         console.log('Fetch Match History failed : ', error)
    //         throw error
    //     }
    //     return () => { didCancel = true }
    // }

    // useEffect(() => {
    //     fetchLastMatch()
    // }, [])

    const clickedHandler = () => {
        setMatchesDisplay(!matchesDisplay)
        if (animationRef) {
            animationRef.current?.fadeIn();
        }
    }

    return (
        <Container>
            <Content>
                {props.route.params.playerSteamId
                    ? <Fragment>
                        <PlayerCard
                            steamId={props.route.params.playerSteamId}
                            gameType='3'
                            {...props}
                        />
                        <PlayerCard
                            steamId={props.route.params.playerSteamId}
                            gameType='4'
                            {...props}
                        />
                        <Card>
                            <TouchableWithoutFeedback onPress={() => clickedHandler()} >
                                <CardItem header>
                                    <Left>
                                        <Text style={{ color: '#00b0ff', fontWeight: '700' }}>Match History</Text>
                                    </Left>
                                    <Right>
                                        <Icon active name={matchesDisplay ? "ios-arrow-up" : "ios-arrow-down"} />
                                    </Right>
                                </CardItem>
                            </TouchableWithoutFeedback>
                            <Animatable.View ref={animationRef} animation="fadeIn" iterationCount={1} direction="alternate">
                                <CardItem style={{ display: matchesDisplay ? '' : 'none' }}>
                                    <View style={{
                                        flex: 1,
                                    }}>
                                        <MatchesOverview steamId={props.route.params.playerSteamId} {...props} />
                                    </View>
                                </CardItem>
                            </Animatable.View>
                        </Card>
                    </Fragment>
                    : <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Subtitle style={{ fontSize: 15 }}>Player Not Found</Subtitle>
                    </View>}

            </Content>
        </Container >
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
    },

})

export default PlayerScreen