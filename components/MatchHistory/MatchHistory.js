import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react'
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
    Icon,
    Segment
} from 'native-base'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Colors from '../../constants/Colors'
import {
    LineChart
} from "react-native-chart-kit"
import { Dimensions } from "react-native"
import Spinner from '../UI/Spinner/Spinner'
import * as Animatable from 'react-native-animatable'


const MatchHistory = props => {

    const [error, setError] = useState('')
    const steamId = useSelector(state => state.profile.steamId)
    const screenWidth = Dimensions.get("window").width
    const playerSteamId = props.steamId
    const [lineChartDisplay, setLineChartDisplay] = useState(false)
    const [matchData, setMatchData] = useState()
    const [dataCount, setDataCount] = useState(10)
    const animationRef = useRef(null)

    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "white",
        backgroundGradientToOpacity: 1,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(63, 81, 101, ${opacity})`,
        propsForBackgroundLines: {
            strokeWidth: 0
        },
        useShadowColorFromDataset: false,
        propsForDots: {
            r: "4",
            strokeWidth: "1",
            stroke: "#ffa726"
        },
    }
    //console.log(screenWidth)

    useEffect(() => {
        if (steamId) fetchHistory()
    }, [steamId, dataCount])

    const clickedHandler = () => {
        setLineChartDisplay(!lineChartDisplay)
        if (animationRef) {
            animationRef.current?.fadeIn();
        }
    }


    const fetchHistory = async () => {
        try {
            const response = await fetch(`https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=${props.gameType}&steam_id=${playerSteamId ? playerSteamId : steamId}&count=${dataCount}`)
            if (!response.ok) {
                setError('Server No Response!')
                throw new Error('Something went wrong!')
            }
            const resData = await response.json()
            let tempRate = []
            let tempDate = []
            for (let i = 0; i < resData.length; i++) {
                const date = new Date(resData[i].timestamp * 1000);
                const convertedDate = `${date.getDate()}/${date.getMonth() + 1}`
                tempRate.push(resData[i].rating)
                tempDate.push(convertedDate)
            }
            setMatchData({
                rate: tempRate.reverse(),
                date: tempDate.reverse()
            })

        } catch (error) {
            console.log('Fetch Match History failed : ', error)
            throw error
        }
    }

    return (
        <View style={styles.card}>
            <Card>
                <TouchableWithoutFeedback onPress={() => clickedHandler()} >
                    <CardItem header>
                        <Left>
                            <Text>Match Overview</Text>
                        </Left>
                        <Right>
                            <Icon active name={lineChartDisplay ? "ios-arrow-up" : "ios-arrow-down"} />
                        </Right>
                    </CardItem>
                </TouchableWithoutFeedback>
                <Animatable.View ref={animationRef} animation="fadeIn" iterationCount={1} direction="alternate">
                    <View style={{ display: lineChartDisplay ? '' : 'none' }}>
                        <CardItem>
                            <Body>
                                <Segment style={{ backgroundColor: 'white', width: '100%' }}>
                                    <Button first active={dataCount === 10} onPress={() => {
                                        setDataCount(10)
                                    }}>
                                        <Text> Last 10 </Text>
                                    </Button>
                                    <Button active={dataCount === 20} style={styles.segmentButton} onPress={() => {
                                        setDataCount(20)
                                    }}>
                                        <Text> Last 20 </Text>
                                    </Button>
                                    <Button last active={dataCount === 30} style={styles.segmentButton} onPress={() => {
                                        setDataCount(30)
                                    }}>
                                        <Text> Last 30 </Text>
                                    </Button>
                                </Segment>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                {error ? <Text>Server No Response!</Text> :
                                    matchData
                                        ? <LineChart
                                            data={{
                                                labels: matchData.date.length > 10
                                                    ? matchData.date.length === 20
                                                        ? matchData.date.filter((item, index) => {
                                                            return index % 4 === 0
                                                        })
                                                        : matchData.date.filter((item, index) => {
                                                            return index % 6 === 0
                                                        })
                                                    : matchData.date.filter((item, index) => {
                                                        return index % 2 === 0
                                                    }),
                                                datasets: [
                                                    {
                                                        data: matchData.rate
                                                    }
                                                ]
                                            }}
                                            width={screenWidth * 0.8}
                                            height={220}
                                            chartConfig={chartConfig}
                                        />
                                        : <Spinner />}

                            </Body>
                        </CardItem>
                    </View>
                </Animatable.View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden'
    },
})

export default MatchHistory