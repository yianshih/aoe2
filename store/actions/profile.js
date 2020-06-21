import * as actionTypes from './actionTypes'
import { db, auth } from '../../services/firebase'

//export const setName = ()

export const fetchFollowings = (uid) => {
    //console.log('ready to fetch [actions profile]')
    return async dispatch => {
        try {
            await db.ref('users/' + uid + '/followings')
                .on('value', snapshot => {
                    //console.log(snapshot)
                    if (snapshot.val()) {
                        if (snapshot.val().length > 0) {
                            dispatch({ type: actionTypes.setFollowings, followings: snapshot.val() })
                        }
                    }

                })
        } catch (error) {
            console.log(error)
        }

    }
}

export const fetchProfile = (name) => {
    console.log('fetching Profile')
    return async dispatch => {
        try {
            const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=0&search=${name}`)
            if (!response.ok) {
                throw new Error(response)
                //throw new Error('Something went wrong!')
            }
            const resData = await response.json()
            let filterData = {}
            for (let i = 0; i < resData.leaderboard.length; i++) {
                if (resData.leaderboard[i].name.toLowerCase() === name.toLowerCase()) {
                    filterData = { ...resData.leaderboard[i] }
                }
            }
            //console.log("filterData : ", filterData)
            const data = {
                steamId: filterData.steam_id,
                name: filterData.name,
            }
            dispatch({ type: actionTypes.setPersonInfo, data: data })
        } catch (err) {
            console.log(err)
        }
    }
}

export const fetchGameData = (steamId, type) => {

    return async dispatch => {
        try {
            //const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${type}&search=${name}`)
            const response = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=${type}&steam_id=${steamId}`)
            if (!response.ok) {
                throw new Error('Something went wrong!')
            }
            const resData = await response.json()
            let data = null
            if (resData.leaderboard.length < 1) {
                data = 'unplayed'
            }
            else {
                data = {
                    rate: resData.leaderboard[0].rating,
                    highestRate: resData.leaderboard[0].highest_rating,
                    games: resData.leaderboard[0].games,
                    wins: resData.leaderboard[0].wins,
                    losses: resData.leaderboard[0].losses,
                    rank: resData.leaderboard[0].rank,
                }
            }

            if (+type === 0) {
                dispatch({ type: actionTypes.setUnranked, data: data })
            }
            else if (+type === 3) {
                dispatch({ type: actionTypes.setSingleMap, data: data })
            }
            else if (+type === 4) {
                dispatch({ type: actionTypes.setTeamMap, data: data })
            }
            else {
                console.log('Unknown map type')
            }



        } catch (error) {
            console.log(error)
            throw error
        }

    }
}

