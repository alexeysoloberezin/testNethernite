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
    </v-col>

    <template v-if="error">
      <v-alert
          color="red"
          type="error"
      >{{ error }}</v-alert>
    </template>

    <template v-if="packages.length > 0">
      <v-simple-table >
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
          >
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.hits }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-divider style="margin: 20px 0 10px"></v-divider>

      <div class="text-center">
        <v-pagination
            v-model="page"
            :length="10"
        ></v-pagination>
      </div>
    </template>

    <v-sheet
        v-else-if="packages.length < 0"
        color="grey darken-4"
        class="pa-3"
    >
      <v-skeleton-loader
          class="mx-auto"
          max-width="100%"
          type="table"
      ></v-skeleton-loader>
    </v-sheet>
  </div>


</template>

<script >

export default {
  name: "Home",
  data() {
    return {
      property: '',
      page: 1,
      limit: 10,
      error: this.$store.state.error,
      packages: this.$store.state.packages,
    }
  },
  methods: {
    getPackages() {
      this.$store.dispatch('getPackages', {
        limit: this.limit,
        page: this.page
      })
    }
  },
  watch: {
    page: function (val){
      this.page = val
      this.getPackages()
    }
  },
  created() {
    this.getPackages()

    this.$store.subscribe(mutation => {
      if ( mutation.type === "setPackages" ) {
        this.packages = this.$store.state.packages
      }
    })
  }
};
</script>
