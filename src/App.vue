<template>
    <div id="app">
        <div class="title">flowchart</div>

        <flow-chart :nodes="nodes" />
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
            ]
        };
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
</style>
