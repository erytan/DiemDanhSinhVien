import React from 'react'
import { Outlet } from 'react-router-dom'
import {Test1,Header} from '../../components/member'

const Public = () => {
    return (
        <div className='w-full flex flex-col items-center'>
            <Header/>
            <Test1 />
            <div >
                <Outlet />
            </div>
        </div>
    )
}
export default Public