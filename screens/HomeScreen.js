import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    Text,
} from 'native-base'
import * as actions from '../store/actions/index'
import { auth } from '../services/firebase'
import LastMatch from '../components/LastMatch/LastMatch'
import Spinner from '../components/UI/Spinner/Spinner'
import Bar from '../components/UI/Bar/Bar'

const Home = props => {

    //console.log('[ Home ] : props',props)
    //const [currentUser, setCurrentUser] = useState(auth().currentUser)
    //const [initLoading, setInitLoading] = useState(true)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const steamId = useSelector(state => state.profile.steamId)
    //const [fontSize, setFontSize] = useState()
    const uid = auth().currentUser.uid
    //const displayName = auth().currentUser.displayName
    const [displayName, setDisplayName] = useState(auth().currentUser.displayName)

    const dispatch = useDispatch()

    useEffect(() => {
        setIsLoading(true)
        let didCancel = false
        if (displayName !== null) {
            setIsLoading(true)
            //console.log("displayName in effect: ", displayName)
            dispatch(actions.fetchProfile(displayName)).then(() => {
                //setIsLoading(false)
                dispatch(actions.fetchFollowings(uid)).then(() => {
                    setIsLoading(false)
                })
            })
        }
        return () => { didCancel = true }
    }, [dispatch])

    let content = (
        <View style={styles.greetMessage}>
            <Spinner />
        </View>
    )

    if (displayName) {
        if (error) {
            content = (
                <View style={styles.greetMessage}>
                    <Text>Something went wrong!</Text>
                </View>
            )
        }

        if (steamId) {
            content = (
                (<LastMatch navigation={{ ...props.navigation }} />)

            )
        }
    }

    return (
        <Fragment>
            {isLoading
                ? <View style={styles.greetMessage}>
                    <Spinner />
                </View>
                : content}
        </Fragment>

    )


}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
    },
    greetMessage: {
        flex: 1,
        backgroundColor: 'white',
        marginVertical: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        margin: 10
    },
})

export default Home