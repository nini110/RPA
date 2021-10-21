<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {
      // wx_code: "",
      // wx_userid: "",
    };
  },
  beforeCreate() {
    
  },
  created() {
	console.log(this.$route.query)
    if(this.$route.query.wx_userid==null||this.$route.query.wx_userid==undefined||this.$route.query.wx_userid==''){
      // location.href = this.DomainName + "/platform/login";
	location.href = "114.67.229.243:5005/platform/login";
	// location.href = "http://tool.afocus.com.cn:5005/platform/login";
    }else{
      localStorage.setItem('wx_code',this.$route.query.wx_code)
      localStorage.setItem('wx_userid',this.$route.query.wx_userid)
      localStorage.setItem('user_name',this.$route.query.user_name)
      this.$router.push({name:'Home'})
    }  
    // this.$router.replace({name:'Home'})
    // alert(localStorage.getItem('wx_userid'),localStorage.getItem('wx_code'))
    // console.log(this.$cookies) 
    // this.$router.push({name:'home',query: { wx_code:this.$route.query.wx_code , wx_userid:this.$route.query.wx_userid }})
  },
};
</script>
