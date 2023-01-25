import { Inter } from '@next/font/google'
import Loader from '../components/Loader'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <div>
            <Loader show />
        </div>
    )
}
