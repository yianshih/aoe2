import React from 'react'
import {
    Card,
    CardItem,
    Text,
    Body,
    Button,
    Subtitle
} from 'native-base'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import Circle from '../Circle/Circle'

{/* <Text>{`Highest : ${gameData.highestRate}`}</Text>
<Text>{`Wins : ${gameData.wins}`}</Text>
<Text>{`Losses : ${gameData.losses}`}</Text>
<Text>{`Rank : ${gameData.rank}`}</Text> */}

const PlayerMatchOverview = props => {
    //console.log("[ PlayerMatchOverview ] props : ", props)

    const { gameData, title } = props
    const games = gameData.num_wins + gameData.num_losses
    const winRate = (gameData.num_wins / games * 100).toFixed(0)

    const content = (
        gameData === 'unplayed'
            ? <Card>
                <CardItem header>
                    <View style={styles.title}>
                        <Text>{title}</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <View style={styles.unplay}>
                        <Subtitle style={{ fontSize: 15 }}>At lease 10 games played to view</Subtitle>
                    </View>
                </CardItem>
            </Card>
            : <Card>
                <CardItem header>
                    <View style={styles.title}>
                        <Text>{title}</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <View style={styles.rate}>
                        <Ionicons name="chess-queen" color='#FFBB00' size={30} />
                        <Text style={{ color: 'red', fontSize: 30 }}>{`${gameData.rating}`}</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <Body>
                        <View style={styles.overview}>
                            <Circle percent={100} color="#ef6c00" text={games} label='Played' />
                            <Circle percent={winRate} color={Colors.success} text={`${winRate}%`} label='WinRate' />
                        </View>
                    </Body>
                </CardItem>
            </Card>
    )

    return (
        <View>
            {content}
        </View>
    )
}

const styles = StyleSheet.create({
    unplay: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        width: '100%',
        padding: 10,
        backgroundColor: "#DDDDDD",
        justifyContent: 'center',
        alignItems: 'center'
    },
    rate: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overview: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
})

export default PlayerMatchOverview