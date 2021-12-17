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
  beforeCreate() {},
  created() {
    if (!this.$route.query.wx_userid) {
      location.href = `${this.DomainName}/platform/login`;
    } else {
      localStorage.setItem("wx_code", this.$route.query.wx_code);
      localStorage.setItem("wx_userid", this.$route.query.wx_userid);
      localStorage.setItem("user_name", this.$route.query.user_name);
      localStorage.setItem("thumb_avatar", this.$route.query.thumb_avatar);
      this.$router.push({ name: "Home" });
    }
  },
};
</script>
