import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Input, Button, Table, Space, Select, message, Popconfirm, DatePicker } from 'antd';
import { zbAllList, getDeptOptions, jkrwFindByPage, projectListAll, getTableByDeptNo, taskSaveOrUpdate, taskDetail, jkrwTaskResult, jkrwStop, jkrwResumeJob, taskDelete } from '@api'
import style from './index.module.scss'
import { genID } from '@/assets/js/util'
import Moment from 'moment'
import { PlusOutlined, DeleteOutlined, FormOutlined, FileTextOutlined, CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import MyDrawer from '@/components/base/drawer'
import dayjs from 'dayjs'

const { Search } = Input;
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
            monitorIndex: undefined,
            projectDesc: '',
            currentRecordId: '',
            projectAll: [],
            keyword: '',
            monitorIndexList: [],
            taskForm: {
                id: undefined,
                name: '',
                project: '',
                monitorIndex: '',
                forceDate: '',
                cycle: ''
            },
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

        zbAllList().then(({ data }) => {
            this.setState({ monitorIndexList: data })
        })

        projectListAll().then(({ data }) => {
            this.setState({ projectAll: data })
        })

        let { monitorTableFrom } = this.state
        monitorTableFrom.push({
            deptId: '',
            tableName: '',
            deptTables: [],
            id: genID()
        })
        this.setState({ monitorTableFrom })
        this._jkrwFindByPage()
    }

    drawerClose = () => {
        this.setDrawerVisible(false)
    }


    confirm({ id }) {
        taskDelete({ id }).then(({ data: isDelete }) => {
            if (isDelete) {
                message.success(`???????????????`);
                this.setDrawerVisible(false)
                this._jkrwFindByPage()
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

    _jkrwFindByPage() {
        let { current: currentPage, pageSize } = this.state.pagination
        let { monitorIndex: indexId, keyword } = this.state
        jkrwFindByPage({ currentPage, pageSize, keyword, indexId }).then(({ data }) => {
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
        this.setState({
            taskForm: { ...this.state.taskForm, ...{ name: e.target.value } }
        })
    }

    setProjectDetail(e) {
        this.setState({ projectDesc: e.target.value })
    }

    cancalDrawer() {
        this.drawerClose()
    }

    submitAddOrUpdate() {
        let { name: taskName, project: projectId, monitorIndex: indexIds, forceDate: startTime, cycle: frequency, id } = this.state.taskForm
        let params = {
            taskName,
            projectId,
            indexIds,
            startTime,
            frequency
        }

        if (id) {
            params.id = id
        }

        taskSaveOrUpdate(params).then(({ data: isSuccess, message: msg }) => {
            if (isSuccess) {
                message.success(`??????${id ? '??????' : '??????'}??????`);
                this.setDrawerVisible(false)
                this._jkrwFindByPage()
            } else {
                message.warning(msg)
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
        taskDetail({ id }).then(({ data }) => {
            this.setDrawerVisible(true)
            let drawer = Object.assign(this.state.drawer, { title: '????????????' })

            this.setState({
                drawer,
                taskForm: {
                    id: id,
                    name: data.taskName,
                    project: data.projectId,
                    monitorIndex: data.indexIds,
                    forceDate: data.startCtime,
                    cycle: data.frequency
                }
            }, () => {
                console.log(this.state.taskForm);
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
        this.setState({ monitorIndex: value })
    }

    onSearch(value) {
        this.setState({ keyword: value }, () => {
            this._jkrwFindByPage()
        })
    }

    onTaskChange(date, dateString) {
        this.setState({ taskForm: { ...this.state.taskForm, ...{ forceDate: dateString } } })
    }

    onTaskTimeTotal(e) {
        this.setState({ taskForm: { ...this.state.taskForm, ...{ cycle: e.target.value } } })
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
            let data = Object.assign(this.state.drawer, { title: '??????????????????' })
            this.setState({ drawer: data })
        })
    }

    changeTable(params) {
        this.setState({ pagination: { ...this.state.pagination, ...params } }, () => {
            this._jkrwFindByPage()
        })
    }

    upCloud({ id }) {
        jkrwResumeJob({ id }).then(({ data: isSuccess }) => {
            if (isSuccess) {
                message.success('??????????????????')
                this._jkrwFindByPage()
            }
        })
    }

    downCloud({ id }) {
        jkrwStop({ id }).then(({ data: isSuccess }) => {
            if (isSuccess) {
                message.success('??????????????????')
                this._jkrwFindByPage()
            }
        })
    }

    downloadResult({ id }) {
        window.open(jkrwTaskResult({ id }))
    }

    render() {
        const { tableData, monitorIndexList, drawer, taskForm, pagination, projectAll } = this.state
        const columns = [
            {
                title: '??????',
                dataIndex: 'index',
                align: 'center',
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '????????????',
                dataIndex: 'taskName',
                key: 'taskName',
                align: 'center',
            },
            {
                title: '????????????',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (text, record) => {
                    return ['', '?????????', '?????????', '??????'][record.status]
                }
            },
            {
                title: '????????????',
                dataIndex: 'ctime',
                key: 'ctime',
                align: 'center',
                render: (text, record) => {
                    return dayjs(record.ctime).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            {
                title: '?????????????????????',
                dataIndex: 'lastRuntime',
                key: 'lastRuntime',
                align: 'center',
                render: (text, record) => {
                    return record.lastRuntime ? dayjs(record.lastRuntime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '????????????',
                align: 'center',
                render: (record) => {
                    return (<Button icon={<FileTextOutlined />} type="link" onClick={this.downloadResult.bind(this, record)}>
                        ????????????
                    </Button>)
                }
            },
            {
                title: '??????',
                key: 'action',
                align: 'center',
                render: (text, record) => (
                    <Space className={style.tableTools} size="middle">
                        {
                            [1, 3].includes(record.status) ? <CloudUploadOutlined onClick={this.upCloud.bind(this, record)} className={style.icloud} /> : <CloudDownloadOutlined onClick={this.downCloud.bind(this, record)} className={style.icloud} />
                        }
                        {
                            [1, 3].includes(record.status) && <FormOutlined className={style.edit} onClick={this.editTableRecord.bind(this, record)} />
                        }
                        {
                            [1, 3].includes(record.status) && <Popconfirm
                                title="??????????????????????"
                                onConfirm={this.confirm.bind(this, record)}
                                onCancel={this.cancel.bind(this)}
                                okText="??????"
                                cancelText="??????"
                            >
                                <DeleteOutlined className={style.delete} />
                            </Popconfirm>
                        }

                    </Space>
                ),
            },
        ];

        const addDrawerContent = (
            <div className={style.drawerContent}>
                <Input value={taskForm.name} className={style.input} placeholder="?????????????????????" onChange={this.setProjectName.bind(this)} />
                <Select onChange={(value) => this.setState({ taskForm: { ...taskForm, ...{ project: value } } })} placeholder='???????????????' value={taskForm.project || undefined} style={{ width: '100%', marginTop: 20 }}>
                    {
                        projectAll.length && projectAll.map(m => {
                            return (
                                <Option value={m.id}>{m.projectName}</Option>
                            )
                        })
                    }
                </Select>
                <Select onChange={(value) => this.setState({ taskForm: { ...taskForm, ...{ monitorIndex: value } } })} mode="multiple" allowClear placeholder='?????????????????????' value={taskForm.monitorIndex || undefined} style={{ width: '100%', marginTop: 20 }}>
                    {
                        monitorIndexList.length && monitorIndexList.map(m => {
                            return (
                                <Option value={m.id}>{m.indexName}</Option>
                            )
                        })
                    }
                </Select>
                <div className={style.monitorTable}>
                    <h4>????????????:</h4>
                    <DatePicker value={taskForm.forceDate ? Moment(taskForm.forceDate) : undefined} placeholder='?????????????????????' onChange={this.onTaskChange.bind(this)} style={{ width: '100%', marginTop: 10 }} />
                    <h4 style={{ marginTop: 20 }}>????????????:</h4>
                    <Input value={taskForm.cycle} addonAfter="??????" placeholder='?????????????????????' onChange={this.onTaskTimeTotal.bind(this)} style={{ width: '100%', marginTop: 10 }} />
                </div>
            </div>
        )

        const head = (
            <div className={style.headBox}>
                <div className={style.left}>
                    <Select placeholder='?????????????????????' style={{ width: 200 }} onChange={this.handleChange.bind(this)}>
                        {
                            monitorIndexList.length && monitorIndexList.map(m => {
                                return (
                                    <Option key={m.indexDesc} value={m.indexDesc}>{m.indexName}</Option>
                                )
                            })
                        }
                    </Select>
                    <Search style={{ marginLeft: 20, width: 230 }} placeholder="?????????????????????" onSearch={this.onSearch.bind(this)} enterButton />
                    <Button sytle={{ marginLeft: 20 }} type="primary" className={style.add} icon={<PlusOutlined />} onClick={this.addRecord.bind(this)}>??????</Button>
                </div>
            </div>
        )

        const content = (
            <Table columns={columns} dataSource={tableData} pagination={pagination} onChange={this.changeTable.bind(this)} />
        )

        const footerNode = (
            <div className={style.footer}>
                <div className={style.btns}>
                    <Button type="primary" style={{ width: 100 }} onClick={this.submitAddOrUpdate.bind(this)}>??????</Button>
                    <Button style={{ width: 100 }} onClick={this.cancalDrawer.bind(this)} >??????</Button>
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