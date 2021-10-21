import React from 'react';
import { Button, Table } from 'antd';
import style from './index.module.scss'
import { dsgjPageQuery, dsgjExport } from '@/assets/js/api'
import dayjs from 'dayjs';

class CityCollectionOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        }
    }

    componentDidMount() {
        this._dsgjPageQuery()
    }

    _dsgjPageQuery() {
        dsgjPageQuery().then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.pageTotal } })
        })
    }

    exportFile() {
        window.open(dsgjExport())
    }

    changeTable(pagination) {
        this.setState({ pagination }, () => {
            this._dsgjPageQuery()
        })
    }

    render() {
        const { tableData, pagination } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                align: 'center',
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '所属区域',
                dataIndex: 'regionName',
                key: 'regionName',
                align: 'center',
            },
            {
                title: '数据规模',
                dataIndex: 'dataTotal',
                key: 'dataTotal',
                align: 'center',
                render: (text) => {
                    return text + '条'
                }
            },
            {
                title: '表规模',
                dataIndex: 'tableTotal',
                key: 'tableTotal',
                align: 'center',
                render: (text) => {
                    return text + '张'
                }
            },
            {
                title: '字段规模',
                key: 'colTotal',
                dataIndex: 'colTotal',
                align: 'center',
                render: (text) => {
                    return text + '个'
                }
            },
            {
                title: '统计日期',
                dataIndex: 'lastUpdateTime',
                key: 'lastUpdateTime',
                align: 'center',
                render: (record) => {
                    return record ? dayjs(record.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
        ]
        return (
            <div className={style.overview}>
                <div className={style.filter}>
                    <Button style={{ float: 'right', marginLeft: 20, width: 80 }} onClick={this.exportFile.bind(this)}>导出</Button>
                </div>
                <Table className={style.tables} columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
            </div>
        );
    }
}

export default CityCollectionOverview