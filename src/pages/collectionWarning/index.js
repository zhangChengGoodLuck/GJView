import React from 'react';
import { Tabs, Select, Button, Input, Table } from 'antd';
import style from './index.module.scss'
import { getDeptOptions, gjjsxPageQuery, gjjsxExport, kzltjPageQuery, kzltjExport, jhycPageQuery, getExceptionTypeOptions, jhycyjExport } from '@api'
import dayjs from 'dayjs'

const { TabPane } = Tabs;
const { Option } = Select

class CollectionWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptData: [],
            tableData: [],
            columns: [],
            exceptionTypes: [],
            loading: false,
            filter: {
                deptNo: '',
                tableName: '',
            },
            exceptionType: '',
            activeKey: 1,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        }
    }

    componentDidMount() {
        getDeptOptions().then(({ data }) => {
            this.setState({ deptData: data })
        })
        getExceptionTypeOptions().then(({ data }) => {
            this.setState({ exceptionTypes: data })
        })
        this.callback('1')
    }

    callback(key) {
        this.setState({ activeKey: key })
        if (key === '1') {
            this.setState({
                pagination: { ...this.state.pagination, ...{ current: 1 } },
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, record, index) => `${index + 1}`,
                    },
                    {
                        title: '所属区域',
                        dataIndex: 'region',
                        key: 'region',
                        align: 'center',
                    },
                    {
                        title: '部门',
                        dataIndex: 'deptName',
                        key: 'deptName',
                        align: 'center',
                    },
                    {
                        title: '表中文名称',
                        dataIndex: 'tableZhName',
                        key: 'tableZhName',
                        align: 'center',
                    },
                    {
                        title: '表英文名称',
                        dataIndex: 'tableEnName',
                        key: 'tableEnName',
                        align: 'center'
                    },
                    {
                        title: '更新频率',
                        dataIndex: 'updateFrequency',
                        key: 'updateFrequency',
                        align: 'center',
                    },
                    {
                        title: '最后更新时间',
                        key: 'lastUpdateTime',
                        dataIndex: 'lastUpdateTime',
                        align: 'center',
                        render: (text, record) => {
                            return record.lastUpdateTime ? dayjs(record.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') : ''
                        }
                    },
                    {
                        title: '是否按时更新',
                        key: 'updateFlag',
                        dataIndex: 'updateFlag',
                        align: 'center'
                    },
                ]
            }, () => {
                this._gjjsxPageQuery()
            })

        } else if (key === '2') {
            this.setState({
                pagination: { ...this.state.pagination, ...{ current: 1 } },
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, record, index) => `${index + 1}`,
                    },
                    {
                        title: '所属区域',
                        dataIndex: 'region',
                        key: 'region',
                        align: 'center',
                    },
                    {
                        title: '部门',
                        dataIndex: 'deptName',
                        key: 'deptName',
                        align: 'center',
                    },
                    {
                        title: '表中文名称',
                        dataIndex: 'tableZhName',
                        key: 'tableZhName',
                        align: 'center',
                    },
                    {
                        title: '表英文名称',
                        key: 'tableEnName',
                        dataIndex: 'tableEnName',
                        align: 'center'
                    },
                    {
                        title: '字段数量',
                        dataIndex: 'colTotal',
                        key: 'colTotal',
                        align: 'center',
                    },
                    {
                        title: '字段空值个数',
                        key: 'colNullValueTotal',
                        dataIndex: 'colNullValueTotal',
                        align: 'center'
                    },
                    {
                        title: '字段空值率',
                        key: 'colNullValueRate',
                        dataIndex: 'colNullValueRate',
                        align: 'center'
                    },
                ]
            }, () => {
                this._kzltjPageQuery()
            })
        } else if (key === '3') {
            this.setState({
                pagination: { ...this.state.pagination, ...{ current: 1 } },
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, record, index) => `${index + 1}`,
                    },
                    {
                        title: '所属区域',
                        dataIndex: 'region',
                        key: 'region',
                        align: 'center',
                    },
                    {
                        title: '部门',
                        dataIndex: 'deptName',
                        key: 'deptName',
                        align: 'center',
                    },
                    {
                        title: '表中文名称',
                        dataIndex: 'tableZhName',
                        key: 'tableZhName',
                        align: 'center',
                    },
                    {
                        title: '表英文名称',
                        key: 'tableEnName',
                        dataIndex: 'tableEnName',
                        align: 'center'
                    },
                    {
                        title: '业务名称',
                        dataIndex: 'bsName',
                        key: 'bsName',
                        align: 'center',
                    },
                    {
                        title: '异常类型',
                        key: 'exceptionType',
                        dataIndex: 'exceptionType',
                        align: 'center'
                    },
                    {
                        title: '待发送量',
                        key: 'todoTotal',
                        dataIndex: 'todoTotal',
                        align: 'center'
                    },
                    {
                        title: '预警时间',
                        key: 'warnTime',
                        dataIndex: 'warnTime',
                        align: 'center',
                        render: (record) => {
                            return record ? dayjs(record.warnTime).format('YYYY-MM-DD HH:mm:ss') : ''
                        }
                    }
                ]
            }, () => {
                this._jhycPageQuery()
            })
        }
    }

    _gjjsxPageQuery() {
        let { filter, pagination: { current: currentPage, pageSize } } = this.state
        this.setState({ loading: true, tableData: [] });
        gjjsxPageQuery({ ...filter, currentPage, pageSize }).then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.pageTotal } })
            this.setState({ loading: false });
        })
    }

    _jhycPageQuery() {
        let { filter, exceptionType, pagination: { current: currentPage, pageSize } } = this.state
        this.setState({ loading: true, tableData: [] });
        jhycPageQuery({ ...filter, exceptionType, currentPage, pageSize }).then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.pageTotal } })
            this.setState({ loading: false });
        })
    }

    _kzltjPageQuery() {
        let { filter, pagination: { current: currentPage, pageSize } } = this.state
        this.setState({ loading: true, tableData: [] });
        kzltjPageQuery({ tableName: filter.tableName, deptAbbr: filter.deptNo, currentPage, pageSize }).then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.pageTotal } })
            this.setState({ loading: false });
        })
    }

    changeTable(pagination) {
        let { activeKey } = this.state
        this.setState({ pagination }, () => {
            if (activeKey === "1") {
                this._gjjsxPageQuery()
            } else if (activeKey === "2") {
                this._kzltjPageQuery()
            } else if (activeKey === "3") {
                this._jhycPageQuery()
            }
        })
    }

    changeSelectDept(code) {
        let { filter } = this.state
        this.setState({ filter: { ...filter, ...{ deptNo: code } } })
    }

    changeTableEname(e) {
        let { filter } = this.state
        this.setState({ filter: { ...filter, ...{ tableName: e.target.value } } })
    }

    searchTable() {
        let { activeKey } = this.state
        this.setState({ pagination: { ...this.state.pagination, ...{ current: 1 } } }, () => {
            if (activeKey === '1') {
                this._gjjsxPageQuery()
            } else if (activeKey === '2') {
                this._kzltjPageQuery()
            } else if (activeKey === '3') {
                this._jhycPageQuery()
            }
        })
    }

    exportFile() {
        let { activeKey } = this.state
        if (activeKey === '1') {
            window.open(gjjsxExport())
        } else if (activeKey === '2') {
            window.open(kzltjExport())
        } else if (activeKey === '3') {
            window.open(jhycyjExport())
        }
    }

    changeSelectExceptionType(code) {
        this.setState({ exceptionType: code })
    }

    render() {
        const { deptData, tableData, pagination, columns, loading, exceptionTypes } = this.state

        return (
            <div className={style.tabsContainer}>
                <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} activeKey={this.state.activeKey}>
                    <TabPane tab="归集及时性清单" key="1">
                        <div className={style.filter}>
                            <div className={style.filterItem}>
                                <label>所属区域: </label>
                                <Select placeholder='请选择所属区域' style={{ width: 150 }}>
                                    {
                                        [{ name: '省级', value: 1 }, { name: '市级', value: 2 }].map(item => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <label>所属部门: </label>
                                <Select allowClear placeholder='请选择所属部门' style={{ width: 150 }} onChange={this.changeSelectDept.bind(this)}>
                                    {
                                        deptData.length && deptData.map(item => {
                                            return (
                                                <Option key={item.deptId} value={item.deptNo}>{item.deptName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <span>数据表: </span>
                                <Input className={style.input} placeholder="请输入中英文名称" style={{ width: 200 }} onChange={this.changeTableEname.bind(this)}></Input>
                            </div>
                            <Button type='primary' style={{ marginLeft: 20, width: 120 }} onClick={this.searchTable.bind(this)}>搜索</Button>
                            <Button style={{ float: 'right', marginLeft: 20, width: 80 }} onClick={this.exportFile.bind(this)}>导出</Button>
                        </div>
                        <Table className={style.tables} columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
                    </TabPane>
                    <TabPane tab="空值率统计清单" key="2">
                        <div className={style.filter}>
                            <div className={style.filterItem}>
                                <label>所属区域: </label>
                                <Select placeholder='请选择所属区域' style={{ width: 150 }}>
                                    {
                                        [{ name: '省级', value: 1 }, { name: '市级', value: 2 }].map(item => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <label>所属部门: </label>
                                <Select allowClear placeholder='请选择所属部门' style={{ width: 150 }} onChange={this.changeSelectDept.bind(this)}>
                                    {
                                        deptData.length && deptData.map(item => {
                                            return (
                                                <Option key={item.deptAbbr} value={item.deptAbbr}>{item.deptName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <span>数据表: </span>
                                <Input className={style.input} placeholder="请输入中英文名称" style={{ width: 200 }} onChange={this.changeTableEname.bind(this)}></Input>
                            </div>
                            <Button type='primary' style={{ marginLeft: 20, width: 120 }} onClick={this.searchTable.bind(this)}>搜索</Button>
                            <Button style={{ float: 'right', marginLeft: 20, width: 80 }} onClick={this.exportFile.bind(this)}>导出</Button>
                        </div>
                        <Table loading={loading} className={style.tables} columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
                    </TabPane>
                    <TabPane tab="交换异常预警清单" key="3">
                        <div className={style.filter}>
                            <div className={style.filterItem}>
                                <label>所属区域: </label>
                                <Select placeholder='请选择所属区域' style={{ width: 150 }}>
                                    {
                                        [{ name: '省级', value: 1 }, { name: '市级', value: 2 }].map(item => {
                                            return (
                                                <Option key={item.value} value={item.value}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <label>所属部门: </label>
                                <Select allowClear placeholder='请选择所属部门' style={{ width: 150 }} onChange={this.changeSelectDept.bind(this)}>
                                    {
                                        deptData.length && deptData.map(item => {
                                            return (
                                                <Option key={item.deptId} value={item.deptNo}>{item.deptName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <label>异常类型: </label>
                                <Select allowClear placeholder='请选择异常类型' style={{ width: 150 }} onChange={this.changeSelectExceptionType.bind(this)}>
                                    {
                                        exceptionTypes.length && exceptionTypes.map(item => {
                                            return (
                                                <Option key={item.type} value={item.type}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={style.filterItem}>
                                <span>数据表: </span>
                                <Input className={style.input} placeholder="请输入中英文名称" style={{ width: 200 }} onChange={this.changeTableEname.bind(this)}></Input>
                            </div>
                            <Button type='primary' style={{ marginLeft: 20, width: 120 }} onClick={this.searchTable.bind(this)}>搜索</Button>
                            <Button style={{ float: 'right', marginLeft: 20, width: 80 }} onClick={this.exportFile.bind(this)}>导出</Button>
                        </div>
                        <Table loading={loading} className={style.tables} columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default CollectionWarning;