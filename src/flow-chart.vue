<template>
    <div class="chart-container">
        <svg id="svg">
            <defs>
                <marker id="markerArrow" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto">
                    <path d="M 0,0 L 5,2 L 0,4 Z" style="fill: red" />
                </marker>
            </defs>
            <g id="container">
                <g id="connectionsGroup"></g>
                <g id="nodesGroup"></g>
                <path id="dragConnection"></path>
            </g>
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props: {
        nodes: { type: Array, default: () => [] },
        connections: { type: Array, default: () => [] }
    },
    data() {
        return {
            d3Svg: null,
            d3G: null,
            d3Nodes: null,
            d3Connections: null,
            d3DragConnection: null,
            mousedownEndpoint: null,
            mouseoverEndpoint: null,
            selectedNodeId: null
        };
    },
    mounted() {
        this.d3Svg = d3.select('#svg');
        this.d3G = d3.select('#container');
        this.d3Nodes = d3.select('#nodesGroup').selectAll('g');
        this.d3Connections = d3.select('#connectionsGroup').selectAll('g');
        this.d3DragConnection = d3
            .select('#dragConnection')
            .style('fill', 'none')
            .style('stroke', 'skyblue')
            .style('stroke-width', '2')
            .attr('marker-end', 'url(#markerArrow)');

        this.updateGraph();

        // 缩放 && 移动
        const zoom = d3
            .zoom()
            .scaleExtent([0.5, 3])
            .on('zoom', event => {
                this.d3G.attr('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`);
            })
            .on('start', () => {
                this.d3Svg.style('cursor', 'move');
            })
            .on('end', () => {
                this.d3Svg.style('cursor', 'auto');
            });
        this.d3Svg.call(zoom).on('dblclick.zoom', null);
    },
    methods: {
        updateGraph() {
            const self = this;

            // 节点
            this.d3Nodes = this.d3Nodes.data(this.nodes, d => d.id);
            this.d3Nodes.exit().remove();
            const newGs = this.d3Nodes.enter().append('g');

            newGs
                .on('mouseover', function () {
                    d3.select(this).select('.node-wrap').classed('active', true);
                    d3.select(this).selectAll('.endpoint').classed('active', true);
                })
                .on('mouseout', function (event, d) {
                    if (self.selectedNodeId !== d.id) {
                        d3.select(this).select('.node-wrap').classed('active', false);
                        d3.select(this).selectAll('.endpoint').classed('active', false);
                    }
                })
                .on('click', function (event, d) {
                    d3.selectAll('.node-wrap').classed('active', false);
                    self.selectedNodeId = d.id;
                    d3.select(this).select('.node-wrap').classed('active', true);
                })
                .call(this.gDrag());

            newGs.append('rect').attr('class', 'node-wrap').attr('rx', 4).attr('ry', 4);

            newGs.each(function (d) {
                d3.select(this)
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
                    self.addEndpointEvent(port, endpoint, cx, cy, 'inputPort');
                });
                d.outputPorts.forEach((port, index) => {
                    const cx = (180 / (d.outputPorts.length + 1)) * (index + 1);
                    const cy = 32;
                    const endpoint = d3.select(this).append('circle');
                    self.addEndpointEvent(port, endpoint, cx, cy, 'outputPort');
                });
            });

            this.d3Nodes = newGs.merge(this.d3Nodes).attr('transform', d => `translate(${d.positionX}, ${d.positionY})`);

            // 连线
            this.d3Connections = this.d3Connections.data(this.connections, d => d.id);
            this.d3Connections.exit().remove();
            const newConnection = this.d3Connections.enter().append('path');
            this.d3Connections = newConnection.merge(this.d3Connections);

            this.d3Connections.each(function (d) {
                const sourceNode = self.nodes.find(node => node.id === d.sourceId);
                const targetNode = self.nodes.find(node => node.id === d.targetId);
                if (!sourceNode || !targetNode) {
                    return;
                }

                const inputPortIndex = sourceNode.outputPorts.findIndex(port => port.id === d.inputPortId);
                const outputPortIndex = targetNode.inputPorts.findIndex(port => port.id === d.outputPortId);
                if (inputPortIndex < 0 || outputPortIndex < 0) {
                    return;
                }

                const sourceX = sourceNode.positionX + (180 / (sourceNode.outputPorts.length + 1)) * (inputPortIndex + 1);
                const sourceY = sourceNode.positionY + 32;
                const targetX = targetNode.positionX + (180 / (targetNode.inputPorts.length + 1)) * (outputPortIndex + 1);
                const targetY = targetNode.positionY;
                const path = self.getBezierPath(sourceX, sourceY, targetX, targetY);

                d3.select(this)
                    .attr('d', path)
                    .style('fill', 'none')
                    .style('stroke', 'red')
                    .style('stroke-width', '2')
                    .attr('marker-end', 'url(#markerArrow)'); // 连线箭头
            });
        },
        addEndpointEvent(port, endpoint, cx, cy, type) {
            endpoint
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 7)
                .attr('class', 'endpoint')
                .on('mousedown', (event, d) => {
                    event.stopPropagation();
                    if (type === 'outputPort') {
                        this.mousedownEndpoint = {
                            ...port,
                            nodeId: d.id
                        };
                    }
                })
                .on('mouseover', (event, d) => {
                    endpoint.classed('active', true);

                    this.mouseoverEndpoint = {
                        ...port,
                        nodeId: d.id
                    };
                })
                .on('mouseout', () => {
                    endpoint.classed('active', false);
                    this.mouseoverEndpoint = null;
                })
                .call(this.endpointDrag(cx, cy, type));
        },
        getBezierPath(sourceX, sourceY, targetX, targetY) {
            const absX = Math.abs(targetX - sourceX);
            let dx = parseInt(absX / 100, 10);
            if (dx > 10) {
                dx = 10;
            }
            if (targetX < sourceX) {
                dx = -dx;
            }
            const absY = Math.abs(targetY - sourceY);
            let dy = parseInt(absY / 3, 10);
            if (dy < 60) {
                dy = 60;
            }
            if (dy > 150) {
                dy = 150;
            }

            const cpx1 = sourceX - dx;
            const cpy1 = sourceY + dy;
            const cpx2 = targetX + dx;
            const cpy2 = targetY - dy;
            let path = `M${sourceX},${sourceY}C${cpx1},${cpy1},${cpx2},${cpy2},${targetX},${targetY - 11}`;
            path = `${path}L${targetX},${targetY - 11}L${targetX},${targetY - 10}`;

            return path;
        },
        gDrag() {
            return d3
                .drag()
                .on('drag', (event, d) => {
                    d.positionX += event.dx;
                    d.positionY += event.dy;
                    this.updateGraph();
                });
        },
        endpointDrag(cx, cy, type) {
            return d3
                .drag()
                .on('drag', (event, d) => {
                    if (type === 'inputPort') {
                        return;
                    }

                    const sourceX = d.positionX + cx;
                    const sourceY = d.positionY + cy;
                    // 获取移动和缩放后的坐标
                    const transform = d3.zoomTransform(this.d3G.node());
                    const targetXY = transform.invert(d3.pointer(event, this.d3Svg.node()));

                    const bezierPath = this.getBezierPath(sourceX, sourceY, targetXY[0], targetXY[1]);

                    this.d3DragConnection.attr('d', bezierPath);

                    d3.selectAll('.endpoint').classed('active', true);
                })
                .on('end', () => {
                    if (this.mousedownEndpoint && this.mouseoverEndpoint) {
                        const newConnection = {
                            id: Date.now(),
                            sourceId: this.mousedownEndpoint.nodeId,
                            targetId: this.mouseoverEndpoint.nodeId,
                            inputPortId: this.mousedownEndpoint.id,
                            outputPortId: this.mouseoverEndpoint.id
                        };
                        this.$emit('addConnection', newConnection);

                        this.mousedownEndpoint = null;
                    }

                    this.d3DragConnection.attr('d', null);
                    d3.selectAll('.endpoint').classed('active', false);
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

    &.active {
        fill: fade(@primary-color, 5%);
        stroke: @primary-color;
    }
}
.node-text {
    font-size: 12px;
}
.endpoint {
    fill: white;
    stroke: @primary-color;
    stroke-width: 1px;
    opacity: 0;
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
