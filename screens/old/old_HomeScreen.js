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
import { auth } from '../services/firebase'
import Colors from '../constants/Colors'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import LastMatch from '../components/LastMatch/LastMatch'
import Spinner from '../components/UI/Spinner/Spinner'

const Home = props => {

    //console.log('[ Home ] : props',props)
    //const [currentUser, setCurrentUser] = useState(auth().currentUser)
    const [error, setError] = useState()
    const steamId = useSelector(state => state.profile.steamId)
    const userName = useSelector(state => state.profile.name)
    const [isChanging] = useState(props.route.params.isChanging)

    const dispatch = useDispatch()


    const loadProfile = useCallback(async () => {
        //console.log('Loading Profile')
        //console.log('LoadingProfile currentUser : ',auth().currentUser)
        try {
          await dispatch(actions.fetchProfile(auth().currentUser.displayName))
        } catch (error) {
          setError(error.message);
        }
      }, [dispatch])

    useEffect(() => {
        loadProfile()
    }, [isChanging])


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

    if (steamId !== '' && !isChanging) {
        greetContent = (
            
                 (<View>
                    <View style={styles.greetMessage}>
                        <Text>Welcome {auth().currentUser.displayName}</Text>
                        {/* <Text>Steam ID : {profile.steamId}</Text> */}
                    </View>
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
                                <Ionicons name="account-multiple" size={30} color={Colors.danger} />
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
                    </List>
                    <LastMatch navigation={{ ...props.navigation }} />
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
    }
})

export default Home