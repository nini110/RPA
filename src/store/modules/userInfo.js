const state = {
    wx_code: '',
    wx_userid: '',
    user_name: '',
    thumb_avatar: ''
  };
  
  const mutations = {
    UPDATE_WXCODE: (state, view) => {
      state.wx_code = view
    },
    UPDATE_WXID: (state, view) => {
      state.wx_userid = view
    },
    UPDATE_WXNAME: (state, view) => {
      state.user_name = view
    },
    UPDATE_WXIMG: (state, view) => {
      state.thumb_avatar = view
    }
  }
  
  const actions = {
  
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  