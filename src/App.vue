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
                    positionY: 100
                },
                {
                    id: 2,
                    name: 'BBB',
                    positionX: 550,
                    positionY: 100
                },
                {
                    id: 3,
                    name: 'CCC',
                    positionX: 50,
                    positionY: 300
                },
                {
                    id: 4,
                    name: 'DDD',
                    positionX: 550,
                    positionY: 300
                },
                {
                    id: 5,
                    name: 'EEE',
                    positionX: 300,
                    positionY: 200
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
