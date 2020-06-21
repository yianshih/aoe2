import React, { useState, useEffect, useCallback, Fragment } from 'react'
import 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import {
    StyleSheet,
    View,
    Alert,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import {
    Container,
    Header,
    Body,
    Content,
    Title,
    Icon,
    Button,
    Text,
    Form,
    Item,
    Input,
    Label,
    ListItem
} from 'native-base'
import { signin, signup } from '../services/firebase'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from '../components/UI/Spinner/Spinner'
//import Autocomplete from 'native-base-autocomplete'




const SignupScreen = props => {


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [nameInput, setNameInput] = useState('')

    const signupHandler = async () => {
        let didCancel = false
        //console.log('[ signupHandler ]')
        let completed = true
        if (emailInput === '') {
            setEmailError(true)
            completed = false
        }
        if (passwordInput === '') {
            completed = false
            setPasswordError(true)
        }
        if (nameInput === '') {
            completed = false
        }
        if (completed) {
            setError('Please Fill All Fields')
            return
        }

        setError(null)
        try {
            setLoading(true)
            await signup(emailInput, passwordInput)
            setLoading(false)
            //if (success) props.navigation.goBack()
        } catch (error) {
            console.log(error)
            //setSuccess(false)
            setLoading(false)
            if (error.message.toLowerCase().indexOf('password') > -1) setPasswordError(true)
            else setEmailError(true)
            //console.log('signupHandler : ', error.message)
            setError(error.message)
        }
        return () => { didCancel = true }
    }


    const closeClickHandler = (type) => {
        if (type === 'email') {
            setEmailError(false)
            setEmailInput('')
            setError('')
        }
        else {
            setPasswordError(false)
            setPasswordInput('')
            setError('')
        }
    }

    const emailInputHandler = (input) => {
        setError('')
        setEmailInput(input)
        setEmailError(false)
    }

    const passwordInputHandler = (input) => {
        setError('')
        setPasswordInput(input)
        setPasswordError(false)
    }

    return (

        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '20%' }}>
                <Image source={require(`../assets/icon.png`)} />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Form>
                        <Item inlineLabel error={emailError}>
                            <Ionicons name="email-outline" color='#bdbdbd' size={30} />
                            <Input value={emailInput} autoCapitalize='none' onChangeText={(inputValue) => emailInputHandler(inputValue)} />
                            {emailError
                                ? <TouchableWithoutFeedback onPress={() => closeClickHandler('email')}>
                                    <Icon name='close-circle' />
                                </TouchableWithoutFeedback>
                                : null}
                        </Item>
                        <Item inlineLabellast error={passwordError}>
                            <Ionicons name="lock-outline" color='#bdbdbd' size={30} />
                            <Input secureTextEntry={true} value={passwordInput} onChangeText={(inputValue) => passwordInputHandler(inputValue)} />
                            {passwordError
                                ? <TouchableWithoutFeedback onPress={() => closeClickHandler('passworf')}>
                                    <Icon name='close-circle' />
                                </TouchableWithoutFeedback>
                                : null}
                        </Item>
                    </Form>
                    {error
                        ? <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, color: 'red' }}>{error}</Text>
                        </View>
                        : null}
                    <View style={styles.button}>
                        {loading
                            ? <Spinner />
                            : <Button block onPress={signupHandler} style={{ borderRadius: 0 }}>
                                <Text style={{ fontWeight: '600' }}>SIGN UP</Text>
                            </Button>}

                    </View>
                </View>
                <View style={styles.signupMessage}>
                    <Text>
                        <Text>Already have an account? </Text>
                        <Text style={styles.signupLink} onPress={() => props.navigation.goBack()}> Log In </Text>
                    </Text>
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
        width: '70%',
    },
    button: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupMessage: {
        alignItems: 'flex-end',
        marginTop: 20
    },
    signupLink: {
        color: '#1976d2'
    }
})

export default SignupScreen