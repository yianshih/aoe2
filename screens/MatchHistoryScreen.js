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
import FollowingCard from '../components/FollowingCard/FollowingCard'
import MatchesOverview from '../components/MatchesOverview/MatchesOverview'

const MatchHistoryScreen = props => {

    const followings = useSelector(state => state.profile.followings)
    const dispatch = useDispatch()
    const steamId = useSelector(state => state.profile.steamId)

    return (
        <MatchesOverview steamId={steamId} {...props} />
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

export default MatchHistoryScreen