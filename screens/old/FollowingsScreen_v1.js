import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import {
    Container,
    Body,
    Content,
    Left,
    Right,
    Title,
    Icon,
    Button,
    List,
    ListItem,
    Text,
    Subtitle
} from 'native-base';
import Colors from '../constants/Colors'

const FollowingsScreen = props => {

    const followings = useSelector(state => state.profile.followings)
    const dispatch = useDispatch()

    //const [followings, setFollowings] = useState(followings)

    // const fetchFollowings = useCallback(async () => {
    //     try {
    //         await dispatch(actions.fetchFollowings())
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // }, [dispatch])

    // useEffect(() => {
    //     fetchFollowings()
    // }, [])

    const content = followings
        ? followings.length > 0
            ? followings.map(f => {
                if (+f.id !== 0) return <Text key={f.id}>{f.name}</Text>
                else return
            })
            : <Subtitle style={{ fontSize: 15 }}>You don't have any followings yet</Subtitle>

        : <Subtitle style={{ fontSize: 15 }}>You don't have any followings yet</Subtitle>

    const followingsItem = followings
        ? followings.length > 0
            ? followings.map(f => {
                if (+f.id !== 0) return (
                    <ListItem key={f.id} onPress={() => props.navigation.navigate('PlayerScreen', {
                        playerSteamId: f.id,
                        playerName: f.name
                    })}>
                        <Left>
                            <View>
                                <View>
                                    <Text>{f.name}</Text>
                                </View>
                            </View>
                        </Left>
                        <Right>
                            <Icon active name="ios-arrow-forward" />
                        </Right>
                    </ListItem>
                )
                else return
            })
            : <Subtitle style={{ fontSize: 15 }}>You don't have any followings yet</Subtitle>

        : <Subtitle style={{ fontSize: 15 }}>You don't have any followings yet</Subtitle>

    return (
        <Container>
            <Content>
                <List>
                    {followingsItem}
                </List>
            </Content>
        </Container>
    )


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    }
})

export default FollowingsScreen