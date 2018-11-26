import axios from 'axios'


const getUrlParam = param => {
    const query = new URLSearchParams(window.location.search)
    return query.get(param)
}

const onVote = id => {
    const jwt = window.sessionStorage.getItem('jwt')
    return axios({
        method: 'POST',
        url: 'https://wx.idsbllp.cn/showbe/vote',
        params: {
            id: id
        },
        headers: {
            'jwt': jwt
        }
    })
}

const getVoteCount = () => {
    const jwt = window.sessionStorage.getItem('jwt')
    return axios({
        method: 'GET',
        url: 'https://wx.idsbllp.cn/showbe/info',
        headers: {
            'jwt': jwt
        }
    })
}

export {
    getUrlParam,
    onVote,
    getVoteCount
}