import React from 'react'
import {
    Card,
    CardItem,
    Text,
    Body,
    Button,
    Toast,
    Right,
    Left
} from 'native-base'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import Circle from '../Circle/Circle'

{/* <Text>{`Highest : ${gameData.highestRate}`}</Text>
<Text>{`Wins : ${gameData.wins}`}</Text>
<Text>{`Losses : ${gameData.losses}`}</Text>
<Text>{`Rank : ${gameData.rank}`}</Text> */}

const MatchOverview = props => {

    const { gameData, title } = props
    const winRate = (gameData.wins / gameData.games * 100).toFixed(0)

    const refreshHandler = () => {
        props.refreshHandler()
        Toast.show({
            text: "Updated",
            style: {
                backgroundColor: Colors.danger
            },
        })
    }

    return (
        <View>
            <Card>
                <CardItem header>
                    <Left>
                        <View style={styles.rate}>
                            <Ionicons name="chess-queen" color='#FFBB00' size={30} />
                            <Text style={{ color: 'red', fontSize: 30 }}>{`${gameData.rate}`}</Text>
                        </View>
                    </Left>
                    <Body></Body>
                    <Right>
                        <View style={styles.refreshButton}>
                            <Button iconLeft transparent onPress={refreshHandler}>
                                <Ionicons name="refresh" size={30} color={Colors.primary} />
                                <View>
                                    <Text>Refresh</Text>
                                </View>
                            </Button>
                        </View>
                    </Right>
                </CardItem>
                <CardItem>
                    <Body>
                        <View style={styles.overview}>
                            <Circle percent={100} color="#ef6c00" text={gameData.games} label='Played' />
                            <Circle percent={winRate} color={Colors.success} text={`${winRate}%`} label='WinRate' />
                        </View>
                    </Body>
                </CardItem>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        borderWidth: 0,
    },
    refreshButton: {
        marginLeft: 0
    },
    rate: {
        margin: 'auto',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    overview: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
})

export default MatchOverview