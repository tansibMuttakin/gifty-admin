<template>
  <div class="p-grid">
    <div class="p-col-12">
      <Toast />
      <Card>
        <template #title> Login </template>
        <template #content>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Email</label>
            <InputText
              v-model="email"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Password</label>
            <InputText
              v-model="password"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-check" label="Signin" @click="signin()" />
          <!-- <p class="p-my-3">
            Don't have an account?
            <router-link to="/register"><b>Register here.</b></router-link>
          </p> -->
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import db from "../db";
export default {
  data() {
    return {
      email: "",
      password: "",
      users: [],
    };
  },
  mounted() {},
  methods: {
    async signin() {
      if (this.user == "" || this.password == "") {
        return this.$toast.add({
          severity: "error",
          summary: "Unsuccessful",
          detail: "You must provide valid credential",
          life: 3000,
        });
      }
      let admins = await db.collection("admins").get();
      admins.forEach((doc)=>{
        let id = doc.id;
        let data = {id,...doc.data()};
        this.users.push(data);
      });
      this.users.forEach((user) => {
        if (user.email == this.email && user.password == this.password) {
          let uid = user.id;
          let loggedinUser=true;
          window.localStorage.setItem('loggedinUser',JSON.stringify(loggedinUser));
          window.localStorage.setItem('uid',JSON.stringify(uid));
          this.$router.push('/');
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Unsuccessful",
            detail: "Wrong credentials",
            life: 3000,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.p-grid {
  background-image: url("https://images.unsplash.com/photo-1453834190665-46ff0a1fbd5a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lmdCUyMGJveHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  align-items: center;
  margin: 0;
}
.p-card {
  padding: 2em 3em;
  width: 40%;
  margin: auto;
}
.p-inputtext {
  width: 100%;
}
</style>
