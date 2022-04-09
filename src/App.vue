<template>
  <v-app>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="#efefef" text v-bind="attrs" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed: {
    snackbar() {
      return this.$store.state.snackbar.snackbar;
    },
  },
};
</script>
