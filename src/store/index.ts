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
        packagesFilter: '',
        packageInfo: [],
        packageInfoName: '',
        packageInfoLink: '',
        packageInfoError: '',
    },
    getters: {
        getPackages: (state: RootState) => {
            return state.packages.filter((item: packagesType) => {
                return item.name.toLocaleLowerCase().includes(state.packagesFilter.toLocaleLowerCase()) ||
                    item.type.toLocaleLowerCase().includes(state.packagesFilter.toLocaleLowerCase())
            })
        }
    },
    mutations: {
        setPackages(state: RootState, value: packagesType[] | []) {
            state.packages = value
        },
        setPackagesError(state: RootState, value: string) {
            state.error = value
        },
        setPackagesFilter(state: RootState, value: string) {
            state.packagesFilter = value
        },
        setPackageInfoName(state: RootState, value: string) {
            state.packageInfoName = value
        },
        setPackageInfoError(state: RootState, value: string) {
            state.packageInfoError = value
        },
        setPackageInfo(state: RootState, value: any) {
            state.packageInfo = value
        },
        setPackageInfoLink(state: RootState, value: string) {
            state.packageInfoLink = value
        },
    },
    actions: {
        getPackages(context: any, val: getPackagesVals) {
            axios.get(`https://data.jsdelivr.com/v1/stats/packages?limit=${val.limit}&page=${val.page}`)
                .then((res: any) => {
                    context.commit('setPackages', res.data)
                    context.commit('setPackagesError', '')
                })
                .catch((res: any) => {
                    context.commit('setPackages', [])
                    context.commit('setPackagesError', res.message)
                })
        },
        searchPackages(context: any) {
            axios.get(`https://data.jsdelivr.com/v1/stats/packages?limit=150`)
                .then((res: any) => {
                    context.commit('setPackages', res.data)
                    context.commit('setPackagesError', '')
                })
                .catch((res: any) => {
                    context.commit('setPackages', [])
                    context.commit('setPackagesError', res.message)
                })
        },
        getPackageInfo(context: any, val: any) {
            // get version
            context.commit('setPackageInfoName', val.name)
            axios.get(`https://data.jsdelivr.com/v1/package/${val.type}/${val.name}`)
                .then((res: any) => {
                    const version = res.data.versions[0]

                    context.commit('setPackageInfoLink', `https://data.jsdelivr.com/v1/package/${val.type}/${val.name}@${version}`)
                    context.commit('setPackageInfoError', '')
                    // get info
                    axios.get(`https://data.jsdelivr.com/v1/package/${val.type}/${val.name}@${version}`)
                        .then((res: any) => {
                            // :( for-while
                             const base = res.data.files.map((item: any, inx: number) => {
                                 return {
                                     id: inx + 1,
                                     name: item.name,
                                     type: item.type,
                                     children:item.files ? item.files.map((item: any, inx: number) => {
                                         return {
                                             id: inx + 1,
                                             name: item.name,
                                             type: item.type,
                                             children: item.files ? item.files.map((item: any, inx: number) => {
                                                 return {
                                                     id: inx + 1,
                                                     name: item.name,
                                                     type: item.type,
                                                     children: item.files ? item.files : null,
                                                 }
                                             }): null
                                         }
                                     }): null
                                }
                            })
                            context.commit('setPackageInfo', base)
                        })
                        .catch(() => {
                            context.commit('setPackageInfoError', 'Oops... Not found :(')
                        })
                })
                .catch(() => {
                    context.commit('setPackageInfoError', 'Oops... Not found :(')
                })
        }
    },
    modules: {},
};

export default new Vuex.Store<RootState>(store);