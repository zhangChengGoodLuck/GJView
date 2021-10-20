import React, { useCallback, useEffect, useRef } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'

// 设备分辨率
// const dpr = window.devicePixelRatio;

const Chart = ({ renderType = 'canvas', options, style, components = [] }) => {
    const chartRef = useRef();
    const chartInstance = useRef(null);

    //初始化图表，设置配置项
    const renderChart = useCallback(() => {
        const render = echarts?.getInstanceByDom(chartRef.current);
        if (render) {
            chartInstance.current = render;
        } else {
            chartInstance.current = echarts?.init(chartRef.current, null, {
                renderer: renderType,
            });
        }
        chartInstance.current?.setOption(options);
    }, [chartRef, options, renderType]);

    useEffect(() => {
        // 注册必须的组件
        echarts?.use([CanvasRenderer, GridComponent, TooltipComponent, TitleComponent, LegendComponent, ...components]);
    }, []);

    //监听屏幕变化，重绘图表
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    useEffect(() => {
        renderChart();
        return () => {
            const { current } = chartInstance ?? {};
            if (current) {
                current.dispose();
            }
        };
    }, [chartInstance, renderChart]);

    const handleResize = () => {
        const chart = chartInstance?.current;
        if (chart) {
            chart.resize();
        }
    };

    return (
        <div
            ref={chartRef}
            style={style || {
                width: '100%',
                height: '100%'
            }}
        />
    );
};

export default Chart;
