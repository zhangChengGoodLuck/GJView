import { Component } from 'react'
import style from './index.module.scss'
import { getCornerData, getWarnMsg, collectionOverallSituation, importantMonitorCondition, getCollectionDistribution, tableRanking, getCollectionTrafficSituation } from '@api'
import * as echarts from 'echarts/core';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import Chart from '@/components/base/chart';
import { Carousel, Row, Col } from 'antd';
import Icon from '@/components/base/icon'
import storeLocal from 'storejs';

class OverView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            msgs: [],
            headItems: [{
                name: '全省归集总量',
                unit: '亿条',
                num: 0,
                key: 'provinceGjDataTotal'
            }, {
                name: '全省今日更新',
                unit: '条',
                num: 0,
                key: 'provinceTodayUpdated'
            }, {
                name: '归集排名',
                unit: '',
                num: 0,
                key: 'deptGjRanking'
            }],
            statisticalPanels: [
                {
                    name: '归集历史数据总量',
                    unit: '亿条',
                    num: 0,
                    icon: require('@/assets/imgs/panel1.png'),
                    key: 'historicalDataNum',
                    span: 12,
                    bgColor: 'rgba(217, 84, 79, .1)',
                    color: 'rgba(217, 84, 79, 1)'
                }, {
                    name: '现有归集数据总量',
                    unit: '亿条',
                    num: 0,
                    icon: require('@/assets/imgs/panel2.png'),
                    key: 'nowDataNum',
                    span: 12,
                    bgColor: 'rgba(240, 173, 78, .1)',
                    color: 'rgba(240, 173, 78, 1)'
                }, {
                    name: '现有归集表数量',
                    unit: '张',
                    num: 0,
                    icon: require('@/assets/imgs/panel3.png'),
                    key: 'nowTableNum',
                    span: 8,
                    bgColor: 'rgba(92, 184, 92, .1)',
                    color: 'rgba(92, 184, 92, 1)'
                }, {
                    name: '现有归集字段数',
                    unit: '个',
                    num: 0,
                    icon: require('@/assets/imgs/panel4.png'),
                    key: 'nowColumnNum',
                    span: 8,
                    bgColor: 'rgba(91, 191, 222, .1)',
                    color: 'rgba(91, 191, 222, 1)'
                }, {
                    name: '未及时更新数据表',
                    unit: '张',
                    num: 0,
                    icon: require('@/assets/imgs/panel5.png'),
                    key: 'notUpdateTableNum',
                    span: 8,
                    bgColor: 'rgba(152, 97, 231, .1)',
                    color: 'rgba(152, 97, 231, 1)'
                }
            ],
            monitorCondition: [],
            chartData: [],
            rankData: [],
            trafficSituation: [],
            monitor: [
                {
                    name: '重点项目',
                    key: 'projectName'
                }, {
                    name: '表数量',
                    key: 'tableCount'
                }, {
                    name: '数据量',
                    key: 'dataNum'
                }, {
                    name: '及时更新表占比',
                    key: 'percent'
                },
            ]
        }
    }
    componentDidMount() {
        getCornerData().then(({ data: cornerData }) => {
            let headItems = this.state.headItems.map(item => {
                return {
                    ...item,
                    num: cornerData[item.key]
                }
            })
            this.setState({ cornerData, headItems })
        })
        getWarnMsg().then(({ data: msgs }) => {
            if (msgs) { this.setState({ msgs }) }

        })
        collectionOverallSituation().then(({ data: statistical }) => {
            let statisticalPanels = this.state.statisticalPanels.map(item => {
                return {
                    ...item,
                    num: ['historicalDataNum', 'nowDataNum'].includes(item.key) ? Math.floor(statistical[item.key] / 100000000) : statistical[item.key],
                    unit: ['historicalDataNum', 'nowDataNum'].includes(item.key) ? '亿条' : '条',
                }
            })
            this.setState({ statistical, statisticalPanels })

        })
        importantMonitorCondition().then(({ data: monitorCondition }) => { this.setState({ monitorCondition }) })
        getCollectionDistribution().then(({ data: chartData }) => { this.setState({ chartData }) })
        tableRanking().then(({ data: rankData }) => { this.setState({ rankData }) })
        // let { data: trafficSituation } = await getCollectionTrafficSituation()




        this.setState({ userName: storeLocal.get('user').username })
    }
    render() {
        const { headItems, statisticalPanels, rankData, monitor, monitorCondition, chartData, userName, msgs } = this.state
        const tableKeys = monitor.map(m => m.key)

        const getDistributingOption = (chartData) => {
            let dashedPic =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAAOBAMAAAB6G1V9AAAAD1BMVEX////Kysrk5OTj4+TJycoJ0iFPAAAAG0lEQVQ4y2MYBaNgGAMTQQVFOiABhlEwCugOAMqzCykGOeENAAAAAElFTkSuQmCC';
            let color = ['#D9544F', '#F0AD4E', '#5CB85C', '#9861E7']
            let arrName = [];
            let arrValue = [];
            let sum = 0;
            let pieSeries = [],
                lineYAxis = [];

            // 数据处理
            chartData.forEach((v, i) => {
                arrName.push(v.name);
                arrValue.push(v.value);
                sum = sum + v.value;
            });

            // 图表option整理
            chartData.forEach((v, i) => {
                pieSeries.push({
                    name: '设备',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
                    center: ['30%', '50%'],
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            value: v.value,
                            name: v.name,
                        },
                        {
                            value: sum - v.value,
                            name: '',
                            itemStyle: {
                                color: 'rgba(0,0,0,0)',
                            },
                        },
                    ],
                });
                pieSeries.push({
                    name: '',
                    type: 'pie',
                    silent: true,
                    z: 1,
                    clockWise: false, //顺时加载
                    hoverAnimation: false, //鼠标移入变大
                    radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
                    center: ['30%', '50%'],
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            value: 7.5,
                            itemStyle: {
                                color: '#E3F0FF',
                            },
                        },
                        {
                            value: 2.5,
                            name: '',
                            itemStyle: {
                                color: 'rgba(0,0,0,0)',
                            },
                        },
                    ],
                });
                v.percent = ((v.value / sum) * 100).toFixed(1) + '%';
                lineYAxis.push({
                    value: i,
                    textStyle: {
                        rich: {
                            circle: {
                                color: color[i],
                                padding: [0, 5],
                            },
                        },
                    },
                });
            });

            let option = {
                backgroundColor: '#fff',
                color: color,
                grid: {
                    top: '15%',
                    bottom: '54%',
                    left: '30%',
                    containLabel: false,
                },
                yAxis: [
                    {
                        type: 'category',
                        inverse: true,
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            formatter: function (params) {
                                let item = chartData[params];
                                return (
                                    '{line|}{circle|●}{name|' +
                                    item.name +
                                    '}{bd||}{percent|' +
                                    item.percent +
                                    '}{value|' +
                                    item.value + "亿条" +
                                    '}'
                                );
                            },
                            interval: 0,
                            inside: true,
                            textStyle: {
                                color: '#333',
                                fontSize: 13,
                                rich: {
                                    line: {
                                        width: 170,
                                        height: 20,
                                        backgroundColor: { image: dashedPic },
                                    },
                                    name: {
                                        color: '#000',
                                        fontSize: 13,
                                        width: 80
                                    },
                                    bd: {
                                        color: '#000',
                                        padding: [0, 5],
                                        fontSize: 14,
                                        width: 10
                                    },
                                    percent: {
                                        color: '#000',
                                        fontSize: 14,
                                        width: 50,
                                        // fontWeight: 500
                                    },
                                    value: {
                                        color: '#000',
                                        fontSize: 13,
                                        // fontWeight: 500,
                                        padding: [0, 0, 0, 20],
                                    }
                                },
                            },
                            show: true,
                        },
                        data: lineYAxis,
                    },
                ],
                xAxis: [
                    {
                        show: false,
                    },
                ],
                series: pieSeries,
            };
            return option
        };

        const getTopOption = (chartData) => {
            let option = {
                title: {
                    show: false,
                    text: '数量',
                    top: '0%',
                    left: '1.5%',
                },
                tooltip: {
                    trigger: 'axis',
                    className: 'echarts-tooltip echarts-tooltip-dark',
                    axisPointer: {
                        type: 'shadow',
                    },
                    textStyle: {
                        rich: {
                            circle: {
                                color: 'red'
                            },
                            name: {
                                color: 'red'
                            }
                        }
                    }
                },
                grid: {
                    top: '15%',
                    right: '3%',
                    left: '10%',
                    bottom: '12%',
                },
                xAxis: [
                    {
                        type: 'category',
                        data: chartData.map(m => m.tableComment),
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#aaa',
                            },
                        },

                        axisLabel: {
                            margin: 10,
                            color: '#AAAAAA',
                            interval: 0,
                            rotate: -45,
                            formatter: function (value) {
                                return (value.length > 2 ? (value.slice(0, 2) + "...") : value)

                            },
                            textStyle: {
                                fontSize: 12,
                            },

                        },
                    },
                ],
                yAxis: [
                    {
                        splitNumber: 3,
                        axisLabel: {
                            formatter: (params) => {
                                return params / 100000000 + '亿条'
                            },
                            color: '#AAAAAA',
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dotted',
                                color: '#C0C4CC',
                            },
                        },
                    },
                ],
                series: [
                    {
                        type: 'bar',
                        data: chartData.map(m => m.num),
                        barWidth: 10,
                        emphasis: {
                            itemStyle: {
                                color: '#F0AD4E',
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: '#5BBFDE',
                                barBorderRadius: [30, 30, 0, 0],
                            },
                        },
                    },
                ],
            };
            return option
        }

        const getFlowOption = (chartData) => {
            return {
                title: {
                    text: '一周内人员出入总数变化图',
                    textStyle: {
                        fontSize: 25,
                        fontWeight: 'normal',
                        color: '#fff',
                    },
                    x: 'center'
                },
                tooltip: {},
                grid: {
                    top: '8%',
                    left: '1%',
                    right: '1%',
                    bottom: '8%',
                    containLabel: true,
                },
                legend: {
                    itemGap: 50,
                    data: ['人员出入总数'],
                    textStyle: {
                        color: '#f9f9f9',
                        borderColor: '#fff'
                    },
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    axisLine: { //坐标轴轴线相关设置。数学上的x轴
                        show: true,
                        lineStyle: {

                            color: '#f9f9f9'
                        },
                    },
                    axisLabel: { //坐标轴刻度标签的相关设置
                        textStyle: {
                            color: '#AAAAAA',
                            margin: 15,
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    data: ['2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17',],
                }],
                yAxis: [{
                    type: 'value',
                    min: 0,
                    // max: 140,
                    splitNumber: 5,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#C0C4CC'
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        margin: 20,
                        textStyle: {
                            color: '#AAAAAA',

                        },
                    },
                    axisTick: {
                        show: false,
                    },
                }],
                series: [{
                    name: '注册总量',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    showAllSymbol: true,
                    symbolSize: 0,
                    lineStyle: {
                        normal: {
                            width: 3,
                            color: "rgba(92, 184, 92, 1)", // 线条颜色
                        },
                        borderColor: 'rgba(92, 184, 92, 1)'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#28ffb3",

                        }
                    },
                    tooltip: {
                        show: false
                    },
                    areaStyle: { //区域填充样式
                        normal: {
                            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(92, 184, 92, 1)'
                            },
                            {
                                offset: 0.3,
                                color: 'rgba(92, 184, 92, .1)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(92, 184, 92, .1)'
                            }
                            ], false),
                            shadowColor: 'rgba(92, 184, 92, .1)', //阴影颜色
                            shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                        }
                    },
                    data: [100, 120, 110, 60, 70, 130, 150]
                }
                ]
            };
        }
        return (
            <div className={style.container}>
                <div className={style.header}>
                    <h4>{userName}，欢迎您！</h4>
                    <div className={style.numbers}>
                        {
                            headItems.length && headItems.map(item => {
                                return (
                                    <div className={style.box} key={item.key}>
                                        <div>
                                            <span className={style.name}>{item.name}</span>
                                            <article className={style.lineCenter}>
                                                <span className={style.num}>{item.num}</span>
                                                <span className={style.unit}>{item.unit}</span>
                                            </article>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={style.msgCarousel}>
                    <Carousel dots={false} dotPosition={'right'} autoplay>
                        {
                            msgs.length && msgs.map(msg => {
                                return (
                                    <div className={style.message} key={msg.message}>
                                        <div className={style.flex}>
                                            <Icon type='img' icon={require('@/assets/imgs/warning.png')}></Icon>
                                            <p>
                                                <span>[{msg.type}]</span>
                                                <span>{msg.message}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </Carousel>
                </div>
                <div className={style.scrollWrapper}>
                    <Row gutter={16}>
                        <Col className={style.gutterRow} span={12}>
                            <div className={style.box}>
                                <h4>归集总体情况</h4>
                                <Row gutter={20}>
                                    {
                                        statisticalPanels.length && statisticalPanels.map((m, i) => {
                                            return (
                                                <Col key={m.name} className={style.panel} span={m.span}>
                                                    <div className={style.panelItem} style={{ backgroundColor: m.bgColor, color: m.color }}>
                                                        <Icon type='img' icon={m.icon} alt={m.name} customSize={{ width: 50, height: 50 }} />
                                                        <div className={style.desc} >
                                                            <div className={style.numbers}>
                                                                <p className={style.num}>{m.num}</p>
                                                                <p className={style.unit}>{m.unit}</p>
                                                            </div>
                                                            <p>
                                                                {m.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </div>
                        </Col>
                        <Col className={style.gutterRow} span={12}>
                            <div className={style.box}>
                                <h4>监控项目情况</h4>
                                <div className={style.tables}>
                                    <div className={style.tableHead}>
                                        {
                                            monitor.map((item, i) => {
                                                return (
                                                    <span key={item.name} className={style.head}>{item.name}</span>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={style.tableContent}>
                                        {
                                            monitorCondition.length && monitorCondition.map((item, i) => {
                                                return (
                                                    <div key={i} className={style.row}>
                                                        {
                                                            tableKeys.map(m => {
                                                                return (
                                                                    <span key={m} className={style.val}>{item[m]}{m === 'percent' ? '%' : ''}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )

                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className={style.gutterRow} span={12}>
                            <div className={style.box}>
                                <h4>归集数据分布情况</h4>
                                <div className={style.chartBox}>
                                    <Chart
                                        components={[PieChart]}
                                        options={getDistributingOption(chartData)}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col className={style.gutterRow} span={12}>
                            <div className={style.box}>
                                <h4>归集表排名Top10</h4>
                                <div className={style.chartBox}>
                                    <Chart
                                        components={[BarChart]}
                                        options={getTopOption(rankData)}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col className={style.gutterRow} span={24}>
                            <div className={style.box}>
                                <h4>归集流量情况</h4>
                                <div className={style.chartBox}>
                                    <Chart
                                        components={[LineChart]}
                                        options={getFlowOption()}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default OverView;