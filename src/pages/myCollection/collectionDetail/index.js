import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Select, Input, Button, Table } from 'antd';
import { getDeptOptions, gkgjPageQuery } from '@api'
import style from './index.module.scss'
import { ExportOutlined } from '@ant-design/icons';


const { Option } = Select;
const { Search } = Input;


class CollectionScale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectDefault: '',
            deptOptions: [],
            tableData: [],
            search: '',
            depeId: '',
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        }
    }

    componentDidMount() {
        getDeptOptions().then(({ data }) => {
            this.setState({
                deptOptions: data,
                selectDefault: data[0].level
            })
        })
        this._gkgjPageQuery()
    }


    changeTable(pagination) {
        this.setState({ pagination }, () => {
            this._gkgjPageQuery()
        })
    }

    handleChange(value) {
        console.log(`selected ${value}`);
    }

    changeSearch(t) {
        this.setState({
            search: t.target.value
        })
    }

    onSearch() {
        this.setState({
            pagination: {
                current: 1
            }
        }, () => {
            this._gkgjPageQuery()
        })
    }

    _gkgjPageQuery() {
        let { current: currentPage, pageSize } = this.state.pagination
        let { depeId: deptName, search: tableName } = this.state
        let params = { deptName, tableName, currentPage, pageSize }

        if (!deptName && deptName !== 0) {
            delete params.deptName
        }
        if (!tableName) {
            delete params.tableName
        }

        gkgjPageQuery({ ...params }).then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.total } })
        })
    }


    render() {
        const { deptOptions, tableData, pagination } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                align: 'center'
            },
            {
                title: '部门',
                dataIndex: 'deptName',
                key: 'deptName',
                align: 'center'
            },
            {
                title: '表中文名称',
                dataIndex: 'tableZhName',
                key: 'tableZhName',
                align: 'center'
            },
            {
                title: '表英文名称',
                dataIndex: 'tableEnName',
                key: 'tableEnName',
                align: 'center'
            },
            {
                title: '归集总量',
                dataIndex: 'dataTotal',
                key: 'dataTotal',
                align: 'center'
            },
            {
                title: '归集字段数',
                dataIndex: 'colTotal',
                key: 'colTotal',
                align: 'center'
            },
            {
                title: '最后更新时间',
                dataIndex: 'lastUpdateTime',
                key: 'lastUpdateTime',
                align: 'center'
            },

        ];


        const head = (
            <div className={style.headBox}>
                <div className={style.left}>
                    <Select placeholder='请选择部门' style={{ width: 200 }} onChange={this.handleChange.bind(this)}>
                        {
                            deptOptions.length && deptOptions.map(m => {
                                return (
                                    <Option key={m.deptId} value={m.deptId}>{m.deptDesc}</Option>
                                )
                            })
                        }
                    </Select>
                    <Search style={{ width: 250, marginLeft: 30 }} placeholder="请输入中英文名称" onSearch={this.onSearch.bind(this)} onChange={this.changeSearch.bind(this)} enterButton />
                </div>
                <Button type="primary" className={style.export} icon={<ExportOutlined />}>导出</Button>
            </div>
        )

        const content = (
            <Table columns={columns} dataSource={tableData} showSizeChanger={false} pagination={pagination} onChange={this.changeTable.bind(this)} />
        )

        return (
            <div>
                <ComponentConetnt head={head} content={content}></ComponentConetnt>
            </div>
        );
    }
}

export default CollectionScale;