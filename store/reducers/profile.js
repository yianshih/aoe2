import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
    steamId: '',
    name: '',
    singleMap: null,
    teamMap: null,
    unranked: null,
    followings: []
}

const setFollowings = (state, action) => {
    return updateObject(state,{
        followings: action.followings
    })
}

const setSingleMap = (state, action) => {
    return updateObject(state,{
        singleMap: action.data
    })
}


const setTeamMap = (state, action) => {
    return updateObject(state,{
        teamMap: action.data
    })
}

const setUnranked = (state, action) => {
    return updateObject(state,{
        unranked: action.data
    })
}

const setPersonInfo = (state, action) => {
    return updateObject(state, {
        steamId: action.data.steamId,
        name: action.data.name
    })
}

const setSteamId = (state,action) => {
    return updateObject(state,{steamId: action.id})
}

const setName = (state,action) => {
    return updateObject(state,{name: action.name})
}

const setProfile = (state,action) => {
    return updateObject(state,{profile: action.data})
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.setSteamId: return setSteamId(state, action)
        case actionTypes.setProfile: return setProfile(state, action)
        case actionTypes.setName: return setName(state, action)
        case actionTypes.setPersonInfo: return setPersonInfo(state, action)
        case actionTypes.setSingleMap: return setSingleMap(state, action)
        case actionTypes.setTeamMap: return setTeamMap(state, action)
        case actionTypes.setUnranked: return setUnranked(state, action)
        case actionTypes.setFollowings: return setFollowings(state, action)
        default:
            return state
    }
}


export default reducer