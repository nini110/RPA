const state = {
  pinList: [],
  pinListAuthor: [],
  clearLeftTag: false,
  btnState: {
    inputFlag: false,
    deleteFlag: true,
    saveFlag: true,
  },
  hasInfo: false,
  currentIfo: null,
  serchRes: null,
  checkLeft: false,
  checkRight: false,
  planOption: [],
  wx_code: '',
  wx_userid: '',
  user_name: '',
  thumb_avatar: ''
};

const mutations = {
  // 获得的数据--本期
  UPDATE_PINLIST: (state, view) => {
    state.pinList = view
  },
  // 获得的数据--已授权
  UPDATE_PINLISTAUTHOR: (state, view) => {
    state.pinListAuthor = view
  },
  UPDATE_ClRLEFT: (state, view) => {
    state.clearLeftTag = view
  },
  UPDATE_BTNSTATE: (state, view) => {
    state.btnState = view
  },
  UPDATE_HASINFO: (state, view) => {
    state.hasInfo = view
  },
  UPDATE_CURRENTIFO: (state, view) => {
    state.currentIfo = JSON.parse(JSON.stringify(view))
  },
  UPDATE_SEARCHRES: (state, view) => {
    state.serchRes = JSON.parse(JSON.stringify(view))
  },
  UPDATE_CHECKLEFT: (state, view) => {
    state.checkLeft = view
  },
  UPDATE_CHECKRIGHT: (state, view) => {
    state.checkRight = view
  },
  UPDATE_PLANOPTION: (state, view) => {
    state.planOption = JSON.parse(JSON.stringify(view))
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
