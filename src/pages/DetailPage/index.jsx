import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Anchor } from 'antd'
import { isArray } from 'lodash'
import axios from 'axios'
import Loading from '../../conponents/Loading'
import './index.scss'
const fieldMap = {
    med_name_zh: '中 文 名',
    med_name_en: '英 文 名',
    med_name_latin: '拉 丁 名',
    med_name_alias: '别 名',
    med_origin: '基 源',
    med_appearance: '原 形 态',
    med_gnzz: '功 效',
    med_property: '性 味',
    med_tropisw: '归 经',
    med_pharmacology: '药 理 作 用',
    med_chemistry: '化 学 成 分',
    med_chem_identify: '理 化 鉴 别',
    med_app_identify: '性 状 鉴 别',
    med_attached_prescription: '附 方',
    med_usage: '用 法 用 量',
    pro_art: '炮 制',
    med_preparation: '制 剂',
    med_reaction: '不 良 反 应',
    med_toxcity: '毒 性',
    med_attention: '注 意',
    med_store: '贮 藏',
    med_remark: '备 注',
    med_enviroment: '生 境 分 布',
    medgenuinelocation: '道 地',
    medlocation: '产 地',
}
const { Link: ALink } = Anchor;
export default function Detailpage() {
    const { name } = useParams();
    const [context, setContext] = useState({});
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        let medName, medId;
        let text = {};
        axios.post('/med', {
            "searchText": name,
            "type_name": "功效",
            "type_detail_name": "",
            "start": 1,
            "items_per_page": 1
        }).then(res => {
            medName = res.data.result[0].med_simple_name;
            medId = res.data.result[0].med_id;
            return axios.post('/medinfo', {
                "medname": medName,
                "medid": medId,
                "source": "all"
            })
        }).then(res => {
            text = res.data;
            handleResult(text);
            return axios.post('/similars', {
                "medname": medName,
                "medid": medId,
                "sim_num": 10
            })
        }).then(res => {
            text.similars = res.data.similarity;
            setContext(text);
            setLoading(false);
        }).catch(err => console.log(err));
    }, [name])

    const handleResult = result => {
        for (let key in result) {
            if (isArray(result[key])) {
                if (key !== 'medlocation' && key !== 'medgenuinelocation') {
                    for (let i = result[key].length - 1; i >= 0; i--) {
                        let idx = result[key][i].indexOf('@_@source=');
                        // console.log(idx)
                        if (idx === 0) {
                            result[key].splice(i, 1);
                        }
                    }
                }
                if (result[key].length === 0) {
                    delete result[key];
                }
            }
        }
    }
    const attachLink = (content) => {
        let idx = content.indexOf('@_@source=');
        content = content.replace('@_@source=', '');
        return (
            <>
                {content.slice(0, idx)}<a href='#'>{content.slice(idx)}</a>
            </>
        )
    }
    return (
        <div className='context-container'>
            {isLoading ?
                <Loading /> :
                <>
                    <div className='title'><h3>{name}</h3></div>
                    <div className='left-nav'>
                        <Anchor affix={false} showInkInFixed={false} getContainer={() => document.getElementById('text')} onClick={e => e.preventDefault()}>
                            {
                                Object.keys(fieldMap).map((key, idx) => {
                                    if (key in context && (!isArray(context[key]) || context[key].length !== 0)) {
                                        return <ALink key={idx} href={`#${key}`} title={`${fieldMap[key]}`} />
                                    }
                                    return '';
                                })
                            }
                            <ALink href={`#similars`} title='相 似 推 荐' />
                        </Anchor>
                    </div>
                    <div className='right-context' id='text'>
                        {
                            Object.keys(fieldMap).map(key => {
                                if (key in context) {
                                    if (key === 'medlocation' || key === 'medgenuinelocation') {
                                        return (
                                            <section key={key} id={`${key}`}>
                                                <h4 id={`${key}`}>{fieldMap[key]}</h4>
                                                <p>&emsp;&emsp;
                                                    {
                                                        context[key].map((obj, idx, array) => `${obj.medlocation}` + (idx === array.length - 1 ? '。' : '，'))
                                                    }
                                                </p>
                                            </section>
                                        )
                                    } else if (isArray(context[key]) && context[key].length !== 0) {
                                        return (
                                            <section key={key} id={`${key}`}>
                                                <h4>{fieldMap[key]}</h4>
                                                {
                                                    context[key].map((content, index) => <p key={index}>&emsp;&emsp;{attachLink(content)}</p>)
                                                }
                                                {
                                                    key === 'med_reaction' ?
                                                        (<>
                                                            {'med_mechanism' in context ? <p>&emsp;&emsp;{attachLink(context['med_mechanism'][0])}</p> : ''}
                                                            {'med_cure' in context ? <p>&emsp;&emsp;{attachLink(context['med_cure'][0])}</p> : ''}
                                                        </>)
                                                        : ''
                                                }
                                            </section>
                                        )
                                    } else if (!isArray(context[key])) {
                                        return (
                                            <section key={key} id={`${key}`}>
                                                <h4 >{fieldMap[key]}</h4>
                                                <p>&emsp;&emsp;{context[key]}</p>
                                            </section>
                                        )
                                    }
                                }
                                return '';
                            })
                        }
                        <section id='similars'>
                            <h4>相 似 推 荐</h4>
                            <p>&emsp;&emsp;{context.similars.map(val => <><Link key={val} to={`/${val.name}`}>{val.name}</Link>&emsp;</>)}</p>
                        </section>
                    </div>
                </>
            }
        </div>
    )
}