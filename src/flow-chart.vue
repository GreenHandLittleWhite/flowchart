<template>
    <div class="chart-container">
        <svg id="svg">
            <g id="container">
                <g id="connectionsGroup"></g>
                <g id="nodesGroup"></g>
            </g>
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props: {
        nodes: { type: Array, default: () => [] }
    },
    data() {
        return {
            d3Nodes: null
        };
    },
    mounted() {
        this.d3Nodes = d3.select('#nodesGroup').selectAll('g');

        this.updateGraph();
    },
    methods: {
        updateGraph() {
            const self = this;

            // 节点
            this.d3Nodes = this.d3Nodes.data(this.nodes, d => d.id);
            const newGs = this.d3Nodes.enter().append('g');

            newGs.append('rect').attr('class', 'node-wrap').attr('rx', 4).attr('ry', 4);

            newGs.each(function (d) {
                d3.select(this)
                    .attr('transform', () => `translate(${d.positionX}, ${d.positionY})`)
                    .append('text')
                    .attr('x', 24)
                    .attr('y', 20)
                    .attr('class', 'node-text')
                    .text(() => d.name)
                    .each(function () {
                        const nodeText = d3.select(this);
                        let textLength = nodeText.node().getComputedTextLength();
                        let text = nodeText.text();
                        while (textLength > 120 && text.length > 0) {
                            text = text.slice(0, -1);
                            nodeText.text(`${text}...`);
                            textLength = nodeText.node().getComputedTextLength();
                        }
                    });

                d.inputPorts.forEach((port, index) => {
                    const cx = (180 / (d.inputPorts.length + 1)) * (index + 1);
                    const cy = 0;
                    const endpoint = d3.select(this).append('circle');
                    self.addEndpointEvent(endpoint, cx, cy, 'inputPort');
                });
                d.outputPorts.forEach((port, index) => {
                    const cx = (180 / (d.outputPorts.length + 1)) * (index + 1);
                    const cy = 32;
                    const endpoint = d3.select(this).append('circle');
                    self.addEndpointEvent(endpoint, cx, cy, 'outputPort');
                });
            });
        },
        addEndpointEvent(endpoint, cx, cy) {
            endpoint
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 7)
                .attr('class', 'endpoint')
                .on('mouseover', () => {
                    endpoint.classed('active', true);
                })
                .on('mouseout', () => {
                    endpoint.classed('active', false);
                });
        }
    }
};
</script>

<style lang="less">
@primary-color: #409eff;

.chart-container {
    width: 800px;
    height: 500px;
    margin: 0 auto;
    border: 1px solid #dfdfdf;
}
#svg {
    height: 100%;
    width: 100%;
}
.node-wrap {
    width: 180px;
    height: 32px;
    fill: white;
    stroke: #e0e3e7;
    stroke-width: 1px;
}
.node-text {
    font-size: 12px;
}
.endpoint {
    fill: white;
    stroke: @primary-color;
    stroke-width: 1px;
    opacity: 0.5;
    cursor: crosshair;

    &.active {
        stroke: @primary-color;
        opacity: 1;
    }
    &:hover {
        fill: @primary-color;
        stroke: fade(@primary-color, 40%);
        stroke-width: 7px;
    }
}
</style>
