<template>
    <div class="main-loading" v-if="show">
        <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        show:{
            type:Boolean,
            default: false
        }
    },
    data(){
        return {

        }
    }
}
</script>


<style lang="scss" scoped>
.main-loading{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 2000;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner {
        /* margin: 100px auto; */
        width: 50px;
        height: 60px;
        font-size: 10px;
        display: flex;
        justify-content: space-around;

        &> div {
            background-color: #67CF22;
            height: 100%;
            width: 6px;
            display: inline-block;
            -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
            animation: stretchdelay 1.2s infinite ease-in-out;
        }

        .rect2 {
            -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s;
        }
        
        .rect3 {
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
        }
        
        .rect4 {
            -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s;
        }
        
        .rect5 {
            -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s;
        }
    }
        
        
}
</style>