import React, { Component } from 'react'
import { Input, Cascader, Button, Table, InputNumber, Select, message, DatePicker } from 'antd';
import { getDateFormatList, getDivisions } from '@api'
import styles from './childrenNode.module.scss'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker;

export class ChildrenNode extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dateFormatList: [],
            areaList: [],
            isShowAreaPicker: false,
            pickerType: '',
            selectAllAreas: [],
            area: [], //核查区域代码
            areaType: undefined, // 核查区域类型
            areaRegular: undefined,  //核查区域格式
            columnName: undefined, //时间、区域查询必填：字段名称
            dateFormatId: undefined,  //时间查询必填：时间格式id
            definitio: undefined, //时间、区域查询必填：时间精确度（1-年，2-月，3-日）；区域精确度（11-省本级，12-省市县，13-省市，14-制定区域）
            maxNum: 0, //数据核查必填：最大值（数据量核查）	
            maxTime: 0,	//时间核查必填：归集最大时间（时间核查）
            minNum: 0, //数据核查必填：最小值（数据量核查）	
            minTime: 0, //时间核查必填：归集最小时间（时间核查）	
            taskType: undefined, //任务类型（1-时间核查｜最大最小核查；2-时间核查｜时间覆盖核查；3-空间核查｜区域覆盖核查；4-数据量核查）	
        }
    }

    componentDidMount() {
        getDateFormatList().then(({ data }) => {
            this.setState({ dateFormatList: data })
        })
        getDivisions().then(({ data }) => {
            let areaList = this.formatAreaList(data)
            this.setState({ areaList })
        })
    }


    formatAreaList(data) {
        if (data && Array.isArray(data)) {
            return data.map(m => {
                return {
                    label: m.adName,
                    value: m.adNo,
                    children: this.formatAreaList(m.children)
                }
            })
        }
        return []
    }

    changePickerType = (code) => {
        this.setState({ pickerType: ['', 'year', 'month', ''][code], definition: code })
    }

    changeAreaPickerType = (code) => {
        this.setState({ isShowAreaPicker: false, areaType: code })

        if (code === 14) {
            this.setState({ isShowAreaPicker: true })
        }
    }

    getAllAreaSelect = (data, result = []) => {
        if (data && Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                const m = data[i];
                result.push(m.value)
                if (m.children.length) {
                    this.getAllAreaSelect(m.children, result)
                }

            }
        }
        return []
    }

    changeArea = (val, selectOptions) => {
        let result = []
        for (let i = 0; i < selectOptions.length; i++) {
            const node = selectOptions[i];
            let data = node[node.length - 1]
            if (data.children.length) {
                this.getAllAreaSelect([data], result)
            } else {
                result.push(data.value)
            }
        }

        console.log(result);
    }

    onNumberChange() {

    }

    render() {
        const { typeId = 1 } = this.props
        const { dateFormatList, pickerType, areaList, isShowAreaPicker, columnName, dateFormatId, definition, minTime, maxTime, areaRegular, areaType, area,minNum, maxNum } = this.state

        return (

            <div>
                {typeId === 1 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5>规则定义</h5>
                        <Input value={columnName} placeholder='请输入时间字段' style={{ width: '100%', marginTop: 10 }} onChange={(e) => this.setState({ columnName: e.target.value })} />

                        <Select value={dateFormatId} placeholder='请选择时间格式' style={{ width: '100%', marginTop: 10 }} onChange={(val) => this.setState({ dateFormatId: val })}>
                            {
                                dateFormatList.length && dateFormatList.map(m => {
                                    return (
                                        <Option value={m.id}>{m.dateStyle}</Option>
                                    )
                                })
                            }
                        </Select>
                        <h5>核查范围</h5>
                        <Select value={definition} placeholder='请选择核查精确度' style={{ width: '100%', marginTop: 10 }} onChange={this.changePickerType}>
                            {
                                [{   //核查精确度
                                    name: '按年',
                                    value: 1
                                }, {
                                    name: '按月',
                                    value: 2
                                }, {
                                    name: '按日',
                                    value: 3
                                }].map(m => {
                                    return (
                                        <Option value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        <RangePicker value={[moment(minTime), moment(maxTime)]} placeholder={['请选择归集最小时间', '请选择归集最大时间']} style={{ width: '100%', marginTop: 10 }} picker={pickerType} />

                    </div>
                </div>}

                {typeId === 2 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5>规则定义</h5>
                        <Input value={columnName} placeholder='请输入时间字段' style={{ width: '100%', marginTop: 10 }} onChange={(e) => this.setState({ columnName: e.target.value })} />

                        <Select value={dateFormatId} placeholder='请选择时间格式' style={{ width: '100%', marginTop: 10 }} onChange={(val) => this.setState({ dateFormatId: val })}>
                            {
                                dateFormatList.length && dateFormatList.map(m => {
                                    return (
                                        <Option value={m.id}>{m.dateStyle}</Option>
                                    )
                                })
                            }
                        </Select>
                        <h5>核查范围</h5>
                        <Select value={definition} placeholder='请选择核查精确度' style={{ width: '100%', marginTop: 10 }} onChange={this.changePickerType}>
                            {
                                [{   //核查精确度
                                    name: '按年',
                                    value: 1
                                }, {
                                    name: '按月',
                                    value: 2
                                }].map(m => {
                                    return (
                                        <Option value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        <RangePicker value={[moment(minTime), moment(maxTime)]} placeholder={['请选择时间覆盖区间', '请选择时间覆盖区间']} style={{ width: '100%', marginTop: 10 }} picker={pickerType} />

                    </div>
                </div>}

                {typeId === 3 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5>规则定义</h5>
                        <Input value={columnName} placeholder='请输入区域字段' style={{ width: '100%', marginTop: 10 }} onChange={(e) => this.setState({ columnName: e.target.value })} />

                        <Select value={areaRegular} placeholder='请选择格式' style={{ width: '100%', marginTop: 10 }} onChange={(val) => this.setState({ areaRegular: val })}>
                            {
                                [{ name: '行政区划代码', value: 1 }, { name: '行政区划名称', value: 2 }].map(m => {
                                    return (
                                        <Option value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        <h5>核查范围</h5>
                        <Select value={areaType} placeholder='请选择核查区域' style={{ width: '100%', marginTop: 10 }} onChange={this.changeAreaPickerType}>
                            {
                                [{   //核查精确度
                                    name: '省本级',
                                    value: 11
                                }, {
                                    name: '省市县',
                                    value: 12
                                }, {
                                    name: '省市',
                                    value: 13
                                }, {
                                    name: '指定区域',
                                    value: 14
                                }].map(m => {
                                    return (
                                        <Option value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        {
                            isShowAreaPicker && <Cascader
                                options={areaList}
                                placeholder="请选择区域"
                                multiple
                                defaultValue={area}
                                onChange={this.changeArea}
                                maxTagCount="responsive"
                                style={{ width: '100%', marginTop: 10 }}
                            />
                        }
                    </div>
                </div>}

                {typeId === 4 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5 style={{ marginBottom: 10 }}>核查范围</h5>
                        <InputNumber value={minNum} placeholder='请输入起始范围' min={1} onChange={this.onNumberChange} style={{ width: '40%' }} /> - <InputNumber value={maxNum} placeholder='请输入结束范围' min={1} onChange={this.onNumberChange} style={{ width: '40%' }} />
                    </div>
                </div>}
            </div>
        )
    }
}

export default ChildrenNode
