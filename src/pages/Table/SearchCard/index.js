import React, { useState } from "react";
import { Card, Input, Button} from 'antd'
import './index.css'
import axios from "axios";
import { config } from "../../../common";

const SearchCard = (props) => {
    const { setData, getQuary } = props
    const [searchValue, setSearchValue] = useState()

    const searchOnchange = (value, type) => {
        setSearchValue({
            ...searchValue,
            [type]: value
        })
    }

    const searchClick = () => {
        axios
        .post(
          "/api/coc.search",
          JSON.stringify(searchValue),
          config
        )
        .then((res) => {
            setData(res?.data?.docs);
        })
        .catch((error) => {
          // 报错处理
          if (error.code === "ECONNABORTED") {
            console.error("请求超时！");
          } else if (error.response) {
            console.error("服务器错误:", error.response.data);
          } else if (error.request) {
            console.error("请求错误:", error.request);
          } else {
            console.error("未知错误:", error.message);
          }
        });
    }

    return (
        <Card style={{ marginBottom: 12 }}>
            <div className="card-content">
                <Input addonBefore="等级" value={searchValue?.label} onChange={(e) => searchOnchange(e.target.value, 'label')} style={{ width: 240 }} />
                <Input addonBefore="建筑" value={searchValue?.build} onChange={(e) => searchOnchange(e.target.value, 'build')} style={{ width: 240 }} />
                <Input addonBefore="建筑中文翻译" value={searchValue?.translate} onChange={(e) => searchOnchange(e.target.value, 'translate')} style={{ width: 240 }} />
                <Button onClick={searchClick}>查询</Button>
                <Button onClick={() => { setSearchValue(undefined); getQuary();}}>重置</Button>
            </div>
        </Card>
    )
}

export default SearchCard