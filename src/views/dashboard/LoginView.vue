<template>
  <v-app>
    <section class="contain">
      <v-card elevation="2" outlined shaped tile max-width="700" min-width="400">
        <v-card-text class="login">
          <h2 class="text-center mb-3">Login</h2>
          <h4 class="mb-5">Dashboard of restauran app</h4>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="user.email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
              type="password"
              v-model="user.password"
              :rules="passwordRules"
              label="Password"
              required
            ></v-text-field>

            <v-checkbox v-model="user.remember" label="Remember me?" required></v-checkbox>

            <v-btn :disabled="!valid" color="success" class="mr-4" @click="login"> Login </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </section>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    user: {
      email: '',
      password: '',
      remember: false,
    },
    name: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 6) || 'Password must be greater than 6 characters',
    ],
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
  }),
  created() {
    if (this.$store.state.user) {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch('login', this.user)
          .then((respose) => {
            this.$store.commit('updateUser', respose.data.payload);
            localStorage.setItem('user', JSON.stringify(respose.data.payload));
            this.$store.dispatch('snackbar/success', respose.data.msg);
            this.$router.push('/dashboard');
          })
          .catch((error) => {
            this.$store.dispatch('snackbar/error', error.response.data.msg);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contain {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .login {
    padding: 30px;
  }

  h2 {
    font-size: 36px;
  }

  @media (max-width: 575.98px) {
    .v-card {
      width: 90% !important;
      min-width: auto !important;
    }
  }
}
</style>
