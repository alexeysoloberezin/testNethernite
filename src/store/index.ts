import Vue from "vue";
import Vuex, {StoreOptions} from "vuex";
import axios from "axios";
import {getPackagesVals, packagesType} from "@/types/Packages";
import {RootState} from "@/types/State";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    packages: [],
    error: '',
  },
  mutations: {
    setPackages(state: any, value: packagesType[] | []) {
      state.packages = value
    },
    setPackagesError(state: any, value: string) {
      state.error = value
    },
  },
  actions: {
    getPackages(context: any, val: getPackagesVals) {
      axios.get(`https://data.jsdelivr.com/v1/stats/packages?limit=${val.limit}&page=${val.page}`)
        .then((res) => {
          context.commit('setPackages', res.data)
          context.commit('setPackagesError', '')
        })
        .catch((res) => {
          context.commit('setPackages', [])
          context.commit('setPackagesError', res.message)
        })
    }
  },
  modules: {},
};

export default new Vuex.Store<RootState>(store);