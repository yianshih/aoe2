import React from 'react'
import { View, StyleSheet } from 'react-native'
import {
    Text
} from 'native-base'
import ProgressCircle from 'react-native-progress-circle'

const Circle = props => {

    return (
        <View style={styles.circle}>
            <ProgressCircle
                percent={+props.percent}
                radius={50}
                borderWidth={8}
                color={props.color}
                shadowColor="#cfcfcf"
                bgColor="white">
                <Text style={{ fontSize: 25 }}>{props.text}</Text>
            </ProgressCircle>
            <Text style={{marginTop:10}}>{props.label}</Text>
        </View>)

}

const styles = StyleSheet.create({
    circle: {
        justifyContent:'center',
        alignItems:'center'
    },
})

export default Circle