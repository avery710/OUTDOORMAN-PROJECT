import { FC } from 'react'

interface Prop {
    show: boolean;
}

// loading spinner
const Loader: FC<Prop> = ({ show }) => {
    return show ? (
        <div className='lds-roller'>
            <div></div>
            <div></div>               
            <div></div>                          
            <div></div>                                
            <div></div>                                    
            <div></div>                                        
            <div></div>                            
            <div></div>
        </div>
    ) : null
}

export default Loader;