<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout" class="logout()">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Logout'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <section class="content">
        <router-view></router-view>
      </section>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>
        <a href="https://eslamfathy.netlify.app/">HaBsawy</a>
        &copy; {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/dashboard',
        },
        {
          icon: 'mdi-home',
          title: 'Categories',
          to: '/dashboard/categories',
        },
        {
          icon: 'mdi-home',
          title: 'Products',
          to: '/dashboard/products',
        },
      ],
      title: 'Restaurant App',
    };
  },
  created() {
    if (!this.$store.state.user) {
      this.$router.push('/dashboard/login');
    }
  },
  methods: {
    logout() {
      this.$store
        .dispatch('logout')
        .then((respose) => {
          this.$store.commit('updateUser', null);
          localStorage.removeItem('user');
          this.$store.dispatch('snackbar/success', respose.data.msg);
          this.$router.push('/dashboard/login');
        })
        .catch((error) => {
          if (error.response.data.statusCode === 401) {
            this.$store.commit('updateUser', null);
            localStorage.removeItem('user');
            this.$router.push('/dashboard/login');
          }
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 50px 20px;
}

.logout {
  cursor: pointer;
}
</style>
