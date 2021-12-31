const state = {
  pinList: [],
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
  checkRight: false
};

const mutations = {
  // 获得的数据--本期
  UPDATE_PINLIST: (state, view) => {
    state.pinList = view
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
