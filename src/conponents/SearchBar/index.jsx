import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { isEqual, remove } from 'lodash'
import { SearchOutlined, ClockCircleOutlined, CloseOutlined, FireOutlined, RiseOutlined, BulbOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Tooltip, Input, Select, Divider } from 'antd';
import axios from 'axios';
import qs from 'querystring';
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

let recordItems = JSON.parse(localStorage.getItem('records')) || [];
let hotItemsObj = JSON.parse(localStorage.getItem('hotItemsObj'));
if (!hotItemsObj) {
    hotItemsObj = { '人参': 42, '阿胶': 31, '麻黄': 16, '藜芦': 13, '安息香': 10, '垂珠花': 8, '玳瑁': 5 };
    localStorage.setItem('hotItemsObj', JSON.stringify(hotItemsObj));
}
let xing = [];
let wei = [];
let guijing = [];
let efficacy = [];
let origin = [];

let prevQueryObj = {};

export default function SearchBar(props) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const _name = useRef(null);

    const [content, setContent] = useState('');
    const [isShow, setShow] = useState(false);
    const [completeItems, setCompleteItems] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [isLodingPicture, setLoadingPicture] = useState(false);

    let hotItems = [];
    for (let item in hotItemsObj) {
        hotItems.push([item, hotItemsObj[item]]);
    }
    hotItems.sort((a, b) => b[1] - a[1]);
    hotItems = hotItems.slice(0, 7);

    const addCondition = (field, value) => {
        switch (field) {
            case 'xing': {
                if (!xing.includes(value)) {
                    xing.push(value);
                    setConditions([...conditions, ['xing', value]])
                }
                break;
            }
            case 'wei': {
                if (!wei.includes(value)) {
                    wei.push(value);
                    setConditions([...conditions, ['wei', value]])
                }
                break;
            }
            case 'guijing': {
                if (!guijing.includes(value)) {
                    guijing.push(value);
                    setConditions([...conditions, ['guijing', value]])
                }
                break;
            }
            case 'efficacy': {
                if (!efficacy.includes(value)) {
                    efficacy.push(value);
                    setConditions([...conditions, ['efficacy', value]])
                }
                break;
            }
            case 'origin': {
                if (!origin.includes(value)) {
                    origin.push(value);
                    setConditions([...conditions, ['origin', value]])
                }
                break;
            }
            default: break;
        }
    }

    const handleSearch = (_) => {
        const queryobj = {};
        const { value: name } = _name.current.input;
        if (name !== '') queryobj.name = name;
        if (xing.length) queryobj.xing = [...xing];
        if (wei.length) queryobj.wei = [...wei];
        if (guijing.length) queryobj.guijing = [...guijing];
        if (efficacy.length) queryobj.efficacy = [...efficacy];
        if (origin.length) queryobj.origin = [...origin];
        if (Object.keys(queryobj).length !== 0 && (!isEqual(prevQueryObj, queryobj) || pathname !== '/search')) {
            if (name !== '' && !recordItems.includes(name)) {
                recordItems.splice(0, 0, name);
                recordItems = recordItems.slice(0, 4);
                localStorage.setItem('records', JSON.stringify(recordItems));
            }
            if (name !== '') {
                if (!hotItemsObj[name]) hotItemsObj[name] = 1;
                else hotItemsObj[name]++;
                localStorage.setItem('hotItemsObj', JSON.stringify(hotItemsObj));
            }
            prevQueryObj = queryobj;
            const query = qs.stringify(queryobj);
            navigate(`/search?${query}`);
        }
    }

    const autoComplete = () => {
        if (isShow) {
            if (completeItems?.length && content !== '') {
                return (
                    <div className='autocomplete'>
                        <Divider className='divider' orientation="center" plain>猜你想搜</Divider>
                        <div className="lenovo">
                            {
                                completeItems.map((value, index) => {
                                    if (index < 10) return (
                                        <li key={index} className='autocomplete-item' onMouseDown={() => getItem('lenovo', index)}>
                                            <BulbOutlined key={index} />
                                            <span>{value.name}</span>
                                        </li>
                                    )
                                    return ''
                                })
                            }
                        </div>
                    </div>
                )

            } else {
                if (content === '') {
                    return (
                        <div className='autocomplete'>
                            <div className="history">
                                {
                                    recordItems.length ?
                                        <>
                                            <Divider className='divider' orientation="center" plain>搜索历史</Divider>
                                            {
                                                recordItems.map((value, index) => {
                                                    if (index < 4) return (
                                                        <li key={index} className='autocomplete-item' onMouseDown={() => getItem('record', index)}>
                                                            <ClockCircleOutlined key={index} />
                                                            <span>{value}</span>
                                                        </li>
                                                    )
                                                    return '';
                                                })
                                            }
                                        </> : ''
                                }
                            </div>
                            <div className='hot-search'>
                                <Divider className='divider' orientation="center" plain>大家都在搜</Divider>
                                {
                                    hotItems.map((item, index) => {
                                        const recordsLen = recordItems.length >= 4 ? 4 : recordItems.length;
                                        if (recordsLen + index < 10) return (
                                            <li key={index} className='autocomplete-item' onMouseDown={() => getItem('hot', index)}>
                                                <RiseOutlined />
                                                <span>{item[0]}</span>
                                                <span className='fire-num'>{item[1]}<FireOutlined style={{ color: 'red' }} /></span>
                                            </li>
                                        )
                                        return '';
                                    })
                                }
                            </div>
                        </div>)
                } else {
                    return <div className='autocomplete'><li className='no-data'>暂无数据</li></div>
                }
            }
        }
    }

    const getItem = (cate, idx) => {
        const queryobj = {};
        if (cate === 'record') {
            setContent(recordItems[idx]);
            queryobj.name = recordItems[idx];
        } else {
            if (cate === 'hot') {
                setContent(hotItems[idx][0])
                queryobj.name = hotItems[idx][0];
            } else {
                setContent(completeItems[idx].name);
                queryobj.name = completeItems[idx].name;
            }
            if (!recordItems.includes(queryobj.name)) {
                recordItems.splice(0, 0, queryobj.name);
                recordItems = recordItems.slice(0, 4);
                localStorage.setItem('records', JSON.stringify(recordItems));
            }
        }
        if (!hotItemsObj[queryobj.name]) hotItemsObj[queryobj.name] = 1;
        else hotItemsObj[queryobj.name]++;
        localStorage.setItem('hotItemsObj', JSON.stringify(hotItemsObj));
        closeAllTag();
        const query = qs.stringify(queryobj);
        navigate(`/search?${query}`);
        handleChange(queryobj.name);
    }

    const getName = (field) => {
        switch (field) {
            case 'xing': return '性';
            case 'wei': return '味';
            case 'guijing': return '归经';
            case 'efficacy': return '功效';
            case 'origin': return '产地';
            default: break;
        }
    }

    const closeTag = (item) => {
        switch (item[0]) {
            case 'xing': remove(xing, val => val === item[1]); break;
            case 'wei': remove(wei, val => val === item[1]); break;
            case 'guijing': remove(guijing, val => val === item[1]); break;
            case 'efficacy': remove(efficacy, val => val === item[1]); break;
            case 'origin': remove(origin, val => val === item[1]); break;
            default: break;
        }
        remove(conditions, pair => isEqual(pair, item));
        setConditions([...conditions]);
    }

    const closeAllTag = () => {
        xing = [];
        wei = [];
        guijing = [];
        efficacy = [];
        origin = [];
        setConditions([]);
    }

    const handleChange = (input) => {
        setContent(input)
        if (input !== '') {
            const query = {
                q: input,
                limit: 7,
                timestamp: Date.parse(new Date())
            }
            const target = '/autocomplete?' + qs.stringify(query);
            axios.get(target).then(res => {
                setCompleteItems(res.data.list)
            }).catch(err => console.log(err))
        } else {
            setCompleteItems([])
        }
    }
    const handlePicture = evt => {
        setLoadingPicture(true);
        const authProperty = {
            client_id: 'q1udr8AuvIrjW8m6xi0qLHXs',
            client_secret: 'dCN8ZZwBCfXSpixHWx4OG0mHTbQW0jcp',
            grant_type: 'client_credentials'
        }
        const reader = new FileReader();
        reader.readAsDataURL(evt.target.files[0]);

        reader.onload = e => {
            axios.post(`/token?${qs.stringify(authProperty)}`, {})
                .then(res => axios.post(`/plant?access_token=${res.data.access_token}`,
                    "image=" + encodeURIComponent(e.target.result.replace('data:image/webp;base64,', '')))
                ).then(res => {
                    if (res.data.result[0].name !== '非植物') {
                        setContent(res.data.result[0].name);
                        _name.current.input.value = res.data.result[0].name;
                        handleSearch();
                    }
                    setLoadingPicture(false)
                }).catch(err => console.log(err))
        }
    }

    return (
        <div className={`search-bar ${props.class}`} >
            <label className='logo'></label>
            <div className='input-area'>
                <div className='tag-container'>
                    {
                        conditions.map((item, index) =>
                            <span key={index} className='tag'>
                                {getName(item[0])}:{item[1]}
                                <CloseOutlined className='close-button' onClick={() => closeTag(item)} />
                            </span>
                        )
                    }
                </div>
                {
                    conditions.length !== 0 ? <CloseOutlined className='close-all' onClick={closeAllTag} /> : ''
                }
                <Tooltip title="识图">
                    <div className='shitu'>
                        {isLodingPicture ? <LoadingOutlined /> : <CameraOutlined className='cameralogo' />}
                        <input type="file" onChange={handlePicture} />
                    </div>
                </Tooltip>
                <Input type="text" name="name" size='large' autoComplete='off' ref={_name} value={content}
                    onChange={e => handleChange(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { _name.current.blur(); handleSearch() } }}
                    onFocus={() => setShow(true)}
                    onBlur={() => setShow(false)}
                />
                <Tooltip title="搜索">
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} size="large" onClick={handleSearch} />
                </Tooltip>
                {autoComplete()}
            </div>
            <div className='advanced'>
                <label>添加条件: </label>
                <Select className='select' value="性" style={{ width: 60 }} onSelect={value => addCondition('xing', value)} options={xings} />
                <Select className='select' value="味" style={{ width: 60 }} onSelect={value => addCondition('wei', value)} options={weis} />
                <Select className='select' value="归经" style={{ width: 80 }} onSelect={value => addCondition('guijing', value)} options={guijings} />
                <Select className='select' value="功效" style={{ width: 80 }} onSelect={value => addCondition('efficacy', value)} options={efficacies}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                <Select className='select' value="产地" style={{ width: 80 }} onSelect={value => addCondition('origin', value)} options={origins}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </div>
        </div>
    );
}