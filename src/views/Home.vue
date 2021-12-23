<template>
  <div class="container">
    <v-col
        cols="12"
        sm="6"
        md="3"
    >
      <v-text-field
          label="Search"
          v-model="property"
          outlined
      ></v-text-field>
      <v-alert
          dense
          v-if="property && packages.length === 0"
          type="warning"
      >Nothing found
      </v-alert>
    </v-col>

    <template v-if="error">
      <v-alert
          color="red"
          type="error"
      >{{ error }}
      </v-alert>
    </template>

    <v-simple-table v-if="packages.length > 0">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Type
          </th>
          <th class="text-left">
            Hits
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in packages"
            :key="item.name"
            @click="getPackageInfo(item.type, item.name)"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.hits }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider style="margin: 20px 0 10px"></v-divider>

    <div class="text-center" v-if="!property">
      <v-pagination
          v-model="page"
          :length="10"
      ></v-pagination>
    </div>

    <v-sheet
        v-if="packages.length < 0"
        color="grey darken-4"
        class="pa-3"
    >
      <v-skeleton-loader
          class="mx-auto"
          max-width="100%"
          type="table"
      ></v-skeleton-loader>
    </v-sheet>

    <div class="text-center">
      <v-overlay :value="overlay" @click="closeOverlay">
        <div class="close" @click="closeOverlay">
          <v-btn
              color="darken-4 btn-close"
              fab
              x-small
              dark
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card
            v-if="!packageInfoError"
            class="card"
            elevation="2"
            style="padding: 40px 40px 40px 40px"
        >
          <h2 style="text-align: center; width: 100%;">{{ packageInfoName }}</h2>
          <a style="display: block;text-align: center; width: 100%;margin-bottom: 10px" :href="packageInfoLink">{{ packageInfoLink }}</a>
          <template v-if="packageInfo.length !== 0">
            <v-treeview
                v-model="tree"
                :open="['public']"
                :items="packageInfo"
                activatable
                item-key="name"
                open-on-click
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.type === 'directory'">
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                  mdi-file
                </v-icon>
              </template>
            </v-treeview>
          </template>
          <v-progress-circular
              v-else
              indeterminate
              color="primary"
          ></v-progress-circular>
        </v-card>
        <v-card
            v-else
            class="card"
            elevation="2"
            style="padding: 40px 40px 40px 40px"
        >
          <v-alert
              dense
              outlined
              type="error"
          >
            {{ packageInfoError }}
          </v-alert>

        </v-card>
      </v-overlay>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      property: '',
      page: 1,
      limit: 10,
      error: this.$store.state.error,
      packages: this.$store.getters.getPackages,
      getPackageInfoLoader: false,
      packageInfo: [],
      packageInfoName: this.$store.state.packageInfoName,

      packageInfoLink: this.$store.state.packageInfoLink,
      overlay: false,
      tree: [],
      packageInfoError: '',
    }
  },
  methods: {
    getPackages() {
      this.$store.dispatch('getPackages', {
        limit: this.limit,
        page: this.page
      })
    },
    getPackageInfo(type, name) {
      this.packageInfo = []
      this.overlay = true
      this.getPackageInfoLoader = true
      this.packageInfoLink = ''
      this.packageInfoError = ''
      this.$store.dispatch('getPackageInfo', {
        type: type,
        name: name
      })
    },
    closeOverlay(e) {
      if (e.target.classList.contains('v-overlay__scrim')
          || e.target.classList.contains('mdi-close')
          || e.target.classList.contains('btn-close')
          || e.target.classList.contains('close')
      ) {
        this.overlay = false
      }
    }
  },
  watch: {
    page(val) {
      this.page = val
      this.getPackages()
    },
    property(val) {
      this.property = val
      this.$store.commit('setPackagesFilter', this.property)
    },
  },
  created() {
    this.getPackages()

    this.$store.subscribe(mutation => {
      if (mutation.type === "setPackages" || mutation.type === "setPackagesFilter") {
        this.packages = this.$store.getters.getPackages
      }
      if (mutation.type === "setPackagesError") {
        this.error = this.$store.state.error
      }
      if (mutation.type === "setPackageInfo") {
        this.packageInfo = this.$store.state.packageInfo
        this.getPackageInfoLoader = false
      }
      if (mutation.type === "setPackageInfoName") {
        this.packageInfoName = this.$store.state.packageInfoName
      }
      if (mutation.type === "setPackageInfoLink") {
        this.packageInfoLink = this.$store.state.packageInfoLink
      }
      if (mutation.type === "setPackageInfoError") {
        this.packageInfoError = this.$store.state.packageInfoError
        this.getPackageInfoLoader = false
      }
    })
  }
};
</script>

<style lang="scss">
.close {
  position: absolute;
  z-index: 1000;
  top: 5px;
  right: 5px;
}

.card {
  position: relative;
  min-width: 800px;

  * {
    text-align: left;
    list-style: none;
  }

  .v-treeview-node__children {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    margin: 5px 15px;
    padding-bottom: 5px;
  }
}
@media (max-width: 900px) {
  .card{
    min-width: 95%;
    padding: 35px 10px !important;
  }
}
.tree {
  padding-left: 0;

  li {
    margin-bottom: 4px;
  }

  ul {

  }
}

.v-overlay__content {
  height: 100%;
  margin-top: 30px;
  overflow-y: auto;
  &::-webkit-scrollbar{
    width: 5px;
    background: none;
  }
  &::-webkit-scrollbar-thumb{
    width: 5px;
    background: #2a2a2a;
  }
}
</style>