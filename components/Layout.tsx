import styled from 'styled-components'


const LayoutStyled = styled.div`
    padding: 2em;
`


interface LayoutProps {
    children : React.ReactNode
}
const Layout = ({ children } : LayoutProps) => (
    <LayoutStyled>
        { children }
    </LayoutStyled>
)

export default Layout
