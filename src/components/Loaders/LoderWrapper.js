import React from 'react'
import styles from './loader.module.css'
import { toast } from 'sonner'
import { removeToken } from '@/Actions/Controllers/TokenController'
const LoaderWrapper = ({ loading, children , status , router}) => {    
    if(status ==404 || status ==401 || status ==403)
        {
            toast.error("Please Login Again")
            removeToken(router)
        }
    if(status ==503 )
    {
        toast.error("Server is under maintenance")
    }
    return (
        <>
            {children}
            {loading && <div className={styles.loaderWrapper}>
                <div className={styles.loader}></div>
            </div>}
        </>

    )
}

export default LoaderWrapper