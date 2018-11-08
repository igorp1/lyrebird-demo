import React from 'react'
import Router from 'next/router'
import { NextContext } from 'next'
import Helpers from '../src/Helpers'
import { connect } from 'react-redux'
import SpeechList from '../components/SpeechList'
import LyrebirdService, { SpeechData, SpeechDataResult } from '../src/LyrebirdService'


interface SpeechesProps{
    data : SpeechData[],
    nextPage : string,
    authToken : string
}
class Speeches extends React.Component<SpeechesProps> {

    state = { 
        data:this.props.data||[], 
        nextPage:this.props.nextPage, 
        listening: new Set(),
        loadingNext : false
    }

    static async getInitialProps ({req, res} : NextContext) {

        const token = Helpers.readCookie('access_token', req)

        if(!token) {
            if(!res) Router.push('/')
            else {res.writeHead(302, { Location: '/' }); res.end()}
        }

        const { results:data, next:nextPage } = await LyrebirdService.loadSpeechesSync(token, null, null)

        return {data, nextPage}
    }

    static buildHeaders(token : string) : any {
        return {  'Authorization': `Bearer ${ token }` }
    }

    loadNextPage = () => {
        this.setState({loadingNext:true})
        LyrebirdService.loadSpeeches(this.props.authToken, null, null, (response, error?: string) => {
            if(!response && error) return console.log(error)

            const { results:data, next:nextPage } = response as SpeechDataResult
            this.setState({
                data:[...this.state.data, ...data], nextPage,
                loadingNext:false  
            })
        })
    }

    get speechList () {
        return (
            <div>   
                <SpeechList data={this.state.data} />
                <div hidden={!this.state.nextPage}>
                    <button onClick={this.loadNextPage} className='highlight' >{
                        !this.state.loadingNext ? 'LOAD MORE' : 'LOADING...'
                    }</button>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div>
                <h1>Speeches</h1>
                {this.speechList}
            </div>
        )
    }

}

const mapStateToProps = ({ authToken } : any) => ({ authToken })
export default connect(mapStateToProps)(Speeches)
