<template>
 <div>
   <div v-show="this.zimushow">{{w}}</div>
 </div>
</template>
<script>
 
 export default {
  props:{
    zimuplay:{
      required:true
    },
    playvalue:{
      required:true
    },
    nozimu:{
      required:true
    },
    simplezimu:{
      required:true
    },
    zimushow:{
      required:true
    },
    maincutime:{
      required:true
    },
    headtime:{
      required:true
    },
    mas:{
      required:true
    }
    

    
  },
  data() {
   return {
    words:Array,
    w:"",
    i:0,
    timer:null,
    ti:0,
    
    

   }
  },
  mounted(){
     axios.get('/zimu.json').then(res=>{
          this.words=res.zimu            
        })
  },
  watch:{
    
    mas:{
      handler:function(){
        this.maint()
        
        }
    },
    i:{
      handler:function(){
        this.ire()
        }
    }
  },
  methods:{
      
      maint(){
        
        if((this.zimushow==true&&this.simplezimu=="ischange")||(this.zimushow==true&&this.simplezimu=="nochange")){
          
          this.mas=this.mas
          this.ti=this.mas
          this.i=Math.round(this.mas/2)
          if(this.ti>=0&&this.ti<2){
            this.w=this.words[0].word 
                
          }
          else if(this.ti>=(2*this.i)&&this.ti<=(4*this.i)&&this.i!=0){
            this.w=this.words[this.i].word 
           
            
                
          }
        }
      },
      ire(){
        this.i=this.i
        
        
      }
  },
  
  beforeDestroy() {
      clearInterval(this.timer);
  }
  
}
</script>
<style scoped>
</style>