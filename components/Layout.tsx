import styled from 'styled-components'
import SideMenu from './SideMenu'
import Router from 'next/router'
import NProgress from 'nprogress'


Router.events.on('routeChangeStart', (_url : string) => { NProgress.start() })
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const LayoutStyled = styled.div`
    display: flex;
    div.children-container { 
        padding: 2em; 
        box-sizing: border-box;
        width:calc(100vw - 225px);
        height: 100vh;
        overflow-y: scroll;
    }
`


interface LayoutProps {
    children : React.ReactNode
}
const Layout = ({ children } : LayoutProps) => (
    <LayoutStyled>
        <SideMenu />
        <div className='children-container'>
            { children }
        </div>
    </LayoutStyled>
)

export default Layout
