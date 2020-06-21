import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RefreshControl, StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Body,
    Content,
    Left,
    Right,
    Icon,
    Badge,
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
import { Avatar } from 'react-native-material-ui'
import FollowingCard from '../components/FollowingCard/FollowingCard'
import Spinner from '../components/UI/Spinner/Spinner'

const Home = props => {

    //console.log('[ Home ] : props',props)
    //const [currentUser, setCurrentUser] = useState(auth().currentUser)
    const [error, setError] = useState()
    const steamId = useSelector(state => state.profile.steamId)
    const userName = useSelector(state => state.profile.name)
    const followings = useSelector(state => state.profile.followings)
    const [isChanging] = useState(props.route.params.isChanging)

    const dispatch = useDispatch()


    const loadProfile = useCallback(async () => {
        setError('')
        //console.log('Loading Profile')
        //console.log('LoadingProfile currentUser : ',auth().currentUser)
        try {
            await dispatch(actions.fetchProfile(auth().currentUser.displayName))
            await dispatch(actions.fetchFollowings(auth().currentUser.uid))
        } catch (error) {
            setError(error.message);
        }
    }, [dispatch])

    useEffect(() => {
        loadProfile()
    }, [isChanging])


    let content = (
        <View style={styles.greetMessage}>
            <Spinner />
        </View>
    )


    if (error) {
        content = (
            <View style={styles.greetMessage}>
                <Text>Something went wrong!</Text>
                {/* <Text>{error}</Text> */}
                <Button iconLeft transparent onPress={loadProfile}>
                    <Ionicons name="refresh" size={30} color={Colors.primary} />
                </Button>
            </View>
        )
    }

    if (steamId !== '' && !isChanging) {
        content = (
            (<View>
                <LastMatch navigation={{ ...props.navigation }} />
            </View>)

        )
    }
    // const testfn = (id) => {
    //     let index = -1
    //     let testArray = [
    //         { id: 1, name: 'A' },
    //         { id: 2, name: 'B' }
    //     ]
    //     console.log("ori : ", testArray)
    //     for (let i = 0; i < testArray.length; i++) {
    //         if (testArray[i].id === id) {
    //             index = i
    //         }
    //     }
    //     console.log('index : ', index)
    //     if (index > -1) {
    //         testArray = [...testArray.splice(index, 1)]
    //     }
    //     console.log('new array : ',testArray)

    // }

    return (
        <Container>
            {/* <Button onPress={() => testfn(1)}>
                <Text>Test</Text>
            </Button> */}
            <Content>
                {content}
                <View>
                    {followings
                    ? followings.map( f => {
                        if (+f.id !== 0) return <FollowingCard key={f.id} {...props} steamId={f.id} name={f.name}/>
                        else return
                    })
                    : null}
                </View>
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