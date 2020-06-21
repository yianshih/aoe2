export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}

export const calculateTimeAgo = (past) => {
    const pastDate = (new Date(past * 1000))
    const currentDate = (new Date()).getTime()
    const microSecondsDiff = Math.abs(pastDate - currentDate)
    let timeDiff = Math.floor(microSecondsDiff / (1000 * 60)) // mins
    let dateFormat = 'mins'
    if (timeDiff > 59) { // over 1 hour
        if (Math.floor(timeDiff / 60) > 23) { //  over 1 day
            dateFormat = Math.floor((timeDiff / (60 * 24))) > 1 ? 'days' : 'day'
            timeDiff = Math.floor(timeDiff / (60 * 24))
        }
        else { // over 1 hour
            dateFormat = 'hours'
            timeDiff = Math.floor(timeDiff / 60)
        }
    }
    const lastDate = (dateFormat === 'mins' && timeDiff === 0) ? 'Just Now' : `${timeDiff} ${dateFormat} ago`
    return lastDate
}

export const calculateTimeDiff = (start, finish) => {
    const startDate = (new Date(start * 1000))
    const finishDate = (new Date(finish * 1000))
    const microSecondsDiff = Math.abs(startDate - finishDate)
    let timeDiff = Math.floor(microSecondsDiff / (1000 * 60)) // mins
    //let dateString = 'mins'
    let lastDate = ''
    if (timeDiff > 59) { // over 1 hour
        const hours = Math.floor(timeDiff / 60)
        const mins = timeDiff % 60
        lastDate = `${hours} ${hours > 1 ? 'hours' : 'hour'} ${mins} mins`
    }
    else {
        lastDate = `${timeDiff} mins`
    }

    return lastDate
}