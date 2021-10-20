import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Input, Button, Table, Space, Select, message, Popconfirm, DatePicker, Modal } from 'antd';
import { zbAllList, getDeptOptions, publishVerification, getVerificationResultList, projectListAll, getTableByDeptNo, taskSaveOrUpdate, taskDetail, jkrwTaskResult, stopPublish, deleteVerification } from '@api'
import style from './index.module.scss'
import { genID } from '@/assets/js/util'
import Moment from 'moment'
import { PlusOutlined, DeleteOutlined, FormOutlined, FileTextOutlined, CloudUploadOutlined, CloudDownloadOutlined, MinusSquareOutlined, PlusCircleOutlined } from '@ant-design/icons';
import MyDrawer from '@/components/base/drawer'
import ChildrenNode from './childrenNode'
import dayjs from 'dayjs'

const { Search } = Input;
const { Option } = Select

class VerificationResultFeedback extends React.Component {
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
            ruleType: 1,
            childrenForm: '',
            pickerType: 'year',
            id: genID()
        })


        this.setState({ monitorTableFrom, checkRuleList })
        this._getVerificationResultList()
    }

    drawerClose = () => {
        this.setDrawerVisible(false)
    }


    confirm({ id }) {
        deleteVerification({ id }).then(({ data: isDelete }) => {
            if (isDelete) {
                message.success(`项目已删除`);
                this.setDrawerVisible(false)
                this._getVerificationResultList()
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

    _getVerificationResultList() {
        let { current: currentPage, pageSize } = this.state.pagination
        let {  keyword } = this.state
        getVerificationResultList({ currentPage, pageSize, keyword }).then(({ data }) => {
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
                this._getVerificationResultList()
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
            this._getVerificationResultList()
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
            this._getVerificationResultList()
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
                this._getVerificationResultList()
            }
        })
    }

    downCloud({ id }) {
        stopPublish({ id }).then(({ data: isSuccess, message: msg }) => {
            if (isSuccess) {
                message.success('任务下线成功')
                this._getVerificationResultList()
            } else {
                message.warning(msg)
            }
        })
    }

    addCheckRule = () => {
        let { checkRuleList } = this.state
        checkRuleList.push({
            ruleType: 1,
            childrenForm: '',
            pickerType: 'year',
            id: genID()
        })
        this.setState({ checkRuleList })
    }

    downloadResult({ id }) {
        window.open(jkrwTaskResult({ id }))
    }

    getCheckChildrenTypeNode(currentData, typeId) {
        currentData.ruleType = typeId
        this.setState({})
    }

    removeFormItem(currentObj) {
        let { checkRuleList } = this.state
        this.setState({ checkRuleList: checkRuleList.filter(m => m.id !== currentObj.id) })
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
                title: '核查数据表',
                dataIndex: 'tableName',
                key: 'tableName',
                align: 'center',
            },
            {
                title: '核查部门',
                dataIndex: 'deptName',
                key: 'deptName',
                align: 'center',

            },
            {
                title: '核查时间',
                dataIndex: 'publishTime',
                key: 'publishTime',
                align: 'center',
                render: (text, record) => {
                    return record.publishTime ? dayjs(record.publishTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '核查方式',
                dataIndex: 'taskType',
                key: 'taskType',
                align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (text, record) => (
                    <Space className={style.tableTools} size="middle">
                        <Button type="link">查看核查明细</Button>
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
                <Input value={taskForm.name} className={style.input} placeholder="请输入数据表名称" onChange={this.setProjectName.bind(this)} />
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
                        <div className={style.title}>
                            <h4>核查规则</h4>
                            <PlusCircleOutlined className={style.add} onClick={this.addCheckRule} />
                        </div>
                        <div className={style.formRules}>
                            {
                                checkRuleList.length && checkRuleList.map((m, i) => {
                                    return (
                                        <div className={style.formItem} key={m.id}>
                                            <div className={style.index}>{i + 1}</div>
                                            <div className={style.content}>
                                                <Select defaultValue={m.ruleType} placeholder="请选择核查类型" style={{ width: '100%' }} onChange={this.getCheckChildrenTypeNode.bind(this, m)}>
                                                    {
                                                        taskTypes.map(t => {
                                                            return (
                                                                <Option value={t.value}>{t.name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                                <ChildrenNode key={m.id} typeId={m.ruleType}></ChildrenNode>
                                            </div>
                                            <div className={style.removeFormItem}>
                                                <MinusSquareOutlined onClick={this.removeFormItem.bind(this, m)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )

        const head = (
            <div className={style.headBox}>
                <div className={style.left}>
                    <Search style={{ marginLeft: 20, width: 230 }} placeholder="请输入数据表名称" onSearch={this.onSearch.bind(this)} enterButton />
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

export default VerificationResultFeedback;