/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, Input, Button } from 'antd'
import './index.css'
import { easySearch } from "../../../serve"
import { imgUrlAddFn } from '../../../utils/imgUrl';
import { address } from "../../../common/const"

const SearchCard = (props) => {
    const { setData, getQuary, tableColumnList, collection, searchType } = props
    const [searchValue, setSearchValue] = useState()

    const imgName = tableColumnList?.find((column) => column?.type === 'upload')?.dataIndex

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
            const searchList = res?.data?.docs || []
            setData(searchList.map((searchItem) => {
                return {
                    ...searchItem,
                    [imgName]: imgUrlAddFn(searchItem?.[imgName], address?.backend),
                }
            }));
        }
    }

    return (
        <Card style={{ marginBottom: 12 }}>
            <div className="card-content">
                {(tableColumnList || []).filter((tc) => searchType?.includes(tc?.dataIndex)).map((tableColumn) => {
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