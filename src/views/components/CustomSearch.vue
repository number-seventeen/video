<template>
    <!-- <el-input 
        class="custom-search"
        v-model="searchText" 
        placeholder="请输入关键字"
        clearable
        size="small" 
        @clear="queryChangeHandler"
        @keyup.enter.native="queryChangeHandler">
            <el-button class="custom-search-btn" slot="append" type="primary" size="small" @click="queryChangeHandler">搜索</el-button>
    </el-input> -->
    <el-autocomplete
      class="custom-search"
      v-model="searchText"
      :fetch-suggestions="querySearch"
      placeholder="请输入关键字"
      clearable
      size="small" 
      @keyup.enter.native="queryChangeHandler"
      @clear="queryChangeHandler"
      @select="handleSelect"
      @focus="focusHandler"
    >
        <el-button class="custom-search-btn" slot="append" type="primary" size="small" @click="queryChangeHandler">搜索</el-button>
    </el-autocomplete>
</template>

<script>
export default {
    name:'custom-search',
    data(){
        return {
            searchText:'',
            restaurants:[],
            maxCacheNum:50,
        }
    },
    created(){
        
    },
    mounted(){
        
    },
    methods:{
        queryChangeHandler(){
            this.$emit('search-change',this.searchText);
            this.blurHandler();
        },
        focusHandler(){
            //取出
            let str = window.localStorage.getItem('CustomSearchCaches');
            if(str){
                this.restaurants = JSON.parse(str);
            }
        },
        blurHandler(){
            //写入
            // { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" }
            if(this.searchText.length == 0) return;
            let isHas = false;
            for(let i=0;i<this.restaurants.length;i++){
                let item = this.restaurants[i];
                if(item.value.indexOf(this.searchText)>-1 && item.value.length == this.searchText.length){
                    isHas = true;
                    break;
                }
            }
            if(isHas) return;
            this.restaurants.unshift({value:this.searchText,address:''});
            this.restaurants = this.restaurants.slice(0,this.maxCacheNum);
            let str = JSON.stringify(this.restaurants);
            window.localStorage.setItem('CustomSearchCaches',str);
        },
        handleSelect(v){
            this.$emit('search-change',this.searchText);
        },
        querySearch(queryString, cb) {
            const restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
    }
}
</script>


<style lang="scss" scoped>
.custom-search{
    width: 100%;

    .custom-search-btn {
        color: #ffffff;
        background-color: #409EFF;
        border: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        &:hover{
            background-color: #66b1ff;
        }
    }
}
</style>