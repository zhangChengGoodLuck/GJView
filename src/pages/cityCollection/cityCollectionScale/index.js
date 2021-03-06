import React from 'react';
import { Select, Button, Input, Table } from 'antd';
import style from './index.module.scss'
import { dsgjgmPageQuery, dsgjExport, getDeptOptions } from '@/assets/js/api'
import dayjs from 'dayjs';

const { Option } = Select

class CityCollectionScale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            filter: {
                deptNo: '',
                keyword: '',
                regionId: ''
            },
            deptData: []
        }
    }

    componentDidMount() {
        this._dsgjgmPageQuery()
        getDeptOptions().then(({ data }) => {
            this.setState({ deptData: data })
        })
    }

    _dsgjgmPageQuery() {
        let { filter, pagination: { current: currentPage, pageSize } } = this.state
        dsgjgmPageQuery({ ...filter, currentPage, pageSize }).then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.pageTotal } })
        })
    }

    exportFile() {
        window.open(dsgjExport())
    }

    changeTable(pagination) {
        this.setState({ pagination }, () => {
            this._dsgjgmPageQuery()
        })
    }

    searchTable() {
        this.setState({ pagination: { ...this.state.pagination, ...{ current: 1 } } }, () => {
            this._dsgjgmPageQuery()
        })
    }

    changeAreaCode(code) {
        let { filter } = this.state
        this.setState({ filter: { ...filter, ...{ regionId: code } } })
    }

    changeSelectDept(code) {
        let { filter } = this.state
        this.setState({ filter: { ...filter, ...{ deptNo: code } } })
    }

    changeTableEname(e) {
        let { filter } = this.state
        this.setState({ filter: { ...filter, ...{ keyword: e.target.value } } })
    }

    render() {
        const { tableData, pagination, deptData } = this.state
        const columns = [
            {
                title: '??????',
                dataIndex: 'index',
                key: 'index',
                align: 'center',
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '????????????',
                dataIndex: 'region',
                key: 'region',
                align: 'center',
            },
            {
                title: '??????',
                dataIndex: 'deptName',
                key: 'deptName',
                align: 'center',
            },
            {
                title: '????????????',
                dataIndex: 'dataTotal',
                key: 'dataTotal',
                align: 'center',
                render: (text) => {
                    return text + '???'
                }
            },
            {
                title: '?????????',
                key: 'tableTotal',
                dataIndex: 'tableTotal',
                align: 'center',
                render: (text) => {
                    return text + '???'
                }
            },
            {
                title: '????????????',
                key: 'colTotal',
                dataIndex: 'colTotal',
                align: 'center',
                render: (text) => {
                    return text + '???'
                }
            },
            {
                title: '??????????????????',
                dataIndex: 'modifyDate',
                key: 'modifyDate',
                align: 'center',
                render: (record) => {
                    return record ? dayjs(record.modifyDate).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '?????????????????????',
                key: 'dataMatch',
                dataIndex: 'dataMatch',
                align: 'center'
            },
        ]
        return (
            <div className={style.overview}>
                <div className={style.filter}>
                    <div className={style.filterItem}>
                        <label>????????????: </label>
                        <Select placeholder='?????????????????????' style={{ width: 150 }} onChange={this.changeAreaCode.bind(this)}>
                            {
                                [{ name: '??????', value: 1 }, { name: '??????', value: 2 }].map(item => {
                                    return (
                                        <Option key={item.value} value={item.value}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className={style.filterItem}>
                        <label>????????????: </label>
                        <Select allowClear placeholder='?????????????????????' style={{ width: 150 }} onChange={this.changeSelectDept.bind(this)}>
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
                        <Input className={style.input} placeholder="?????????????????????" style={{ width: 200 }} onChange={this.changeTableEname.bind(this)}></Input>
                    </div>
                    <Button type='primary' style={{ marginLeft: 20, width: 120 }} onClick={this.searchTable.bind(this)}>??????</Button>
                    <Button style={{ float: 'right', marginLeft: 20, width: 80 }} onClick={this.exportFile.bind(this)}>??????</Button>
                </div>
                <Table className={style.tables} columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
            </div>
        );
    }
}

export default CityCollectionScale