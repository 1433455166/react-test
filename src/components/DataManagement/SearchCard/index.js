import React, { useState } from "react";
import { Card, Input, Button } from 'antd'
import './index.css'
import { cocSearch } from "../../../serve"

const SearchCard = (props) => {
    const { setData, getQuary } = props
    const [searchValue, setSearchValue] = useState()

    const searchOnchange = (value, type) => {
        setSearchValue({
            ...searchValue,
            [type]: value
        })
    }

    const searchClick = async () => {
        const res = await cocSearch(searchValue)
        if (res?.success) {
            setData(res?.data?.docs);
        }
    }

    return (
        <Card style={{ marginBottom: 12 }}>
            <div className="card-content">
                <Input addonBefore="等级" value={searchValue?.label} onChange={(e) => searchOnchange(e.target.value, 'label')} style={{ width: 240 }} />
                <Input addonBefore="建筑" value={searchValue?.build} onChange={(e) => searchOnchange(e.target.value, 'build')} style={{ width: 240 }} />
                <Input addonBefore="建筑中文翻译" value={searchValue?.translate} onChange={(e) => searchOnchange(e.target.value, 'translate')} style={{ width: 240 }} />
                <Button onClick={searchClick}>查询</Button>
                <Button onClick={() => { setSearchValue(undefined); getQuary(); }}>重置</Button>
            </div>
        </Card>
    )
}

export default SearchCard