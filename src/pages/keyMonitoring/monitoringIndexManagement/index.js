import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Input, Button, Table, Space, Select, message, Popconfirm } from 'antd';
import { getDeptOptions, zbFindByPage, getTableByDeptNo, zbTypeSave, zbTypeDetail, zbExportDownload, jkxmManagerDelete, zbTypelist } from '@api'
import style from './index.module.scss'
import { genID } from '@/assets/js/util'
import { PlusOutlined, ExportOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import MyDrawer from '@/components/base/drawer'

const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select

class MonitoringIndexManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectDefault: '',
            deptOptions: [],
            tableData: [],
            deptTables: [],
            indexName: '',
            indexDesc: '',
            currentRecordId: '',
            keyword: '',
            zbTypeArr: [],
            indexType: undefined,
            drawer: {
                visible: false,
                title: '',
                onClose: this.drawerClose
            },
            monitorTableFrom: [],
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

        zbTypelist().then(({ data }) => {
            this.setState({ zbTypeArr: data })
        })

        let { monitorTableFrom } = this.state
        monitorTableFrom.push({
            deptId: '',
            tableName: '',
            deptTables: [],
            id: genID()
        })
        this.setState({ monitorTableFrom })
        this._zbFindByPage()
    }

    drawerClose = () => {
        this.setDrawerVisible(false)
    }


    confirm({ id }) {
        jkxmManagerDelete({ id }).then(({ data: isDelete }) => {
            if (isDelete) {
                message.success(`项目已删除`);
                this.setDrawerVisible(false)
                this._zbFindByPage()
            }
        })
    }

    cancel() {

    }


    setDeptTables(item, deptNo) {
        getTableByDeptNo({ deptNo }).then(({ data }) => {
            item.deptTables = data
            item.deptId = deptNo
            this.setState({})
        })
    }

    setTablesValue(item, tableNo) {
        item.tableName = tableNo
        this.setState({})
    }

    _zbFindByPage() {
        let { current: currentPage, pageSize } = this.state.pagination
        let { keyword } = this.state
        zbFindByPage({ currentPage, pageSize, keyword }).then(({ data }) => {
            let { pageIndex, pageSize, total, list } = data
            this.setState({
                tableData: list,
                pagination: {
                    current: pageIndex,
                    pageSize,
                    total
                }
            })
        })
    }

    setindexName(e) {
        this.setState({ indexName: e.target.value })
    }

    setProjectDetail(e) {
        this.setState({ indexDesc: e.target.value })
    }

    cancalDrawer() {
        this.drawerClose()
    }

    submitAddOrUpdate() {
        let { indexDesc, indexName, indexType, currentRecordId } = this.state


        let params = {
            indexDesc,
            indexName,
            typeId: indexType
        }

        if (currentRecordId) {
            params.id = currentRecordId
        }
        zbTypeSave(params).then(({ data: isSave }) => {
            if (isSave) {
                message.success(`指标${currentRecordId ? '编辑' : '新增'}成功`);
                this.setDrawerVisible(false)
                this._zbFindByPage()
            }
        })
    }

    setDrawerVisible(bol) {
        let data = Object.assign(this.state.drawer, { visible: bol })
        this.setState({
            drawer: data
        })
    }


    editTableRecord({ id }) {
        this.currentRecordId = id
        zbTypeDetail({ id }).then(({ data }) => {
            this.setDrawerVisible(true)
            let drawer = Object.assign(this.state.drawer, { title: '编辑指标' })
            this.setState({
                drawer,
                indexDesc: data.indexDesc,
                indexName: data.indexName,
                indexType: data.typeId,
                currentRecordId: data.id
            }, () => {
                console.log(this.state);
            })


        })
    }

    removeMonitorTableFrom(data) {
        let { monitorTableFrom } = this.state
        monitorTableFrom = monitorTableFrom.filter(item => item.id !== data.id)
        this.setState({ monitorTableFrom })
    }

    addMonitorTableFrom() {
        let { monitorTableFrom } = this.state
        monitorTableFrom.push({
            deptId: '',
            tableName: '',
            deptTables: [],
            id: new Date().getTime()
        })
        this.setState({ monitorTableFrom })
    }


    handleChange(value) {
        console.log(`selected ${value}`);
    }

    changeIndexType(value) {
        this.setState({ indexType: value })
    }

    onSearch(value) {
        this.setState({ keyword: value }, () => {
            this._zbFindByPage()
        })
    }

    exportFile() {
        window.open(zbExportDownload({ keyword: this.state.keyword }))
    }

    addRecord() {
        this.setState({
            drawer: {
                visible: false,
                title: '',
                onClose: this.drawerClose
            },
            indexDesc: '',
            indexName: '',
            currentRecordId: '',
            indexType: ''
        }, () => {
            this.setDrawerVisible(true)
            let data = Object.assign(this.state.drawer, { title: '新增指标' })
            this.setState({ drawer: data })
        })
    }

    changeTable(params) {
        this.setState({ pagination: { ...this.state.pagination, ...params } }, () => {
            this._zbFindByPage()
        })
    }

    render() {
        const { tableData, drawer, indexName, indexDesc, indexType, pagination, zbTypeArr } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '指标名称',
                dataIndex: 'indexName',
                key: 'indexName',
                align: 'center',
            },
            {
                title: '指标类型',
                dataIndex: 'typeName',
                key: 'typeName',
                align: 'center',
            },
            {
                title: '指标描述',
                dataIndex: 'indexDesc',
                key: 'indexDesc',
                align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (text, record) => (
                    <Space className={style.tableTools} size="middle">
                        <FormOutlined className={style.edit} onClick={this.editTableRecord.bind(this, record)} />
                        <Popconfirm
                            title="是否删除该指标?"
                            onConfirm={this.confirm.bind(this, record)}
                            onCancel={this.cancel.bind(this)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <DeleteOutlined className={style.delete} />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        const addDrawerContent = (
            <div className={style.drawerContent}>
                <Input value={indexName} className={style.input} placeholder="请输入指标名称" onChange={this.setindexName.bind(this)} />
                <Select value={indexType ? indexType : undefined} placeholder='请选择指标类型' style={{ width: '100%', marginTop: 20 }} onChange={this.changeIndexType.bind(this)}>
                    {
                        zbTypeArr.length && zbTypeArr.map(item => {
                            return (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            )
                        })
                    }

                </Select>
                <TextArea value={indexDesc} className={style.textArea} onChange={this.setProjectDetail.bind(this)} placeholder="请输入指标描述..." autoSize={{ minRows: 4, maxRows: 6 }} />
            </div>
        )

        const head = (
            <div className={style.headBox}>
                <div className={style.left}>
                    <Search style={{ width: 230 }} placeholder="请输入指标名称" onSearch={this.onSearch.bind(this)} enterButton />
                    <Button sytle={{ marginLeft: 20 }} type="primary" className={style.add} icon={<PlusOutlined />} onClick={this.addRecord.bind(this)}>新增</Button>
                </div>
                <Button type="primary" className={style.export} icon={<ExportOutlined />} onClick={this.exportFile.bind(this)}>导出</Button>
            </div>
        )

        const content = (
            <Table columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
        )

        const footerNode = (
            <div className={style.footer}>
                <div className={style.btns}>
                    <Button type="primary" style={{ width: 100 }} onClick={this.submitAddOrUpdate.bind(this)}>确定</Button>
                    <Button style={{ width: 100 }} onClick={this.cancalDrawer.bind(this)} >取消</Button>
                </div>
            </div>
        )

        return (
            <div>
                <ComponentConetnt head={head} content={content}></ComponentConetnt>
                <MyDrawer footer={footerNode} content={addDrawerContent} {...drawer}></MyDrawer>
            </div>
        );
    }
}

export default MonitoringIndexManagement;