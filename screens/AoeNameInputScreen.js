import React, { useState, useEffect, useCallback } from 'react'
import 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import {
    StyleSheet,
    View,
    Alert,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import {
    Container,
    Content,
    Button,
    Text,
    Form,
    ListItem,
    Left,
    Body,
    Thumbnail
} from 'native-base'
import { signin, updateDisplayName } from '../services/firebase'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from '../components/UI/Spinner/Spinner'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Autocomplete from 'native-base-autocomplete'
import * as actions from '../store/actions/index'




const AoeNameInputScreen = props => {


    //const [isLoading, setIsLoading] = useState(false)
    const [nameList, setNameList] = useState([])
    const [loading, setLoading] = useState(false)
    const [inputName, setInputName] = useState()
    const [error, setError] = useState('')
    //const [isFound, setIsFound] = useState(false)
    const dispatch = useDispatch()
    let myInput = null

    const submitHandler = async () => {
        let didCancel = false
        setError(null)
        try {
            setLoading(true)
            const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=0&search=${inputName}`)
            if (!response.ok) {
                throw new Error(response)
            }
            const resData = await response.json()
            //let filterData = {}
            let isFound = false
            for (let i = 0; i < resData.leaderboard.length; i++) {
                if (resData.leaderboard[i].name.toLowerCase() === inputName.toLowerCase()) {
                    isFound = true
                }
            }
            if (isFound) {
                await updateDisplayName(inputName)
                //props.setName(inputName)
                setLoading(false)
                //setSuccess(true)
            }
            else {
                setLoading(false)
                setError('Player Not Found')
            }
        } catch (error) {
            //setSuccess(false)
            setLoading(false)
            setError(error.message)
        }
        return () => { didCancel = true }
    }

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!inputName) {
                setNameList([])
                return
            }
            if (myInput === null) return
            //console.log("myInput : root ", myInput.textInput._root._getText())
            if (inputName === myInput.textInput._root._getText()) {
                //console.log('ready to search')
                try {
                    const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=0&count=10&search=${inputName}`)
                    if (!response.ok) {
                        setError('Server No Response!')
                        throw new Error('Something went wrong!')
                    }
                    const resData = await response.json()
                    if (resData.leaderboard.length === 0) {
                        setNameList([])
                    }
                    else {
                        setNameList(resData.leaderboard)
                        //setNameList(resData.leaderboard.map(p => p.name))
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

    const inputChangeHandler = (input) => {
        setInputName(input)
        //setIsFound(false)
        setError('')
    }

    const itemClickHandler = (name) => {
        setInputName(name)
        setNameList([])
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', marginTop: '20%' }}>
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Form>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '80%' }}>
                                <Autocomplete
                                    ref={ref => myInput = ref}
                                    autoCapitalize="none"
                                    data={nameList}
                                    defaultValue={inputName}
                                    placeholder="Enter Your AoE Name"
                                    onChangeText={input => inputChangeHandler(input)}
                                    renderItem={item => (
                                        <ListItem
                                            style={{
                                                backgroundColor: 'white'
                                            }}
                                            onPress={() => itemClickHandler(item.name)}>
                                            <Left>
                                                <Thumbnail square style={{ marginRight: 10 }} small source={{ uri: `https://www.countryflags.io/${item.country}/shiny/64.png` }} />
                                                <Text>{item.name}</Text>
                                            </Left>
                                            {/* <View style={{ marginLeft: 10 }}>
                                            <Text>{item.name}</Text>
                                            </View> */}
                                        </ListItem>
                                    )}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {loading
                                    ? <View>
                                        <Spinner />
                                    </View>
                                    : <Button transparent onPress={submitHandler} disabled={inputName === ''}>
                                        <Text>Submit</Text>
                                    </Button>}

                            </View>
                        </View>
                    </Form>
                    {error
                        ? <View style={{ marginTop: 15 }}>
                            <Text style={{ fontSize: 15, color: 'red' }}>{error}</Text>
                        </View>
                        : null}
                    {/* <View style={styles.button}>
                        {loading
                            ? <Spinner />
                            : <Button block onPress={signinHandler} style={{ borderRadius: 0 }}>
                                <Text style={{ fontWeight: '600' }}>Submit</Text>
                            </Button>}

                    </View> */}
                </View>
            </View>
        </View>

    )


}

const styles = StyleSheet.create({
    formContainer: {
        padding: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
    },
})

export default AoeNameInputScreen