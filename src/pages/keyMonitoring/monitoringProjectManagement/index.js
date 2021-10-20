import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Input, Button, Table, Space, Select, message, Popconfirm } from 'antd';
import { getDeptOptions, jkxmFindByPage, getTableByDeptNo, jkxmManagerSave, jkxmManagerDetail, monitorProjectDownload, jkxmManagerDelete } from '@api'
import style from './index.module.scss'
import { genID } from '@/assets/js/util'
import { PlusOutlined, ExportOutlined, DeleteOutlined, PlusCircleOutlined, MinusSquareOutlined, FormOutlined } from '@ant-design/icons';
import MyDrawer from '@/components/base/drawer'

const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select

class MonitoringProjectManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectDefault: '',
            deptOptions: [],
            tableData: [],
            deptTables: [],
            projectName: '',
            projectDesc: '',
            currentRecordId: '',
            keyword: '',
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
        let { monitorTableFrom } = this.state
        monitorTableFrom.push({
            deptId: '',
            tableName: '',
            deptTables: [],
            id: genID()
        })
        this.setState({ monitorTableFrom })
        this._jkxmFindByPage()
    }

    drawerClose = () => {
        this.setDrawerVisible(false)
    }


    confirm({ id }) {
        jkxmManagerDelete({ id }).then(({ data: isDelete }) => {
            if (isDelete) {
                message.success(`项目已删除`);
                this.setDrawerVisible(false)
                this._jkxmFindByPage()
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

    _jkxmFindByPage() {
        let { current: currentPage, pageSize } = this.state.pagination
        let { keyword } = this.state
        jkxmFindByPage({ currentPage, pageSize, keyword }).then(({ data }) => {
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

    setProjectName(e) {
        this.setState({ projectName: e.target.value })
    }

    setProjectDetail(e) {
        this.setState({ projectDesc: e.target.value })
    }

    cancalDrawer() {
        this.drawerClose()
    }

    submitAddOrUpdate() {
        let { projectDesc, projectName, monitorTableFrom, currentRecordId } = this.state
        let tableList = monitorTableFrom.map(item => {
            return {
                deptNo: item.deptId,
                tableName: item.tableName
            }
        })

        let params = {
            projectDesc,
            projectName,
            tableList,
        }

        if (currentRecordId) {
            params.id = currentRecordId
        }
        jkxmManagerSave(params).then(({ data: isSave }) => {
            if (isSave) {
                message.success(`项目${currentRecordId ? '编辑' : '删除'}成功`);
                this.setDrawerVisible(false)
                this._jkxmFindByPage()
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
        jkxmManagerDetail({ id }).then(({ data }) => {
            this.setDrawerVisible(true)
            let monitorTableFrom = []
            let drawer = Object.assign(this.state.drawer, { title: '编辑项目' })
            data.tableList.forEach(async (item) => {
                let deptTables = []
                if (item.deptNo) {
                    let { data } = await getTableByDeptNo({ deptNo: item.deptNo })
                    deptTables = data
                }
                monitorTableFrom.push({
                    deptId: item.deptNo,
                    tableName: item.tableName,
                    deptTables: deptTables,
                    id: genID()
                })
                this.setState({ monitorTableFrom })
            })
            this.setState({
                drawer,
                projectDesc: data.projectDesc,
                projectName: data.projectName,
                currentRecordId: data.id
            }, () => {
                console.log(this.state.monitorTableFrom);
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

    onSearch(value) {
        this.setState({ keyword: value }, () => {
            this._jkxmFindByPage()
        })
    }

    exportFile() {
        window.open(monitorProjectDownload({ keyword: this.state.keyword }))
    }

    addRecord() {
        this.setState({
            drawer: {
                visible: false,
                title: '',
                onClose: this.drawerClose
            },
            projectDesc: '',
            projectName: '',
            currentRecordId: '',
            monitorTableFrom: [{
                deptId: '',
                tableName: '',
                deptTables: [],
                id: genID()
            }]
        }, () => {
            this.setDrawerVisible(true)
            let data = Object.assign(this.state.drawer, { title: '新增项目' })
            this.setState({ drawer: data })
        })
    }

    changeTable(params) {
        this.setState({ pagination: { ...this.state.pagination, ...params } }, () => {
            this._jkxmFindByPage()
        })
    }

    render() {
        const { tableData, monitorTableFrom, drawer, deptOptions, projectName, projectDesc, pagination } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                align: 'center',
            },
            {
                title: '项目描述',
                dataIndex: 'projectDesc',
                key: 'projectDesc',
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
                            title="是否删除该项目?"
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
                <Input value={projectName} className={style.input} placeholder="请输入项目名称" onChange={this.setProjectName.bind(this)} />
                <TextArea value={projectDesc} className={style.textArea} onChange={this.setProjectDetail.bind(this)} placeholder="请输入项目描述..." autoSize={{ minRows: 4, maxRows: 6 }} />
                <div className={style.monitorTable}>
                    <h4>可监控数据表</h4>
                    <div className={style.tableHead}>
                        <div>部门</div>
                        <div>数据表</div>
                        <div className={style.add}>
                            <PlusCircleOutlined onClick={this.addMonitorTableFrom.bind(this)} />
                        </div>
                    </div>
                    {
                        monitorTableFrom.length && monitorTableFrom.map(item => {
                            return (
                                <div className={style.tableItem} key={item.id}>
                                    <div>
                                        <Select placeholder='请选择部门' value={item.deptId ? item.deptId : undefined} style={{ width: 120 }} onChange={this.setDeptTables.bind(this, item)}>
                                            {
                                                deptOptions.length && deptOptions.map(option => {
                                                    return (
                                                        <Option key={option.deptId} value={option.deptId} >{option.deptDesc}</Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </div>
                                    <div>
                                        <Select placeholder='请选择部门数据表' value={item.tableName ? item.tableName : undefined} style={{ width: 150 }} onChange={this.setTablesValue.bind(this, item)}>
                                            {
                                                item.deptTables.length && item.deptTables.map(option => {
                                                    return (
                                                        <Option key={option.tableEName} value={option.tableEName}>{option.tableCName}</Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </div>
                                    <div className={style.delete}>
                                        <MinusSquareOutlined onClick={this.removeMonitorTableFrom.bind(this, item)} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )

        const head = (
            <div className={style.headBox}>
                <div className={style.left}>
                    <Search style={{ width: 230 }} placeholder="请输入项目名称" onSearch={this.onSearch.bind(this)} enterButton />
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

export default MonitoringProjectManagement;