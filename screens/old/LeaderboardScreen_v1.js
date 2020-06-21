import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Label,
    Text,
    Input,
    Icon,
    List,
    ListItem,
    Left,
    Right,
    Body
} from 'native-base';
//import * as actions from '../store/actions/index'
//import { updateFollowings } from '../services/firebase'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const Leaderboard = props => {

    // require('react-dom');
    // window.React2 = require('react');
    // console.log(window.React1 === window.React2);

    const [inputName, setInputName] = useState('')
    const [playerList, setPlayerList] = useState('')
    const followings = useSelector(state => state.profile.followings)
    const dispatch = useDispatch()

    const fetchPlayers = async (input) => {

        try {
            const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=0&search=${input}`)
            if (!response.ok) {
                setError('Server No Response!')
                throw new Error('Something went wrong!')
            }
            const resData = await response.json()
            if (resData.leaderboard.length === 0) {
                return setPlayerList('Not Found')
            }

            setPlayerList(resData.leaderboard)

        } catch (error) {
            console.log('Failed in fetching Last Match : ', error)
            throw error
        }

    }

    const inputHandler = (input) => {

        setInputName(input)
        if (input === '') return setPlayerList('')
        fetchPlayers(input)

    }

    const playerClickHandler = (name, steamId) => {

        props.navigation.navigate('PlayerScreen', {
            playerSteamId: steamId,
            playerName: name
        })
        //console.log("data",p)
    }

    const players = (
        <List>{playerList
            ? playerList === 'Not Found'
                ? <ListItem>
                    <Text>
                        Not Found
                    </Text>
                </ListItem>
                : playerList.map(p => {
                    return (
                        <ListItem key={p.profile_id} onPress={() => playerClickHandler(p.name, p.steam_id)}>
                            <Left>
                                <Text>{p.name}</Text>
                            </Left>
                            <Body></Body>
                            <Right>
                                <Icon active name="ios-arrow-forward" />
                            </Right>
                        </ListItem>)
                })
            : null}
        </List>)

    return (
        <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.form}>
                        <Form>
                            <Item>
                                <Icon style={{ color: Colors.primary }} name='ios-search' />
                                <Input
                                    placeholder='Player Name'
                                    value={inputName}
                                    autoCapitalize='none'
                                    onChangeText={(inputValue) => inputHandler(inputValue)} />
                            </Item>
                        </Form>
                    </View>
                </View>
                <View>
                    {players}
                </View>
            </Content>
        </Container>
    )


}

const styles = StyleSheet.create({
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        justifyContent: 'center',
        width: '50%'
    },
})

export default Leaderboard