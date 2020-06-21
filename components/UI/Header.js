import React from 'react'
import { logout } from '../../services/firebase'
import { Body, Left, Right, Title, Icon, Button, Text, Header} from 'native-base'

const ScreenHeader = props => {

    return (
        <Header>
            <Left>
            </Left>
            <Body>
                <Title>{props.children}</Title>
            </Body>
            <Right>
                <Button transparent onPress={logout}>
                    <Text>Logout</Text>
                </Button>
            </Right>
        </Header>
    )
}


export default ScreenHeader