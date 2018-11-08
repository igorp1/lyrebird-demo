import React from 'react'
import Router from 'next/router'
import { NextContext } from 'next'
import Helpers from '../src/Helpers'
import LyrebirdService, { SpeechData, SpeechDataResult } from '../src/LyrebirdService'
import SpeechList from '../components/SpeechList';

interface SpeechesProps{
    searchData : SpeechData[],
    nextPage : string
}
class Speeches extends React.Component<SpeechesProps> {

    state = { 
        searchData:this.props.searchData||[], 
        searchTerm : ''
    }

    static async getInitialProps ({req, res} : NextContext) {

        const token = Helpers.readCookie('access_token', req)
        if(!token) {
            if(!res) Router.push('/')
            else {res.writeHead(302, { Location: '/' }); res.end()}
        }

        const { results, next } : SpeechDataResult = await LyrebirdService.loadSpeechesSync(token, null, 100) 
        let searchData = results
        let nextPage = next
        
        while ( nextPage ){
            const { results, next } : SpeechDataResult = await LyrebirdService.loadSpeechesSync(token, nextPage, null) 
            searchData = [...searchData, ...results]
            nextPage = next
        }

        return { searchData }
    }

    get data(){
        if(!this.state.searchTerm) return []
        return this.props.searchData.filter(({text})=>text.toLowerCase().includes(this.state.searchTerm.toLowerCase())) 
    }

    get searchPanel() {
        return (
            <div style={{marginBottom:'2em'}}>
                <input  
                    placeholder='Search'
                    style={{width:'300px'}}
                    value={this.state.searchTerm} 
                    onChange={(e)=>{ this.setState({searchTerm: e.target.value.trim() }) }} 
                />
            </div>
        )
    }

    get results() {
        const emptyText = this.state.searchTerm ? 'No speeches match this search term' : 'Start searching above'
        return <SpeechList data={this.data} hideGeneratePromptOnEmpty={true} overrideOnEmptyText={emptyText} />
    }

    render(){
        return(
            <div>
                <h1>Search</h1>
                {this.searchPanel}
                {this.results}
            </div>
        )
    }

}


export default Speeches
