import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { List, Pagination } from 'antd';
import qs from 'querystring'
import Loading from '../../conponents/Loading'
import axios from 'axios';
import './index.scss'

const xings = [
    { value: '热', label: '热' },
    { value: '温', label: '温' },
    { value: '平', label: '平' },
    { value: '凉', label: '凉' },
    { value: '寒', label: '寒' },
];
const weis = [
    { value: '酸', label: '酸' },
    { value: '咸', label: '咸' },
    { value: '甘', label: '甘' },
    { value: '苦', label: '苦' },
    { value: '辛', label: '辛' },
    { value: '涩', label: '涩' },
]
const guijings = [
    { value: '心', label: '心' },
    { value: '肝', label: '肝' },
    { value: '脾', label: '脾' },
    { value: '肺', label: '肺' },
    { value: '肾', label: '肾' },
    { value: '膀胱', label: '膀胱' },
    { value: '小肠', label: '小肠' },
    { value: '大肠', label: '大肠' },
    { value: '胃', label: '胃' },
    { value: '三焦', label: '三焦' },
    { value: '心包', label: '心包' }
]
const efficacies = [
    { value: '消食', label: '消食' },
    { value: '祛风', label: '祛风' },
    { value: '清热', label: '清热' },
    { value: '解毒', label: '解毒' },
    { value: '止痛', label: '止痛' },
    { value: '祛寒', label: '祛寒' },
    { value: '化痰', label: '化痰' },
    { value: '安神', label: '安神' },
    { value: '泻下', label: '泻下' },
    { value: '外用', label: '外用' },
    { value: '理血', label: '理血' },
    { value: '化湿', label: '化湿' },
    { value: '收涩', label: '收涩' },
    { value: '止吐', label: '止吐' },
    { value: '驱虫', label: '驱虫' },
    { value: '麻药', label: '麻药' },
    { value: '杀虫', label: '杀虫' },
    { value: '软坚', label: '软坚' },
    { value: '利水', label: '利水' },
    { value: '祛暑', label: '祛暑' },
    { value: '补益', label: '补益' },
    { value: '利水渗湿', label: '利水渗湿' },
    { value: '平肝息风', label: '平肝息风' },
    { value: '解表', label: '解表' },
    { value: '涌吐', label: '涌吐' },
    { value: '平肝', label: '平肝' },
    { value: '补虚', label: '补虚' },
    { value: '温里', label: '温里' },
    { value: '止血', label: '止血' },
    { value: '攻毒杀虫止痒', label: '攻毒杀虫止痒' },
    { value: '祛风湿', label: '祛风湿' },
    { value: '活血化淤', label: '活血化淤' },
    { value: '理气', label: '理气' },
    { value: '化痰止咳平喘', label: '化痰止咳平喘' },
    { value: '开窍', label: '开窍' },
    { value: '祛虫', label: '祛虫' },
    { value: '风药', label: '风药' },
    { value: '燥湿', label: '燥湿' },
]
const origins = [
    { value: '北京', label: '北京' },
    { value: '上海', label: '上海' },
    { value: '黑龙江', label: '黑龙江' },
    { value: '吉林', label: '吉林' },
    { value: '辽宁', label: '辽宁' },
    { value: '天津', label: '天津' },
    { value: '安徽', label: '安徽' },
    { value: '江苏', label: '江苏' },
    { value: '浙江', label: '浙江' },
    { value: '陕西', label: '陕西' },
    { value: '湖北', label: '湖北' },
    { value: '广东', label: '广东' },
    { value: '湖南', label: '湖南' },
    { value: '甘肃', label: '甘肃' },
    { value: '四川', label: '四川' },
    { value: '山东', label: '山东' },
    { value: '福建', label: '福建' },
    { value: '河南', label: '河南' },
    { value: '重庆', label: '重庆' },
    { value: '云南', label: '云南' },
    { value: '河北', label: '河北' },
    { value: '江西', label: '江西' },
    { value: '山西', label: '山西' },
    { value: '贵州', label: '贵州' },
    { value: '广西', label: '广西' },
    { value: '内蒙古', label: '内蒙古' },
    { value: '宁夏', label: '宁夏' },
    { value: '青海', label: '青海' },
    { value: '新疆', label: '新疆' },
    { value: '海南', label: '海南' },
    { value: '西藏', label: '西藏' },
    { value: '香港', label: '香港' },
    { value: '澳门', label: '澳门' },
    { value: '台湾', label: '台湾' },
]

const zhMap = {
    xing: '性味',
    wei: '性味',
    guijing: '归经',
    efficacy: '功效',
    origin: '产地',
}

let consSet = [];

export default function ResultPage() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState({ idx: 1, size: 20 });
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const { idx, size } = page;
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = qs.parse(search.slice(1));

    let numConditions = 0;
    for (let field in query) {
        if (field === 'name') continue;
        if (Array.isArray(query[field])) {
            numConditions += query[field].length;
        } else {
            numConditions++;
        }
    }

    useEffect(() => {
        // TODO 从后端请求，传入对象
        // 没有条件 {name, idx, size}，后端先从接口拿到med_id数组，在遍历数组查询数据库获得med对象数组，返回给前端
        // 有条件 {(name),(xing),(wei),(guijing),(efficacy),(origin),idx,size},在数据库中对每一字段模糊查询，结果返回给前端
        setLoading(true);
        if (query.name && numConditions <= 1) {
            let key = '功效', val = '';
            for (let k in query) if (k !== 'name') { key = zhMap[k]; val = query[k]; }
            axios.post('/med', {
                "searchText": query.name,
                "type_name": key,
                "type_detail_name": val,
                "start": idx,
                "items_per_page": size
            }).then(res => {
                setTotal(res.data.count);
                setItems(res.data.result);
                setLoading(false);
            });
        } else {
            setItems(consSet.slice((idx - 1) * size, idx * size));
            setLoading(false);
        }
    }, [search, idx, size])

    useEffect(() => {
        setLoading(true);
        const name = query.name || '';
        const promises = [];
        const idCount = new Array(20000).fill(0);
        let minSet = [];

        const handleResponse = res => {
            const { result } = res.data;
            if (minSet.length === 0 || minSet.length > result.length) minSet = result;
            for (let item of result) idCount[parseInt(item.med_id)]++;
        }

        for (let field in query) {
            if (field === 'name') continue;
            if (Array.isArray(query[field])) {
                for (let condition of query[field]) {
                    promises.push(axios.post('/med', {
                        "searchText": name,
                        "type_name": zhMap[field],
                        "type_detail_name": condition,
                        "start": 1,
                        "items_per_page": 10000
                    }).then(handleResponse));
                }
            } else {
                promises.push(axios.post('/med', {
                    "searchText": name,
                    "type_name": zhMap[field],
                    "type_detail_name": query[field],
                    "start": 1,
                    "items_per_page": 10000
                }).then(handleResponse));
            }
        }
        if (promises.length !== 0)
            Promise.all(promises)
                .then(() => {
                    const ids = [];
                    idCount.forEach((val, idx) => { if (val === numConditions) ids.push(idx) })
                    setTotal(ids.length);
                    for (let item of minSet) {
                        if (ids.includes(parseInt(item.med_id))) consSet.push(item);
                    }
                    setItems(consSet.slice(0, size));
                    setLoading(false);
                }).catch(err => console.log(err));
        setPage({ idx: 1, size });
    }, [search]);

    const detail = name => {
        navigate(`/${name}`);
    }

    const retRandom = (field) => {
        let ret = '';
        const map = {
            xing: xings,
            wei: weis,
            guijing: guijings,
            efficacy: efficacies,
            origin: origins,
        }
        for (let i = 0; i < Math.ceil(Math.random() * map[field].length / 2); i++)
            ret += (i !== 0 ? '、' : '') + map[field][Math.floor(Math.random() * map[field].length)].value;
        return ret

    }

    return (
        <div className='result-list'>
            {isLoading ?
                <Loading /> :
                <>
                    <div className='list'>
                        <List
                            size="small"
                            dataSource={items}//.slice((idx - 1) * size, idx * size)
                            renderItem={(item) => (
                                <List.Item className='list-item' onClick={() => detail(item.med_simple_name)}>
                                    <div key={item} className='left-text'>
                                        <h2 dangerouslySetInnerHTML={{ __html: item.med_name.split('|')[0] }}></h2>
                                        <ol>
                                            <li className='xingwei'>【性味】：<span dangerouslySetInnerHTML={{ __html: item.property.replace('@_@source=', '') }}></span></li>
                                            <li className='gongxiao'>【功效】：<span dangerouslySetInnerHTML={{ __html: item.function.replace('@_@source=', '') }}></span></li>
                                        </ol>
                                    </div>
                                    <div className='pic'>
                                        <img src={`http://zcy.ckcest.cn/zcypics/medInfo/${item.med_id}/plant/0.jpg`} alt={item.name} />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    <Pagination className='pager' defaultCurrent={idx} defaultPageSize={size} total={total} onChange={(idx, size) => { setPage({ idx, size }) }} />
                </>
            }
        </div>
    )
}
