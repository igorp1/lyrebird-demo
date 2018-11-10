import React from 'react'
import styled from 'styled-components'
import { colors, shadow, transition } from './_common'
import Link from 'next/link'
import Router from 'next/router';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { saveAuthToken } from '../src/redux-store/auth.store';
import Helpers from '../src/Helpers';

const MenuContainerStyled = styled.div`
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
    .menu-button{ display:none; }
    
    @media all and (max-width: 700px) {
        width: 100vw;
        height: 60px;
        img.logo{ 
            width: 160px;
            padding: 0;
        }
        .menu-button{
            display:block;
            i {
                fontSize:1.8em;
                cursor: pointer;
                color:${colors.light};
            }
        }
        .header-controls{
            padding: 0 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
        }
    }
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
    @media all and (max-width: 700px) {
        position : fixed;
        height: calc(100vh - 60px);
        background-color: ${ colors.primary };
        width: 210px;
        box-shadow: ${shadow.medium};
        padding: 1em 0;
        box-sizing: border-box;
        top: 60px;
        transition: ${transition};
        left: -220px;
        &.open { left:0; }
    }
`
interface SideMenuItem {
    label : string
    icon : string
    link? : string
    action? :  Function  
}

interface MenuProps {
    authToken? : string 
    saveAuthToken : (token : string) => void
}
class Menu extends React.Component <MenuProps> {

    state = {menuOpen:false}

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

    toggleSideMenu = () => {
        this.setState({menuOpen : !this.state.menuOpen})
    }

    render() {
        return (
            <MenuContainerStyled>
                <div className='header-controls'>
                    <Link href='/'><a><img className='logo' src='https://lyrebird.ai/images/logo-lyrebird-horizontal.svg' /></a></Link>
                    <span className='menu-button'>
                        <i className="material-icons noselect" onClick={this.toggleSideMenu}>menu</i>
                    </span>
                </div>
                <MenuItemsContainer className={ this.state.menuOpen ? 'open' : '' } >
                    { this.renderMenuItems }
                </MenuItemsContainer>
            </MenuContainerStyled>
        )
    }


}

const mapStateToProps = ({ authToken } : any) => ({ authToken })
const mapDispatchtoProps = (dispatch : Dispatch) => ({
    saveAuthToken : bindActionCreators(saveAuthToken, dispatch)
})

export default connect(mapStateToProps, mapDispatchtoProps)(Menu)