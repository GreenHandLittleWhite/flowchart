<template>
    <div id="app">
        <flow-chart />
    </div>
</template>

<script>
import flowChart from './flow-chart.vue';

export default {
    name: 'App',
    components: {
        flowChart
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
