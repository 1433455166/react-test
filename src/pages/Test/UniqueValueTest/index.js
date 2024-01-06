import React, { useState } from "react";
import { Input, InputNumber, Button } from "antd";
import moment from "moment";
import NavLeft from "../NavLeft";

const UniqueValueTest = () => {
    const randomValue = Math.random().toString().substring(2, 6)
    const numberIdValue = // Math.random() || 
        Number(Date.now() + Math.random().toString().substring(2, 6))
    const [time, setTime] = useState(Date.now())
    const [random, setRandom] = useState(Math.random())
    const [id, setId] = useState(`${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36).substring(0, 8)}`)
    const [numberId, setNumberId] = useState(numberIdValue)

    return (
        <div className="filter-wrap">
            <NavLeft />
            <div>
                <h1>唯一值测试 2821109907455</h1>
                <div>
                    <Input 
                        value={time}
                        onChange={(e) => {
                            setTime(Number(e?.target?.value))
                        }}
                        
                    />
                    <InputNumber 
                        // min={1} 
                        // max={10} 
                        value={time} 
                        onChange={(e) => {
                            console.log(/setTime(Number(e?.target?.value))/, e);
                            setTime(e)
                        }} 
                        style={{ width: 150 }}
                    />
                    <div>
                        toString(36): {time.toString(36)}
                    </div>
                    <div>
                        new Date(): {moment(2821109907455).format('YYYY-MM-DD HH:MM:SS')}
                    </div>
                    <div>
                        长度: {String(time).length}
                    </div>
                    <div>
                        length: {time.toString(36).length}
                    </div>
                    <div>
                        截取长度: {Date.now().toString(36).substring(0, 8)}
                    </div>
                    <div>
                        2022-12-22 00:00:00
                        1671638400000
                        lqgpnprk
                    </div>
                </div>
                <div>
                    <Input 
                        value={random}
                        onChange={(e) => {
                            setRandom(Number(e?.target?.value))
                        }}
                    />
                    <div>
                        toString(36): {random.toString(36)}
                    </div>
                    <div>
                        toString(36).substring(0, 8): {random.toString(36).substring(2)}
                    </div>
                    <div>
                    {String(random).substring(2)} length(13 ~ 19): {String(random).substring(2).length}
                    </div>
                    <div>
                        长度(9 ~ 12): {random.toString(36).substring(2).length}
                    </div>
                    <div>
                        截取长度: {random.toString(36).substring(2, 10)}
                    </div>
                </div>
                <div>
                    {id}
                    <Button
                        onClick={() => {
                            setId(`${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36).substring(0, 8)}`)
                        }}
                        type="link"
                    >
                        getId
                    </Button>
                </div>
                <div>
                    {/* {numberId}
                    <br />
                    {String(numberId).length}
                    <br /> */}
                    {numberId}
                    ||
                    {String(numberId).length}
                    <br />
                    {numberId.toString()}
                    ||
                    {numberId.toString().length}
                    <br />
                    {randomValue} || 
                    {String(randomValue).length}
                    <br />
                    {numberId.toString().substring(2)}
                    <br />
                    {numberId.toString().substring(2, 4)}
                    <br />
                    {Date.now()}
                    <Button
                        onClick={() => {
                            setNumberId(numberIdValue)
                        }}
                        type="link"
                    >
                        getId
                    </Button>
                </div>
            </div>
        </div>
    )
}

 

export default UniqueValueTest