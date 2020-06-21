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
    Subtitle
} from 'native-base'
import { signin, signup } from '../services/firebase'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from '../components/UI/Spinner/Spinner'
import { Colors } from 'react-native/Libraries/NewAppScreen';
//import { set } from 'react-native-reanimated';




const Login = props => {


    //const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    //const profile = useSelector(state => state.profile)
    //const dispatch = useDispatch();

    const signinHandler = async () => {
        //console.log('Signing in')
        let didCancel = false
        setError(null)
        try {
            setLoading(true)
            await signin(emailInput, passwordInput)
            setLoading(false)
            //setSuccess(true)
        } catch (error) {
            //setSuccess(false)
            setLoading(false)
            if (error.message.indexOf('password') > -1) setPasswordError(true)
            else setEmailError(true)
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
        setEmailInput(input)
        setEmailError(false)
    }

    const passwordInputHandler = (input) => {
        setPasswordInput(input)
        setPasswordError(false)
    }

    return (



        <Container>
            {/* <Header>
                <Body>
                    <Title>Login</Title>
                </Body>
            </Header> */}
            <Content>
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
                            ? <View style={{ marginTop: 15 }}>
                                <Text style={{ fontSize: 15, color: 'red' }}>{error}</Text>
                            </View>
                            : null}
                        <View style={styles.button}>
                            {loading
                                ? <Spinner />
                                : <Button block onPress={signinHandler} style={{ borderRadius: 0 }}>
                                    <Text style={{ fontWeight: '600' }}>LOGIN</Text>
                                </Button>}

                        </View>
                    </View>
                    <View style={styles.signupMessage}>
                        <Text>
                            <Text>Doesn't have account? </Text>
                            <Text style={styles.signupLink} onPress={() => props.navigation.navigate('Signup')} > Sign Up</Text>
                        </Text>
                    </View>
                    {/* <Button block success onPress={signupHandler}>
                        <Text>Sign up</Text>
                    </Button> */}
                </View>
            </Content>
        </Container>
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
        alignContent: 'center'
    },
    signupMessage: {
        alignItems: 'flex-end',
        marginTop: 20
    },
    signupLink: {
        color: '#1976d2'
    }
})

export default Login