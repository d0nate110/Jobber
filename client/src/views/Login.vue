<template>
  <div>
    <form action="/">
      <h1>Log in</h1>
      <div id="form">
        <div class= "mt-2">
          <input type="email" class="mt-3" id="email" placeholder="E-mail" v-model="data.email_address">
        </div>

        <div class= "mt-2">
          <input type="password" class="mt-3" id="pwd" placeholder="Password" v-model="data.password">
        </div>
      </div>
      <div>
      <b-button class="pb-2" variant="primary" v-on:click="freelancerLogin()" >Log in</b-button>
      </div>
    </form>
  </div>
</template>

<style scoped>
 .form-control {
    width: 25rem;
 }

 .col {
  margin-top: 30px;
  justify-content: center;
  display: flex;
}

.btn_message {
  width: 20rem;
  margin-top: 2rem;
}

 @media screen and (max-width: 768px) {
   .form-control {
    width: 20rem;
    }
    .btn_message {
      width: 20rem;
      margin-top: 2rem;
    }
 }
</style>

<script>
import FreelancersOps from '../freelancers_views/FreelancersOps'
export default {
  name: 'login',
  data() {
    return {
      data: {
        email_address: '',
        password: ''
      }
    }
  },
  methods: {
    freelancerLogin() {
      FreelancersOps.loginFreelancer(this.data)
        .then(response => {
          let token = response.data.token;
          localStorage.setItem("jwt", token);
          this.$toasted.show('Successfully logged in!')
          this.$router.push('/')
        })
        .catch(error => {
           this.$toasted.show('Login failed')
        });
    }
  }
}
</script>

<style>
  .form, #form {
    margin: auto;
    padding: 10px;
    width: 50%;
  }

  form {
    margin-top: 2em;
  }
</style>
