import { FC } from 'react'

interface LoaderProp {
    show: boolean;
}

// loading spinner
const Loader: FC<LoaderProp> = ({ show }) => {
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