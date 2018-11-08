import React from 'react'
import styled from 'styled-components'
import { colors, shadow, transition } from './_common'
import Link from 'next/link'
import Router from 'next/router';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { saveAuthToken } from '../src/redux-store/auth.store';
import Helpers from '../src/Helpers';

const SideMenuStyled = styled.div`
    background-color: ${ colors.primary };
    width: 225px;
    height: 100vh;
    overflow-y: scroll;
    box-shadow: ${ shadow.low };
    img.logo{
        width: 100%;
        padding: 1.5em;
        box-sizing: border-box;
    }
    display: flex;
    flex-direction: column;
`

const MenuItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    div{
        font-size: 1.1em;
        cursor: pointer;
        padding: 14px 10px;
        transition: ${ transition };
        color: ${ colors.light };
        &:hover{
            background-color: rgba(0,0,0,0.4)
        }
        &:active{
            background-color: rgba(0,0,0,0.2)
        }
    }
`
interface SideMenuItem {
    label : string
    icon : string
    link? : string
    action? :  Function  
}

interface SideMenuProps {
    authToken? : string 
    saveAuthToken : (token : string) => void
}
class SideMenu extends React.Component <SideMenuProps> {

    followLink = (link : string) : void => {
        if(link.includes('http')) window.open(link,'_blank')
        else Router.push(link)
    }

    get authenticatedMenuItems() {
        return this.props.authToken ? [
            { label:'Generate', icon:'keyboard_voice', link:'/generate' },
            { label:'Speeches', icon:'record_voice_over', link:'/speeches' },  
            { label:'Search', icon:'search', link:'/search' },  
        ] : []
    }

    get logoutMenuItem() {
        return this.props.authToken ? [
            { label:'Log out', icon:'directions_run', action : this.logOut }
        ] : []
    }

    logOut = () => {
        this.props.saveAuthToken('')
        Helpers.deleteCookie('access_token')
        Router.push('/')
    }

    get renderMenuItems() {
        return [
            ...this.authenticatedMenuItems,
            {label:'lyrebird.ai', icon:'graphic_eq', link:'https://lyrebird.ai'},
            {label:'Ethics', icon:'accessibility_new', link:'https://lyrebird.ai/ethics'},
            ...this.logoutMenuItem
        ]
        .map( ({ label, icon, link, action } : SideMenuItem ) =>(
            <div key={label} onClick={()=>this.selectMenuItem(link,action)} className='noselect'>
                <i className='material-icons'>{icon}</i> <span>{label}</span>
            </div>
        ))
    }

    selectMenuItem = (link?: string, action? : Function) => {
        if(action) action()
        if(link) this.followLink(link)
    }

    render() {
        return (
            <SideMenuStyled>
                <Link href='/'><a><img className='logo' src='https://lyrebird.ai/images/logo-lyrebird-horizontal.svg' /></a></Link>
                <MenuItemsContainer>
                    { this.renderMenuItems }
                </MenuItemsContainer>
            </SideMenuStyled>
        )
    }


}

const mapStateToProps = ({ authToken } : any) => ({ authToken })
const mapDispatchtoProps = (dispatch : Dispatch) => ({
    saveAuthToken : bindActionCreators(saveAuthToken, dispatch)
})

export default connect(mapStateToProps, mapDispatchtoProps)(SideMenu)