import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd';
import './index.scss'

export default function NavigationBar(props) {
    const navigate = useNavigate();
    return (
        <ol className={`navigate-bar ${props.class}`}>
            <li className='fr' onClick={() => navigate('/index')}><Button>้ฆ้กต</Button></li>
            <li className='fl' onClick={() => navigate(-1)}><Button>ๅ้</Button></li>
        </ol>

    )
}
