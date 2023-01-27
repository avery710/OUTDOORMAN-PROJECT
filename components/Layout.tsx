import styles from '../styles/Layout.module.css'
import Navbar from './Navbar'

interface LayoutProps {
    children: JSX.Element | JSX.Element[]
}

const Layout = ({children}: LayoutProps) => {
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {children}
            </div>
        </>
        
    )
}

export default Layout