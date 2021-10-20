import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Input, Button, Table, Space, Select, message, Popconfirm, DatePicker, Modal } from 'antd';
import { zbAllList, getDeptOptions, publishVerification, getVerificationList, projectListAll, getDateFormatList, getTableByDeptNo, taskSaveOrUpdate, taskDetail, jkrwTaskResult, stopPublish, deleteVerification } from '@api'
import style from './index.module.scss'
import { genID } from '@/assets/js/util'
import Moment from 'moment'
import { PlusOutlined, DeleteOutlined, FormOutlined, FileTextOutlined, CloudUploadOutlined, CloudDownloadOutlined, MinusSquareOutlined } from '@ant-design/icons';
import MyDrawer from '@/components/base/drawer'
import dayjs from 'dayjs'

const { Search } = Input;
const { Option } = Select
const { RangePicker } = DatePicker;


class VerificationTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptOptions: [],
            tableData: [],
            deptTables: [],
            deptTableOptions: [],
            projectName: '',
            monitorIndex: undefined,
            projectDesc: '',
            currentRecordId: '',
            projectAll: [],
            keyword: '',
            modal: {
                title: '',
                content: '',
                footer: '',
                visible: false,
                runTime: undefined,
                modalOk: () => {
                    this.setState({ modal: { ...this.state.modal, ...{ visible: false } } }, () => {
                        this._publishVerification()
                    })
                },
                modalCancel: () => {
                    this.setState({ modal: { ...this.state.modal, ...{ visible: false } } })
                }
            },
            monitorIndexList: [],
            taskForm: {
                id: undefined,
                name: '',
                deptId: '',
                tableId: '',
                forceDate: '',
                cycle: ''
            },
            drawer: {
                visible: false,
                title: '',
                onClose: this.drawerClose
            },

            checkRuleList: [],

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
            })

        })

        zbAllList().then(({ data }) => {
            this.setState({ monitorIndexList: data })
        })

        projectListAll().then(({ data }) => {
            this.setState({ projectAll: data })
        })

        let { monitorTableFrom, checkRuleList } = this.state



        monitorTableFrom.push({
            deptId: '',
            tableName: '',
            deptTables: [],
            id: genID()
        })

        checkRuleList.push({
            ruleType: undefined,
            childrenForm: '',
            pickerType: 'year'
        })


        this.setState({ monitorTableFrom, checkRuleList })
        this._getVerificationList()
    }

    drawerClose = () => {
        this.setDrawerVisible(false)
    }


    confirm({ id }) {
        deleteVerification({ id }).then(({ data: isDelete }) => {
            if (isDelete) {
                message.success(`项目已删除`);
                this.setDrawerVisible(false)
                this._getVerificationList()
            }
        })
    }

    cancel() {

    }


    setDeptTables(deptNo) {
        getTableByDeptNo({ deptNo }).then(({ data }) => {
            this.setState({ deptTableOptions: data })
        })
    }

    setTablesValue(item, tableNo) {
        item.tableName = tableNo
        this.setState({})
    }

    _getVerificationList() {
        let { current: currentPage, pageSize } = this.state.pagination
        let { monitorIndex: indexId, keyword } = this.state
        getVerificationList({ currentPage, pageSize, keyword, indexId }).then(({ data }) => {
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
                message.success(`项目${id ? '编辑' : '删除'}成功`);
                this.setDrawerVisible(false)
                this._getVerificationList()
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
            let drawer = Object.assign(this.state.drawer, { title: '编辑任务' })

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
            this._getVerificationList()
        })
    }

    onTaskRunTimeChange(date, dateString) {
        this.setState({ taskForm: { ...this.state.modal, ...{ runTime: dateString } } })
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
            let data = Object.assign(this.state.drawer, { title: '新增核查任务' })
            this.setState({ drawer: data })
        })
    }

    changeTable(params) {
        this.setState({ pagination: { ...this.state.pagination, ...params } }, () => {
            this._getVerificationList()
        })
    }

    upCloud({ id }) {
        this.setState({ currentRecordId: id, modal: { ...this.state.modal, ...{ visible: true, title: '设置发布运行时间', runTime: new Date() } } })
    }

    _publishVerification() {
        let { currentRecordId: id, modal: { runTime: publishTime } } = this.state
        publishVerification({ id, publishTime: dayjs(publishTime).format('YYYY-MM-DD HH:mm:ss') }).then(({ data: isSuccess }) => {
            if (isSuccess) {
                message.success('任务发布成功')
                this._getVerificationList()
            }
        })
    }

    downCloud({ id }) {
        stopPublish({ id }).then(({ data: isSuccess, message: msg }) => {
            if (isSuccess) {
                message.success('任务下线成功')
                this._getVerificationList()
            } else {
                message.warning(msg)
            }
        })
    }

    downloadResult({ id }) {
        window.open(jkrwTaskResult({ id }))
    }

    async getCheckChildrenTypeNode(currentObj, index, typeId) {
        let { data: dateFormatList } = await getDateFormatList()

        let startEndTime = []
        // let maxTime = undefined
        // let minTime = undefined

        let accuracy = [{   //核查精确度
            name: '按年',
            value: 1
        }, {
            name: '按月',
            value: 2
        }, {
            name: '按日',
            value: 3
        }]

        // let pickers = [null, <RangePicker picker="year" value={startEndTime} />, <RangePicker picker="month" value={startEndTime} />, <RangePicker value={startEndTime} />]

        const changePickerType = (val) => {
            let checkRuleList = this.state.checkRuleList.map((item, _index) => _index === index ? { ...item, pickerType: 'month' } : item)
            this.setState({
                checkRuleList
            })
        }

        const typeForms = [null,
            (<div className={style.formChildren}>
                <h5>规则定义</h5>
                <Select placeholder='请选择时间字段' style={{ width: '100%', marginTop: 10 }}>
                    {
                        <Option></Option>
                    }
                </Select>
                <Select placeholder='请选择时间格式' style={{ width: '100%', marginTop: 10 }}>
                    {
                        dateFormatList.length && dateFormatList.map(m => {
                            return (
                                <Option value={m.id}>{m.dateStyle}</Option>
                            )
                        })
                    }
                </Select>
                <h5>核查范围</h5>
                <Select placeholder='请选择核查精确度' style={{ width: '100%', marginTop: 10 }} onChange={changePickerType}>
                    {
                        accuracy.length && accuracy.map(m => {
                            return (
                                <Option value={m.value}>{m.name}</Option>
                            )
                        })
                    }
                </Select>
                {
                    currentObj.pickerType === 'month' ? <RangePicker picker='month'/> : <RangePicker picker='year'/>
                }
                
            </div>)
        ]

        currentObj.childrenForm = typeForms[typeId]

        this.setState({})
    }



    render() {
        const { tableData, deptOptions, drawer, taskForm, pagination, deptTableOptions, modal, checkRuleList } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '任务名称',
                dataIndex: 'taskName',
                key: 'taskName',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'ctime',
                key: 'ctime',
                align: 'center',
                render: (text, record) => {
                    return record.ctime ? dayjs(record.ctime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '发布运行时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
                align: 'center',
                render: (text, record) => {
                    return record.publishTime ? dayjs(record.publishTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '已完成时间',
                dataIndex: 'endTime',
                key: 'endTime',
                align: 'center',
                render: (text, record) => {
                    return record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '核查结果',
                align: 'center',
                render: (record) => {

                    return record.status === 3 ? (<Button icon={<FileTextOutlined />} type="link" onClick={this.downloadResult.bind(this, record)}>
                        核查结果
                    </Button>) : <span> {['', '待核查', '核查中', '核查结果', '已停止'][record.status]}</span>
                }
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (text, record) => (
                    <Space className={style.tableTools} size="middle">
                        {
                            [1, 3, 4].includes(record.status) ? <CloudUploadOutlined onClick={this.upCloud.bind(this, record)} className={style.icloud} /> : <CloudDownloadOutlined onClick={this.downCloud.bind(this, record)} className={style.icloud} />
                        }
                        {
                            [1, 4].includes(record.status) && <FormOutlined className={style.edit} onClick={this.editTableRecord.bind(this, record)} />
                        }
                        {
                            [1, 3, 4].includes(record.status) && <Popconfirm
                                title="是否删除该项目?"
                                onConfirm={this.confirm.bind(this, record)}
                                onCancel={this.cancel.bind(this)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <DeleteOutlined className={style.delete} />
                            </Popconfirm>
                        }

                    </Space>
                ),
            },
        ];

        const taskTypes = [{
            name: '最大最小核查',
            value: 1
        }, {
            name: '时间覆盖核查',
            value: 2
        }, {
            name: '区域覆盖核查',
            value: 3
        }, {
            name: '数据量核查',
            value: 4
        }]

        const addDrawerContent = (
            <div className={style.drawerContent}>
                <Input value={taskForm.name} className={style.input} placeholder="请输入任务名称" onChange={this.setProjectName.bind(this)} />
                <div style={{ display: 'inline-block' }}>
                    <Select placeholder='请选择部门' value={taskForm.deptId ? taskForm.deptId : undefined} style={{ width: 150, marginTop: 20 }} onChange={this.setDeptTables.bind(this)}>
                        {
                            deptOptions.length && deptOptions.map(option => {
                                return (
                                    <Option key={option.deptId} value={option.deptId} >{option.deptDesc}</Option>
                                )
                            })
                        }

                    </Select>
                </div>
                <div style={{ display: 'inline-block' }}>
                    <Select placeholder='请选择部门数据表' value={taskForm.tableId ? taskForm.tableId : undefined} style={{ width: '100%', marginTop: 20, marginLeft: 20 }} onChange={this.setTablesValue.bind(this)}>
                        {
                            deptTableOptions.length && deptTableOptions.map(option => {
                                return (
                                    <Option key={option.tableEName} value={option.tableEName}>{option.tableCName}</Option>
                                )
                            })
                        }

                    </Select>
                </div>
                <div className={style.monitorTable}>
                    <h4>数据目录溯源:</h4>
                    <div className={style.record}>
                        <div className={style.round}></div>
                        <div className={style.section}>
                            <label>时间范围:</label>
                            <span>2017年11月至今</span>
                        </div>
                    </div>
                    <div className={style.record}>
                        <div className={style.round}></div>
                        <div className={style.section}>
                            <label>区域范围:</label>
                            <span>全省</span>
                        </div>
                    </div>
                    <div className={style.record}>
                        <div className={style.round}></div>
                        <div className={style.section}>
                            <label>数据量</label>
                            <span>1万至1千万</span>
                        </div>
                    </div>
                    <div className={style.checkRules}>
                        <h4>核查规则</h4>
                        <div className={style.formRules}>
                            {
                                checkRuleList.length && checkRuleList.map((m, i) => {
                                    return (
                                        <div className={style.formItem}>
                                            <div className={style.index}>{i + 1}</div>
                                            <div className={style.content}>
                                                <Select placeholder="请选择核查类型" style={{ width: '100%' }} onChange={this.getCheckChildrenTypeNode.bind(this, m, i)}>
                                                    {
                                                        taskTypes.map(t => {
                                                            return (
                                                                <Option value={t.value}>{t.name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                                {m.childrenForm}
                                            </div>
                                            <MinusSquareOutlined />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* <DatePicker value={taskForm.forceDate ? Moment(taskForm.forceDate) : undefined} placeholder='请选择生效日期' onChange={this.onTaskRunTimeChange.bind(this)} style={{ width: '100%', marginTop: 10 }} />
                    <h4 style={{ marginTop: 20 }}>调度周期:</h4>
                    <Input value={taskForm.cycle} addonAfter="分钟" placeholder='请输入周期时长' onChange={this.onTaskTimeTotal.bind(this)} style={{ width: '100%', marginTop: 10 }} /> */}
                </div>
            </div>
        )

        const head = (
            <div className={style.headBox}>
                <div className={style.left}>

                    <Search style={{ marginLeft: 20, width: 230 }} placeholder="请输入任务名称" onSearch={this.onSearch.bind(this)} enterButton />
                    <Button sytle={{ marginLeft: 20 }} type="primary" className={style.add} icon={<PlusOutlined />} onClick={this.addRecord.bind(this)}>新增</Button>
                </div>
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
                <Modal centered title={modal.title} visible={modal.visible} onOk={modal.modalOk} onCancel={modal.modalCancel}>
                    <DatePicker showTime value={modal.runTime ? Moment(modal.runTime) : undefined} placeholder='请选择发布运行时间' onChange={this.onTaskRunTimeChange.bind(this)} style={{ width: '100%', marginTop: 10 }} />
                </Modal>
            </div>
        );
    }
}

export default VerificationTask;