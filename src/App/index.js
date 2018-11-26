import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { getUrlParam, onVote, getVoteCount } from '../api'
import data from '../data'
import './index.scss'
import './normalize.css'

const Card = props => {
    const {id, name, introduction} = props.item
    const {vote} = props.voteCount
    const img = props.voted.includes(id) ? 'like-active' : 'like'
    const showCard = () => {
        props.handleCard()
        props.changeCurrentCard(id)
    }
    const clickLike = () => {
        onVote(id)
        .then(res => {
            let status = res.data.status
            switch (status) {
                case 10000:
                    props.showModalMsg('点赞成功！')
                    props.handleClickLike(id)
                    break
                case 10004:
                    props.showModalMsg('今天的票数已经投完了哦！')
                    break
                case 10005:
                    props.showModalMsg('只有本校的同学才能投票哦！')
                    break
                default:
                    props.showModalMsg('身份验证失败！请重新进入本网站。')
            }
        })
        .catch(err => {
            console.log(err)
            props.showModalMsg('请检查手机网络状态')
        })
    }
    return (
        <div className="card" onClick={showCard}>
            <img src={require(`../assets/${id}a.jpg`)} alt=""/>
            <div className="card-right">
                <p className="p1">{name}<span className="like"><img src={require(`../assets/${img}.png`)} alt="" onClick={e => {e.stopPropagation();clickLike()}}/>{vote}</span></p>
                <p className="p2" style={{WebkitBoxOrient: 'vertical'}}>介绍：{introduction}</p>
                {/* <p className="p3">社团：街舞社</p> */}
            </div>
        </div>
    )
}

Card.defaultProps = {
    voteCount: {
        showId: 0,
        vote: 0
    }
}

const Popup = props => {
    const {id, name, introduction, hobby} = props.item
    const {vote} = props.voteCount
    const img = props.voted.includes(id) ? 'like-active' : 'like'
    const closePopup = () => {
        props.handlePopup(false)
    }
    const clickLike = () => {
        onVote(id)
        .then(res => {
            let status = res.data.status
            switch (status) {
                case 10000:
                    props.showModalMsg('点赞成功！')
                    props.handleClickLike(id)
                    break
                case 10004:
                    props.showModalMsg('今天的票数已经投完了哦！')
                    break
                case 10005:
                    props.showModalMsg('只有本校的同学才能投票哦！')
                    break
                default:
                    props.showModalMsg('身份验证失败！请重新进入本网站。')
            }
        })
        .catch(err => {
            console.log(err)
            props.showModalMsg('请检查手机网络状态')
        })
    }
    return (
        <div className="pop-up" onClick={closePopup} key="1">
            <div className="container" onClick={e => e.stopPropagation()}>
                <div className="pic">
                    <img src={require(`../assets/${id}b.jpg`)} alt=""/>
                </div>
                <div className="info">
                    <p className="p4">{name}<span className="like"><img src={require(`../assets/${img}.png`)} alt="" onClick={e => {e.stopPropagation();clickLike()}}/>{vote}</span></p>
                    <p className="p5"><span style={{color: '#0558bf'}}>介绍：</span>{introduction}</p>
                    {hobby && (<p className="p5 p6"><span style={{color: '#0558bf'}}>爱好：</span>{hobby}</p>)}
                </div>
            </div>
        </div>
    )
}

Popup.defaultProps = {
    voteCount: {
        showId: 0,
        vote: 0
    }
}

const Modal = props => {
    const {msg} = props
    const closeModal = () => {
        props.handleModal(false)
    }
    return (
        <div className="modal">
            <div className="container">
                <p>{msg}</p>
                <div onClick={closeModal}>确定</div>
            </div>
        </div>
    )
}

export default class App extends React.Component {
    state = {
        isShowPopup: false,
        isShowModal: false,
        msg: "正在加载...",
        data: data,
        voted: [],
        voteCount: [],
        currentCard: {
            id: 1,
            name: '爱心社',
            introduction: '王俊同学作为爱心社的代表，准备在闪耀的舞台上用采访的方式来诠释自己对公益志愿的理解。',
        }
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    社团达人秀
                </header>
                <main>
                    {this.state.data.map(e => (<Card handleCard={this.showCard} key={e.id} item={e} voteCount={this.state.voteCount.find(s => s.showId===e.id)} voted={this.state.voted} changeCurrentCard={this.changeCurrentCard} showModalMsg={this.showModalMsg} handleClickLike={this.handleClickLike}/>))}
                    <div style={{textAlign: 'center', fontSize: '4.5vw', color: '#0b4b9a', marginTop: '5vw', fontWeight: '600'}}>© 红岩网校工作站</div>
                </main>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                {this.state.isShowPopup && <Popup handlePopup={this.showPopup} item={this.state.currentCard} voteCount={this.state.voteCount.find(s => s.showId===this.state.currentCard.id)} voted={this.state.voted} showModalMsg={this.showModalMsg} handleClickLike={this.handleClickLike}/>}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="bounce"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                >
                {this.state.isShowModal && <Modal handleModal={this.showModal} msg={this.state.msg}/>}
                </ReactCSSTransitionGroup>
            </React.Fragment>
        )
    }

    showModal = boolean => {
        this.setState({
            isShowModal: boolean
        })
    }

    showPopup = boolean => {
        this.setState({
            isShowPopup: boolean
        })
    }

    showCard = () => {
        this.showPopup(true)
    }

    showModalMsg = msg => {
        this.setState({
            msg: msg,
            isShowModal: true
        })
    }

    changeCurrentCard = id => {
        let s = this.state.data.find(e => e.id === id)
        this.setState({
            currentCard: s
        })
    }

    handleClickLike = id => {
        let data = this.state.voteCount
        if (data[id-1]) {
            data[id-1]['vote']++
        }
        else {
            data.push({
                showId: id,
                vote: 1
            })
        }
        this.setState(prevState => ({
            voteCount: data,
            voted: prevState.voted.concat(id)
        }))
    }

    componentDidMount = () => {
        let param = getUrlParam('s')
        if (param) {
            window.sessionStorage.setItem('jwt', param)
        }
        else if (!param && !window.sessionStorage.getItem('jwt')){
            this.showModalMsg('身份验证失败！请重新进入本网站。')
        }

        getVoteCount()
            .then(res => {
                let status = res.data.status
                switch (status) {
                    case 10000:
                        let {voteCount, voted} = res.data.data
                        this.setState({
                            voteCount: voteCount,
                            voted: voted
                        })
                        break
                    default:
                        this.showModalMsg('身份验证失败！请重新进入本网站。')
                        break
                }
            })
            .catch(err => {
                console.log(err)
                this.showModalMsg('请检查手机网络状态')
            })
    }
}