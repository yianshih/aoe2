import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, TextInput, ScrollView, FlatList } from 'react-native';
import { Container, Body, Content, Left, Right, Title, Icon, Button, Text } from 'native-base';
import * as actions from '../store/actions/index'
import Header from '../components/UI/Header'

const Profile = props => {

    const profile = useSelector(state => state.profile)
    const dispatch = useDispatch()

    return (
        <Container>
            <Header>Profile</Header>
            <Content>
                <View style={styles.screen}>
                    <Text>Profile Screen</Text>
                </View>
            </Content>
        </Container>
    )


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Profile