/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, Input, Button } from 'antd'
import './index.css'
import { easySearch } from "../../../serve"

const SearchCard = (props) => {
    const { setData, getQuary, tableColumnList, collection } = props
    const [searchValue, setSearchValue] = useState()

    const searchOnchange = (value, type) => {
        setSearchValue({
            ...searchValue,
            [type]: value
        })
    }

    const searchClick = async () => {
        const res = await easySearch({
            collection: collection,
            data: searchValue
        })
        if (res?.success) {
            setData(res?.data?.docs);
        }
    }

    return (
        <Card style={{ marginBottom: 12 }}>
            <div className="card-content">
                {(tableColumnList || []).map((tableColumn) => {
                    return (
                        <Input
                            addonBefore={tableColumn.title}
                            value={searchValue?.[tableColumn?.dataIndex]}
                            onChange={(e) => searchOnchange(e.target.value, tableColumn?.dataIndex)}
                            key={tableColumn?.dataIndex}
                            style={{ width: '30%', marginRight: 12 }}
                        />
                    )
                })}
                <div className="card-content-search">
                    <Button onClick={searchClick} style={{ marginRight: 12 }}>查询</Button>
                    <Button onClick={() => { setSearchValue(undefined); getQuary(); }}>重置</Button>
                </div>
            </div>
        </Card>
    )
}

export default SearchCard