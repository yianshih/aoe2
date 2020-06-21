import React, { Fragment } from 'react'
import { View } from 'react-native'
import { Text } from 'native-base'
import Colors from '../../../constants/Colors';
const Bar = props => {

    return (
        props.value > 30
            ? <View style={{
                width: `${props.value < 30 ? 30 : props.value}%`,
                margin: 5,
                backgroundColor: props.value < 70
                    ? props.value > 30
                        ? Colors.chessQueen
                        : props.value < 30 ? 'white' : Colors.danger
                    : Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                // justifyContent: 'flex-end',
                // alignItems: 'flex-end',
            }}>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 15,
                        color: props.value < 30 ? 'red' : 'white'
                    }}
                >{`${props.value}%`}</Text>
            </View>
            : <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{
                    minHeight: 20,
                    width: `${props.value}%`,
                    marginVertical: 5,
                    backgroundColor: Colors.danger,
                    // justifyContent: 'flex-end',
                    // alignItems: 'flex-end',
                }}>
                </View>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 15,
                        color: 'red'
                    }}
                >{`${props.value}%`}</Text>

            </View>
    )

}

export default Bar