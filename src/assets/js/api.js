import { get, post, baseURL } from "./request.js";

//菜单
export const menu = () => get("/home/menu");

//角落数据(首页右上角)
export const getCornerData = () => get("/home/getCornerData");

//获取用户信息
export const getUser = () => get("/login/getUser");

//消息提示
export const getWarnMsg = () => get("/home/getWarnMsg");

//归集总体情况
export const collectionOverallSituation = () => post("/home/collectionOverallSituation");

//重点监控情况
export const importantMonitorCondition = () => get("/home/importantMonitorCondition");

//归集数据分布情况
export const getCollectionDistribution = () => post("/home/getCollectionDistribution");

//归集表排名
export const tableRanking = () => post("/home/tableRanking");

//归集流量情况
export const getCollectionTrafficSituation = () => post("/home/getCollectionTrafficSituation");

//部门级别下拉选项
export const getDeptLevelOptions = () => get('/gkGjGm/getDeptLevelOptions')

//部门下拉选项
export const getDeptOptions = () => get('/gkGjMx/getDeptOptions')

//概况归集明细-分页查询
export const gkgjPageQuery = (data) => get('/gkGjMx/pageQuery', { ...data })

//概况归集规模-分页查询
export const gjgmPageQuery = (data) => get('/gkGjGm/pageQuery', { ...data })

//概况归集规模-导出excel
export const gjgmExport = ({ deptLevel, deptName }) => `${baseURL}/gkGjGm/exportExcel?deptLevel=${deptLevel}&deptName=${deptName}`

//监控项目管理-项目列表
export const jkxmFindByPage = (data) => get('/project/findByPage', { ...data })

//所有的指标列表
export const allIndexList = () => get('/index/listAll')

//获取部门下的表
export const getTableByDeptNo = (data) => get('/common/getTableByDeptNo', { ...data })


//监控项目管理-项目保存 
export const jkxmManagerSave = (data) => post('/project/save', { ...data })

//监控项目管理-项目详情 
export const jkxmManagerDetail = (data) => get('/project/detail', { ...data })

//监控项目管理-项目删除
export const jkxmManagerDelete = (data) => get('/project/delete', { ...data })

//监控项目管理-导出  
export const monitorProjectDownload = ({ keyword }) => `${baseURL}/project/download?keyword=${keyword}`

//监控指标管理-指标列表
export const zbFindByPage = (data) => get('/index/findByPage', { ...data })

//监控指标管理-指标类型列表
export const zbTypelist = () => get('/index/typelist')

//监控指标管理-指标保存
export const zbTypeSave = (data) => post('/index/save', { ...data })

//监控指标管理-指标详情
export const zbTypeDetail = (data) => get('/index/detail', { ...data })

//监控指标管理-指标导出
export const zbExportDownload = ({ keyword }) => `${baseURL}/index/export?keyword=${keyword}`

//所有的指标列表
export const zbAllList = () => get('/index/listAll')

// 监控任务-任务列表
export const jkrwFindByPage = (data) => get('/task/findByPage', { ...data })

//监控任务-任务结果
export const jkrwTaskResult = ({ id }) => `${baseURL}/task/taskResult?id=${id}`

//监控任务-任务上线
export const jkrwResumeJob = (data) => get('/task/resumeJob', { ...data })

//监控任务-任务下线
export const jkrwStop = (data) => get('/task/stop', { ...data })

//所有的项目列表
export const projectListAll = (data) => get('/project/listAll', { ...data })

//监控任务-任务保存
export const taskSaveOrUpdate = (data) => post('/task/save', { ...data })

//监控任务-任务详情
export const taskDetail = (data) => get('/task/detail', { ...data })

//监控任务-任务删除
export const taskDelete = (data) => get('/task/delete', { ...data })

//监控任务-导出
export const taskDownload = ({ id }) => `${baseURL}/task/download?id=${id}`

//归集核查-获取核查任务列表
export const getVerificationList = (data) => post('/verification/getVerificationList', { ...data })

//归集核查-核查发布
export const publishVerification = (data) => post('/verification/publishVerification', { ...data })

//归集核查-删除核查任务
export const deleteVerification = (data) => post('/verification/deleteVerification', { ...data })

//归集核查-停止发布
export const stopPublish = (data) => post('/verification/stopPublish', { ...data })

//归集核查-核查任务详情
export const getVerificationInfo = (data) => get('/verification/getVerificationInfo', { ...data })

//归集核查-获取时间格式列表
export const getDateFormatList = () => get('/verification/getDateFormatList')
