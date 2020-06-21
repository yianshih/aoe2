import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Text,
    Icon,
    List,
    ListItem,
    Left,
    Right,
    Body,
    Thumbnail,
    Subtitle
} from 'native-base';
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Spinner from '../components/UI/Spinner/Spinner'

const Leaderboard = React.memo(props => {

    const [inputName, setInputName] = useState(null)
    const [playerList, setPlayerList] = useState(null)
    const [initPlayerList, setInitPlayerList] = useState(null)
    let myInput = null
    //const followings = useSelector(state => state.profile.followings)
    const inputRef = useRef();
    //const dispatch = useDispatch()



    useEffect(() => {
        props.navigation.setOptions({
            headerShown: false
        })
    }, [])

    useEffect(() => {

        const initFetch = async () => {
            try {
                const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&start=1&count=20`)
                if (!response.ok) {
                    setError('Server No Response!')
                    throw new Error('Something went wrong!')
                }
                const resData = await response.json()
                setInitPlayerList(resData.leaderboard)
            } catch (error) {
                console.log('init array fetch failed')
            }
        }
        initFetch()

    }, [])


    useEffect(() => {
        const timer = setTimeout(async () => {
            
            if (!inputName) {
                setPlayerList(null)
                return
            }
            if (inputName === myInput._getText()) {
                //console.log('ready to search')
                try {
                    const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=0&count=100&search=${inputName}`)
                    if (!response.ok) {
                        setError('Server No Response!')
                        throw new Error('Something went wrong!')
                    }
                    const resData = await response.json()
                    if (resData.leaderboard.length === 0) {
                        setPlayerList('Not Found')
                    }
                    else {
                        setPlayerList(resData.leaderboard)
                    }
                } catch (error) {
                    console.log('Search Error : ', error)
                }
            }
        }, 500)

        return () => {
            clearTimeout(timer);
        };
    }, [inputName, myInput])

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
                ? <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                    <Subtitle style={{ fontSize: 15 }}>Not Found</Subtitle>
                </View>
                : playerList.map(p => {
                    return (
                        <ListItem key={p.profile_id} onPress={() => playerClickHandler(p.name, p.steam_id)}>
                            <Left>
                                <Thumbnail square style={{ marginRight: 10 }} small source={{ uri: `https://www.countryflags.io/${p.country}/shiny/64.png` }} />
                                <Text>{p.name}</Text>
                            </Left>
                            <Body></Body>
                            <Right>
                                <Icon active name="ios-arrow-forward" />
                            </Right>
                        </ListItem>)
                })
            : initPlayerList
                ? initPlayerList.map(p => {
                    return (
                        <ListItem key={p.profile_id} onPress={() => playerClickHandler(p.name, p.steam_id)}>
                            <Left>
                                <Thumbnail square style={{ marginRight: 10 }} small source={{ uri: `https://www.countryflags.io/${p.country}/shiny/64.png` }} />
                                <Text>{p.name}</Text>
                            </Left>
                            <Body></Body>
                            <Right>
                                <Icon active name="ios-arrow-forward" />
                            </Right>
                        </ListItem>)
                })
                : <View style={{ margin: 10 }}>
                    <Spinner />
                </View>}
        </List>)

    return (<Container>
        {/* <Header searchBar rounded style={{ backgroundColor: 'white' }}>
            <Item>
                <Icon name="ios-search" />
                <Input
                    ref={ inputRef => myInput = inputRef}
                    //geref={inputRef}
                    placeholder="Search"
                    value={inputName}
                    onChangeText={(inputValue) => setInputName(inputValue)}
                />

            </Item>
        </Header> */}
        <Content>
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Form>
                        <Item style={styles.item}>
                            <Icon style={{ color: '#bdbdbd' }} name='ios-search' />
                            <TextInput
                                //getRef={inputRef}
                                ref={ref => myInput = ref}
                                placeholder='Search'
                                value={inputName}
                                autoCapitalize='none'
                                onChangeText={(inputValue) => setInputName(inputValue)} />
                        </Item>
                    </Form>
                </View>
            </View>
            <View>
                {players}
            </View>
        </Content>
    </Container>)
})

const styles = StyleSheet.create({
    formContainer: {
        margin: 5,
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    item: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
    },
    form: {
        marginHorizontal: '5%'
        //backgroundColor:'green'
        //justifyContent: 'flex-start',
        //width: '50%'
    },
})

export default Leaderboard