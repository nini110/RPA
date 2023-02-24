const state = {
    intervalArr_dmp: [],
    intervalArr_booth: [],
    intervalArr_direct: [],
    intervalArr_people: [],
    intervalArr_cube: [],
    intervalArr_goshop: [],

    intervalData_dmp: [],
    intervalData_booth: [],
    intervalData_direct: [],
    intervalData_people: [],
    intervalData_cube: [],
    intervalData_goshop: [],
};

const mutations = {
    // 获得的数据--本期
    UPDATE_ARR_DMP: (state, view) => {
        state.intervalArr_dmp = view
    },
    // 获得的数据--已授权
    UPDATE_ARR_BOOTH: (state, view) => {
        state.intervalArr_booth = view
    },
    UPDATE_ARR_DIRECT: (state, view) => {
        state.intervalArr_direct = view
    },
    UPDATE_ARR_PEOPLE: (state, view) => {
        state.intervalArr_people = view
    },
    UPDATE_ARR_CUBE: (state, view) => {
        state.intervalArr_cube = view
    },
    UPDATE_ARR_GOSHOP: (state, view) => {
        state.intervalArr_goshop = view
    },

    // 获得的数据--本期
    UPDATE_DATA_DMP: (state, view) => {
        state.intervalData_dmp = view
    },
    // 获得的数据--已授权
    UPDATE_DATA_BOOTH: (state, view) => {
        state.intervalData_booth = view
    },
    UPDATE_DATA_DIRECT: (state, view) => {
        state.intervalData_direct = view
    },
    UPDATE_DATA_PEOPLE: (state, view) => {
        state.intervalData_people = view
    },
    UPDATE_DATA_CUBE: (state, view) => {
        state.intervalData_cube = view
    },
    UPDATE_DATA_GOSHOP: (state, view) => {
        state.intervalData_goshop = view
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
