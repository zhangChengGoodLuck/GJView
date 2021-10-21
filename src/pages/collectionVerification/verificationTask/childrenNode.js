import React, { Component } from 'react'
import { Input, Cascader, InputNumber, Select, DatePicker } from 'antd';
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
            definition: undefined, // 核查区域类型
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

    changePickerType(_data, code) {
        _data.definition = code
        this.setState({ pickerType: ['', 'year', 'month', ''][code], definition: code })
    }

    changeAreaPickerType = (_data, code) => {
        _data.definition = code
        this.setState({ isShowAreaPicker: false, definition: code })

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

    changeArea = (_data, val, selectOptions) => {
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
        debugger
        console.log(result);
        _data.area = result
        this.setState({})
    }

    onNumberChange(_data, type, num) {
        if (type === 'start') {
            _data.minNum = num
        } else {
            _data.maxNum = num
        }
        this.setState({})
    }



    setColumnName(_data, e) {
        _data.columnName = e.target.value
        this.setState({})
    }

    setDateFormatId(_data, id) {
        _data.dateFormatId = id
        this.setState({})
    }

    setDateField(_data, date, dateString) {
        _data.minTime = dateString[0]
        _data.maxTime = dateString[1]
        this.setState({})
    }

    setAreaRegular(_data, id) {
        _data.areaRegular = id
        this.setState({})
    }

    render() {
        const { _data, typeId = 1 } = this.props

        const { dateFormatList, pickerType, areaList, isShowAreaPicker } = this.state

        return (

            <div>
                {typeId === 1 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5>规则定义</h5>
                        <Input value={_data.columnName} placeholder='请输入时间字段' style={{ width: '100%', marginTop: 10 }} onChange={this.setColumnName.bind(this, _data)} />

                        <Select value={_data.dateFormatId} placeholder='请选择时间格式' style={{ width: '100%', marginTop: 10 }} onChange={this.setDateFormatId.bind(this, _data)}>
                            {
                                dateFormatList.length && dateFormatList.map(m => {
                                    return (
                                        <Option key={m.id} value={m.id}>{m.dateStyle}</Option>
                                    )
                                })
                            }
                        </Select>
                        <h5>核查范围</h5>
                        <Select value={_data.definition} placeholder='请选择核查精确度' style={{ width: '100%', marginTop: 10 }} onChange={this.changePickerType.bind(this, _data)}>
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
                                        <Option key={m.value} value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        <RangePicker value={[_data.minTime ? moment(_data.minTime) : '', _data.maxTime ? moment(_data.maxTime) : '']} placeholder={['请选择归集最小时间', '请选择归集最大时间']} style={{ width: '100%', marginTop: 10 }} picker={pickerType} onCalendarChange={this.setDateField.bind(this, _data)} />

                    </div>
                </div>}

                {typeId === 2 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5>规则定义</h5>
                        <Input value={_data.columnName} placeholder='请输入时间字段' style={{ width: '100%', marginTop: 10 }} onChange={this.setColumnName.bind(this, _data)} />

                        <Select value={_data.dateFormatId} placeholder='请选择时间格式' style={{ width: '100%', marginTop: 10 }} onChange={this.setDateFormatId.bind(this, _data)}>
                            {
                                dateFormatList.length && dateFormatList.map(m => {
                                    return (
                                        <Option key={m.id} value={m.id}>{m.dateStyle}</Option>
                                    )
                                })
                            }
                        </Select>
                        <h5>核查范围</h5>
                        <Select value={_data.definition} placeholder='请选择核查精确度' style={{ width: '100%', marginTop: 10 }} onChange={this.changePickerType.bind(this, _data)}>
                            {
                                [{   //核查精确度
                                    name: '按年',
                                    value: 1
                                }, {
                                    name: '按月',
                                    value: 2
                                }].map(m => {
                                    return (
                                        <Option key={m.value} value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        <RangePicker
                            value={[_data.minTime ? moment(_data.minTime) : '', _data.maxTime ? moment(_data.maxTime) : '']}
                            placeholder={['请选择时间覆盖区间', '请选择时间覆盖区间']}
                            style={{ width: '100%', marginTop: 10 }}
                            picker={pickerType}
                            onCalendarChange={this.setDateField.bind(this, _data)} />
                    </div>
                </div>}

                {typeId === 3 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5>规则定义</h5>
                        <Input value={_data.columnName} placeholder='请输入区域字段' style={{ width: '100%', marginTop: 10 }} onChange={this.setColumnName.bind(this, _data)} />

                        <Select value={_data.areaRegular} placeholder='请选择格式' style={{ width: '100%', marginTop: 10 }} onChange={this.setAreaRegular.bind(this, _data)}>
                            {
                                [{ name: '行政区划代码', value: 1 }, { name: '行政区划名称', value: 2 }].map(m => {
                                    return (
                                        <Option key={m.value} value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        <h5>核查范围</h5>
                        <Select value={_data.definition} placeholder='请选择核查区域' style={{ width: '100%', marginTop: 10 }} onChange={this.changeAreaPickerType.bind(this, _data)}>
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
                                        <Option key={m.value} value={m.value}>{m.name}</Option>
                                    )
                                })
                            }
                        </Select>
                        {
                            isShowAreaPicker && <Cascader
                                changeOnSelect
                                options={areaList}
                                placeholder="请选择区域"
                                multiple
                                defaultValue={_data.area}
                                onChange={this.changeArea.bind(this, _data)}
                                maxTagCount="responsive"
                                style={{ width: '100%', marginTop: 10 }}
                            />
                        }
                    </div>
                </div>}

                {typeId === 4 && <div className={styles.form}>
                    <div className={styles.formChildren}>
                        <h5 style={{ marginBottom: 10 }}>核查范围</h5>
                        <InputNumber value={_data.minNum} placeholder='请输入起始范围' min={1} onChange={this.onNumberChange.bind(this, _data, 'start')} style={{ width: '40%' }} />
                        -
                        <InputNumber value={_data.maxNum} placeholder='请输入结束范围' min={1} onChange={this.onNumberChange.bind(this, _data, 'end')} style={{ width: '40%' }} />
                    </div>
                </div>}
            </div>
        )
    }
}

export default ChildrenNode
