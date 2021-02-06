<template>
    <div id="app">
        <div class="title">flowchart</div>

        <div class="toolbar">
            <button @click="add">添加</button>
        </div>

        <flow-chart :nodes="nodes" :connections="connections" @addConnection="addConnection" />
    </div>
</template>

<script>
import flowChart from './flow-chart.vue';

export default {
    name: 'App',
    components: {
        flowChart
    },
    data() {
        return {
            nodes: [
                {
                    id: 1,
                    name: 'AAAAAAAAAAAAAAAAAAAAA',
                    positionX: 50,
                    positionY: 100,
                    inputPorts: [
                        { id: 1 }
                    ],
                    outputPorts: [
                        { id: 2 },
                        { id: 3 }
                    ]
                },
                {
                    id: 2,
                    name: 'BBB',
                    positionX: 550,
                    positionY: 100,
                    inputPorts: [
                        { id: 4 }
                    ],
                    outputPorts: [
                        { id: 5 }
                    ]
                },
                {
                    id: 3,
                    name: 'CCC',
                    positionX: 50,
                    positionY: 300,
                    inputPorts: [
                        { id: 6 }
                    ],
                    outputPorts: [
                        { id: 7 }
                    ]
                },
                {
                    id: 4,
                    name: 'DDD',
                    positionX: 550,
                    positionY: 300,
                    inputPorts: [
                        { id: 8 }
                    ],
                    outputPorts: [
                        { id: 9 }
                    ]
                },
                {
                    id: 5,
                    name: 'EEE',
                    positionX: 300,
                    positionY: 200,
                    inputPorts: [
                        { id: 10 }
                    ],
                    outputPorts: [
                        { id: 11 }
                    ]
                }
            ],
            connections: [
                {
                    id: 1,
                    sourceId: 1,
                    targetId: 5,
                    inputPortId: 3,
                    outputPortId: 10
                },
                {
                    id: 2,
                    sourceId: 2,
                    targetId: 4,
                    inputPortId: 5,
                    outputPortId: 8
                }
            ]
        };
    },
    methods: {
        addConnection(connection) {
            this.connections.push(connection);
        },
        add() {
            this.nodes.push({
                id: Date.now(),
                name: Math.random() * 100,
                positionX: Math.random() * 800,
                positionY: Math.random() * 500,
                inputPorts: [
                    { id: Date.now() + Math.random() * 1000 }
                ],
                outputPorts: [
                    { id: Date.now() + Math.random() * 1000 }
                ]
            });
        }
    }
};
</script>

<style lang="less">
body,
div {
    margin: 0;
    padding: 0;
}
html {
    height: 100%;
}
body {
    height: 100%;
    font-family: sans-serif;
    color: #666;
    line-height: 1.5;
}
</style>

<style lang="less" scoped>
.title {
    padding: 40px 0;
    font-size: 30px;
    text-align: center;
}
.toolbar {
    margin-bottom: 10px;
    text-align: center;
}
</style>
