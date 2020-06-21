import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Body,
    Content,
    Left,
    Right,
    Icon,
    Button,
    Text,
    List,
    ListItem
} from 'native-base'
import * as actions from '../store/actions/index'
import { auth, logout } from '../services/firebase'
import Colors from '../constants/Colors'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
//import LastMatch from '../components/LastMatch/LastMatch'
import Dialog from "react-native-dialog"
//import { set } from 'react-native-reanimated'
import Spinner from '../components/UI/Spinner/Spinner'

const Home = props => {

    //console.log('[ Home ] : props',props)
    //const [currentUser, setCurrentUser] = useState(auth().currentUser)
    const [error, setError] = useState()
    const steamId = useSelector(state => state.profile.steamId)
    const userName = useSelector(state => state.profile.name)
    const [logoutClicked, setLogoutClicked] = useState(false)
    //const [isChanging] = useState(false)
    //const [isChanging] = useState(props.route.params.isChanging)

    //const dispatch = useDispatch()
    // const loadProfile = useCallback(async () => {
    //     try {
    //         await dispatch(actions.fetchProfile(auth().currentUser.displayName))
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // }, [dispatch])

    // useEffect(() => {
    //     loadProfile()
    // }, [isChanging])

    useEffect(() => {
        //console.log('following changing')
        props.navigation.setOptions({
            title: userName,
        })
    }, [userName])


    let greetContent = (
        <View style={styles.greetMessage}>
            <Spinner />
        </View>
    )


    if (error) {
        greetContent = (
            <View style={styles.greetMessage}>
                <Text>Something went wrong!</Text>
                <Text>{error}</Text>
                <Button
                    title="Try again"
                    onPress={loadProfile}
                />
            </View>
        )
    }

    if (steamId !== '' ) {
        greetContent = (
            (<View>
                <List>
                    <ListItem style={styles.listItem} icon onPress={() => props.navigation.navigate('SingleMap')}>
                        <Left>
                            <Ionicons name="account" size={30} color={Colors.primary} />
                        </Left>
                        <Body>
                            <Text>1v1 Random Map</Text>
                        </Body>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem style={styles.listItem} icon onPress={() => props.navigation.navigate('TeamMap')}>
                        <Left>
                            <Ionicons name="account-group" size={30} color={Colors.danger} />
                        </Left>
                        <Body>
                            <Text>Team Random Map</Text>
                        </Body>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem style={styles.listItem} icon onPress={() => props.navigation.navigate('Unranked')}>
                        <Left>
                            <Ionicons name="alpha-u-box-outline" size={30} color="grey" />
                        </Left>
                        <Body>
                            <Text>Unranked Games</Text>
                        </Body>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem style={styles.listItem} icon onPress={() => props.navigation.navigate('MatchHistory')}>
                        <Left>
                            <Ionicons name="file-document-box-outline" size={30} color={Colors.success} />
                        </Left>
                        <Body>
                            <Text>Match History</Text>
                        </Body>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                </List>
                <Dialog.Container visible={logoutClicked}>
                    <Dialog.Title>Logout</Dialog.Title>
                    <Dialog.Description>
                        Do you want to logout ?
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={() => setLogoutClicked(false)} />
                    <Dialog.Button color='red' label="Logout" onPress={() => logout()} />
                </Dialog.Container>
                <View style={styles.logoutView}>
                    <Button style={styles.logoutButton} onPress={() => setLogoutClicked(true)}>
                        <Text style={{ color: 'red' }}>Logout</Text>
                    </Button>
                </View>
                {/* <LastMatch navigation={{ ...props.navigation }} /> */}
            </View>)

        )
    }

    return (
        <Container>
            <Content>
                {greetContent}
            </Content>
        </Container>

    )


}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
    },
    greetMessage: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        margin: 10
    },
    logoutButton: {
        backgroundColor: 'white'
    },
    logoutView: {
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default Home