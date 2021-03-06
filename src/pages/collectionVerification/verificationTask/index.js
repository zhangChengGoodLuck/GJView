import React from 'react';
import ComponentConetnt from '@/components/bus/content'
import { Input, Button, Table, Space, Select, message, Popconfirm, DatePicker, Modal } from 'antd';
import { zbAllList, getDeptOptions, publishVerification, getVerificationList, projectListAll, getTableByDeptNo, addVerification, getVerificationInfo, jkrwTaskResult, stopPublish, deleteVerification, updateVerification } from '@api'
import style from './index.module.scss'
import { genID } from '@/assets/js/util'
import Moment from 'moment'
import { PlusOutlined, DeleteOutlined, FormOutlined, FileTextOutlined, CloudUploadOutlined, CloudDownloadOutlined, MinusSquareOutlined, PlusCircleOutlined } from '@ant-design/icons';
import MyDrawer from '@/components/base/drawer'
import ChildrenNode from './childrenNode'
import dayjs from 'dayjs'

const { Search } = Input;
const { Option } = Select

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
            customForm: {
                taskType: undefined,
                columnName: undefined,
                dateFormatId: undefined,
                definition: undefined,
                minTime: undefined,
                maxTime: undefined,
                areaRegular: undefined,
                areaType: undefined,
                area: undefined,
                minNum: undefined,
                maxNum: undefined
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
            },
            checkRuleList: [],
            taskForm: {
                id: undefined,
                name: '',
                deptId: '',
                tableId: '',
            },
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

        checkRuleList.push({ ...this.state.customForm, id: genID() })

        this.setState({ monitorTableFrom, checkRuleList })
        this._getVerificationList()
    }

    drawerClose = () => {
        this.setDrawerVisible(false)
    }


    confirm({ id }) {
        deleteVerification({ id }).then(({ data: isDelete }) => {
            if (isDelete) {
                message.success(`???????????????`);
                this.setDrawerVisible(false)
                this._getVerificationList()
            }
        })
    }

    cancel() {

    }


    setDeptTables(deptNo) {
        let { taskForm } = this.state
        getTableByDeptNo({ deptNo }).then(({ data }) => {
            this.setState({ deptTableOptions: data, taskForm: { ...taskForm, ...{ deptId: deptNo } } })
        })
    }

    setTablesValue(tableNo) {
        let { taskForm } = this.state
        this.setState({ taskForm: { ...taskForm, ...{ tableId: tableNo } } })
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

        let { checkRuleList, taskForm: { name: taskName, tableId, id } } = this.state

        const fields = [
            ['columnName', 'dateFormatId', 'definition', 'minTime', 'maxTime', 'taskType'],
            ['columnName', 'dateFormatId', 'definition', 'minTime', 'maxTime', 'taskType'],
            ['columnName', 'areaRegular', 'definition', 'area', 'taskType'],
            ['minNum', 'maxNum', 'taskType']
        ]
        let result = []
        checkRuleList.forEach(item => {
            let obj = {}
            fields[item.taskType - 1].forEach(key => {
                obj[key] = item[key]
            })
            result.push(obj)
        })

        let params = {
            tableId,
            taskName,
            taskList: [...result]
        }

        if (id) {
            params.id = id
            updateVerification(params).then(({ data: isSuccess, message: msg }) => {
                if (isSuccess) {
                    message.success(`??????????????????`);
                    this.setDrawerVisible(false)
                    this._getVerificationList()
                } else {
                    message.warning(msg)
                }
            })
        } else {
            addVerification(params).then(({ data: isSuccess, message: msg }) => {
                if (isSuccess) {
                    message.success(`??????????????????`);
                    this.setDrawerVisible(false)
                    this._getVerificationList()
                } else {
                    message.warning(msg)
                }
            })
        }
    }

    setDrawerVisible(bol) {
        let data = Object.assign(this.state.drawer, { visible: bol })
        this.setState({
            drawer: data
        })
    }


    editTableRecord({ id }) {
        getVerificationInfo({ id }).then(({ data }) => {
            this.setDrawerVisible(true)
            let drawer = Object.assign(this.state.drawer, { title: '????????????' })
            getTableByDeptNo({ deptNo: data.deptNo }).then(({ data: tables }) => {
                this.setState({ deptTableOptions: tables })
            })
            this.setState({
                drawer,
                checkRuleList: data.taskList.map(m => {
                    return {
                        ...m,
                        id: genID()
                    }
                }),
                taskForm: {
                    id: data.id,
                    name: data.taskName,
                    deptId: data.deptNo,
                    tableId: data.tableId,
                }
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

    addRecord() {                
        this.setState({
            taskForm: {
                id: undefined,
                name: '',
                deptId: '',
                tableId: '',
            },
            checkRuleList: [{ ...this.state.customForm, id: genID() }]
        }, () => {
            this.setDrawerVisible(true)
            let data = Object.assign(this.state.drawer, { visible: true, title: '??????????????????' })
            this.setState({ drawer: data })
        })
    }

    changeTable(params) {
        this.setState({ pagination: { ...this.state.pagination, ...params } }, () => {
            this._getVerificationList()
        })
    }

    upCloud({ id }) {
        this.setState({ currentRecordId: id, modal: { ...this.state.modal, ...{ visible: true, title: '????????????????????????', runTime: new Date() } } })
    }

    _publishVerification() {
        let { currentRecordId: id, modal: { runTime: publishTime } } = this.state
        publishVerification({ id, publishTime: dayjs(publishTime).format('YYYY-MM-DD HH:mm:ss') }).then(({ data: isSuccess }) => {
            if (isSuccess) {
                message.success('??????????????????')
                this._getVerificationList()
            }
        })
    }

    downCloud({ id }) {
        stopPublish({ id }).then(({ data: isSuccess, message: msg }) => {
            if (isSuccess) {
                message.success('??????????????????')
                this._getVerificationList()
            } else {
                message.warning(msg)
            }
        })
    }

    addCheckRule = () => {
        let { checkRuleList } = this.state
        checkRuleList.push({ ...this.state.customForm, id: genID() })
        this.setState({ checkRuleList })
    }

    downloadResult({ id }) {
        window.open(jkrwTaskResult({ id }))
    }

    getCheckChildrenTypeNode(currentData, typeId) {

        currentData.taskType = typeId

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
                dataIndex: 'ctime',
                key: 'ctime',
                align: 'center',
                render: (text, record) => {
                    return record.ctime ? dayjs(record.ctime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '??????????????????',
                dataIndex: 'publishTime',
                key: 'publishTime',
                align: 'center',
                render: (text, record) => {
                    return record.publishTime ? dayjs(record.publishTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '???????????????',
                dataIndex: 'endTime',
                key: 'endTime',
                align: 'center',
                render: (text, record) => {
                    return record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            },
            {
                title: '????????????',
                align: 'center',
                render: (record) => {

                    return record.status === 3 ? (<Button icon={<FileTextOutlined />} type="link" onClick={this.downloadResult.bind(this, record)}>
                        ????????????
                    </Button>) : <span> {['', '?????????', '?????????', '????????????', '?????????'][record.status]}</span>
                }
            },
            {
                title: '??????',
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

        const taskTypes = [{
            name: '??????????????????',
            value: 1
        }, {
            name: '??????????????????',
            value: 2
        }, {
            name: '??????????????????',
            value: 3
        }, {
            name: '???????????????',
            value: 4
        }]

        const addDrawerContent = (
            <div className={style.drawerContent}>
                <Input value={taskForm.name} className={style.input} placeholder="?????????????????????" onChange={this.setProjectName.bind(this)} />
                <div style={{ display: 'inline-block' }}>
                    <Select placeholder='???????????????' value={taskForm.deptId ? taskForm.deptId : undefined} style={{ width: 120, marginTop: 20 }} onChange={this.setDeptTables.bind(this)}>
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
                    <Select placeholder='????????????????????????' value={taskForm.tableId ? taskForm.tableId : undefined} style={{ width: 200, marginTop: 20, marginLeft: 20 }} onChange={this.setTablesValue.bind(this)}>
                        {
                            deptTableOptions.length && deptTableOptions.map(option => {
                                return (
                                    <Option key={option.tableId} value={option.tableId}>{option.tableCName}</Option>
                                )
                            })
                        }

                    </Select>
                </div>
                <div className={style.monitorTable}>
                    <h4>??????????????????:</h4>
                    <div className={style.record}>
                        <div className={style.round}></div>
                        <div className={style.section}>
                            <label>????????????:</label>
                            <span>2017???11?????????</span>
                        </div>
                    </div>
                    <div className={style.record}>
                        <div className={style.round}></div>
                        <div className={style.section}>
                            <label>????????????:</label>
                            <span>??????</span>
                        </div>
                    </div>
                    <div className={style.record}>
                        <div className={style.round}></div>
                        <div className={style.section}>
                            <label>?????????</label>
                            <span>1??????1??????</span>
                        </div>
                    </div>
                    <div className={style.checkRules}>
                        <div className={style.title}>
                            <h4>????????????</h4>
                            <PlusCircleOutlined className={style.add} onClick={this.addCheckRule} />
                        </div>
                        <div className={style.formRules}>
                            {
                                checkRuleList.length && checkRuleList.map((m, i) => {
                                    return (
                                        <div className={style.formItem} key={m.id}>
                                            <div className={style.index}>{i + 1}</div>
                                            <div className={style.content}>
                                                <Select defaultValue={m.taskType} placeholder="?????????????????????" style={{ width: '100%' }} onChange={this.getCheckChildrenTypeNode.bind(this, m)}>
                                                    {
                                                        taskTypes.map((t, k) => {
                                                            return (
                                                                <Option key={k} value={t.value}>{t.name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                                <ChildrenNode key={m.id} typeId={m.taskType} _data={m}></ChildrenNode>
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
                <Modal centered title={modal.title} visible={modal.visible} onOk={modal.modalOk} onCancel={modal.modalCancel}>
                    <DatePicker showTime value={modal.runTime ? Moment(modal.runTime) : undefined} placeholder='???????????????????????????' onChange={this.onTaskRunTimeChange.bind(this)} style={{ width: '100%', marginTop: 10 }} />
                </Modal>
            </div>
        );
    }
}

export default VerificationTask;