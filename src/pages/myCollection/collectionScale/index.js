import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Select, Input, Button, Table } from 'antd';
import { getDeptLevelOptions, gjgmPageQuery, gjgmExport } from '@api'
import style from './index.module.scss'
import { ExportOutlined } from '@ant-design/icons';


const { Option } = Select;
const { Search } = Input;


class CollectionScale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectDefault: '',
            scaleOptions: [],
            tableData: [],
            scaleId: '',
            search: '',
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        }
    }

    componentDidMount() {
        getDeptLevelOptions().then(({ data }) => {
            this.setState({
                scaleOptions: data,
                selectDefault: data[0].level
            })
        })
        this._gjgmPageQuery()
    }


    exportFile() {
        let { search, scaleId } = this.state
        window.open(gjgmExport({ deptLevel: scaleId, deptName: search }))
    }


    changeTable(pagination) {
        this.setState({ pagination }, () => {
            this._gjgmPageQuery()
        })
    }

    handleChange(value) {
        this.setState({ scaleId: value })
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
            this._gjgmPageQuery()
        })
    }

    _gjgmPageQuery() {
        let { current: currentPage, pageSize } = this.state.pagination
        let { scaleId: deptLevel, search: deptName } = this.state
        let params = { deptLevel, deptName, currentPage, pageSize }
        if (!deptLevel && deptLevel !== 0) {
            delete params.deptLevel
        }
        if (!deptName) {
            delete params.deptName
        }
        gjgmPageQuery({ ...params }).then(({ data }) => {
            this.setState({ tableData: data.list, pagination: { current: data.pageIndex, pageSize: data.pageSize, total: data.total } })
        })
    }


    render() {
        const { scaleOptions, tableData, pagination } = this.state
        const columns = [
            {
                title: '??????',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'deptName',
                key: 'deptName',
                align: 'center'
            },
            {
                title: '??????????????????',
                dataIndex: 'dataTotal',
                key: 'dataTotal',
                align: 'center'
            },
            {
                title: '???????????????',
                dataIndex: 'tableTotal',
                key: 'tableTotal',
                align: 'center'
            },
            {
                title: '??????????????????',
                dataIndex: 'colTotal',
                key: 'colTotal',
                align: 'center'
            },
            {
                title: '??????????????????',
                dataIndex: 'lastUpdateTime',
                key: 'lastUpdateTime',
                align: 'center'
            },
        ];


        const head = (
            <div className={style.headBox}>
                <div className={style.left}>
                    <Select placeholder='???????????????' style={{ width: 150 }} onChange={this.handleChange.bind(this)}>
                        {
                            scaleOptions.length && scaleOptions.map(m => {
                                return (
                                    <Option key={m.level} value={m.level}>{m.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <Search style={{ width: 230, marginLeft: 30 }} placeholder="?????????????????????" onSearch={this.onSearch.bind(this)} onChange={this.changeSearch.bind(this)} enterButton />
                </div>
                <Button type="primary" className={style.export} icon={<ExportOutlined />} onClick={this.exportFile.bind(this)}>??????</Button>
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