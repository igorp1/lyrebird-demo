import styled from 'styled-components'
import React from 'react'
import { distanceInWordsToNow } from 'date-fns'
import { colors } from './_common'
import { SpeechData } from '../src/LyrebirdService'
import Link from 'next/link';

const SpeechListStyled = styled.ul`
    list-style: none;
    padding:0;
    margin: 0;
    li { margin-bottom:1em; }
`

const TimeStampStyled = styled.span`
    color: grey;
    font-size: 0.75em;
    margin-left: 12px;
`

const ControlsStyled = styled.div`
    cursor: pointer;
    color: ${colors.primary}; 
`

interface SpeechListProps {
    data : SpeechData[ ]
    hideGeneratePromptOnEmpty? : boolean
    overrideOnEmptyText? : string
}
class SpeechList extends React.Component<SpeechListProps> {

    state = { listening : new Set() }

    componentWillReceiveProps(nexProps : SpeechListProps){
        this.setState({ listening : new Set() })
    }

    // ACTIONS
    toggleListening = (index : number) => {
        let listening : Set<number> = this.state.listening

        if(listening.has(index)) listening.delete(index)
        else listening.add(index)

        this.setState({listening})
    }

    download(url : string) { 
        window.open(url,'_blank') 
    }

    // RENDERES
    timeStamp(created_at : string) {
        return (
            <TimeStampStyled>
                {distanceInWordsToNow(created_at, {includeSeconds:true, addSuffix:true})}
            </TimeStampStyled>
        )
    }

    controls = (url:string, i:number) => {
        if(this.state.listening.has(i)){
            return (
                <ControlsStyled>
                    <span onClick={ ()=>{this.toggleListening(i)} } >Hide </span> | 
                    <a onClick={ ()=>this.download(url) }> Download</a>
                </ControlsStyled>
            )
        }
        else{
            return (
                <ControlsStyled>
                    <span onClick={ ()=>{this.toggleListening(i)} }>
                        <i className='material-icons' style={{marginRight: '5px', verticalAlign:'-6px'}} >play_circle_outline</i> 
                        Listen
                    </span> 
                </ControlsStyled>
            
            )
        }
    }

    audio = (url:string, i:number) => {
        if(this.state.listening.has(i)){
            return (
                <div style={{marginTop: '10px'}}>
                    <audio controls src={url}>
                        Your browser does not support the <code>audio</code> element.
                    </audio>
                </div>
            )
        }
        return 
    }

    makeListItem = ({text, url, created_at} : SpeechData , i : number) => {
        return (
            <li key={i}>
                <b>{text}</b> 
                {this.timeStamp(created_at)}
                {this.controls(url, i)}
                {this.audio(url, i)}
            </li>
        )
    }

    get renderListEmpty(){
        return (
            <div style={{margin:'2em 0'}}>
                <h3 style={{color:'grey'}}><i className='material-icons'>sentiment_dissatisfied</i> { this.props.overrideOnEmptyText || 'You have no speeches' }</h3>
                {this.props.hideGeneratePromptOnEmpty ? '' : <Link href='/generate'><a>Ready to generate some speeches?</a></Link>}
            </div>
        )
    }

    render = () => (
        <SpeechListStyled>
            {this.props.data.map(this.makeListItem)}
            {this.props.data.length <= 0 ? this.renderListEmpty : ''}
        </SpeechListStyled>
    )
    
} 

export default SpeechList