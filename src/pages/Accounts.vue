<template>
  <div class="p-grid">
    <div class="p-col-12">
      <Toast />
      <Card>
        <template #title> Reset password </template>
        <template #content>
          <div class="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Password</label>
            <InputText
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Confirm password</label>
            <InputText
              id="confirmPassword"
              type="password"
              placeholder="Password"
              v-model="confirmPassword"
            />
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-check" label="Update" @click="update()" />
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
      confirmPassword: "",
      uid: "",
    };
  },
  async created() {
    this.uid = JSON.parse(window.localStorage.getItem("uid"));
    let admins = await db.collection("admins").get();
    admins.forEach((doc) => {
      if (doc.id == this.uid) {
        this.email = doc.data().email;
      }
    });
  },
  methods: {
    async update() {
      if (this.password != "" && this.confirmPassword != "") {
        if (this.password === this.confirmPassword) {
          await db.collection("admins").doc(this.uid).update({
            email: this.email,
            password: this.password,
          });
          this.password = "";
          this.confirmPassword = "";
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "User Info Updated",
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Unsuccessful",
            detail: "Password does not match",
            life: 3000,
          });
        }
      }
      else{

        this.$toast.add({
          severity: "error",
          summary: "Unsuccessful",
          detail: "Password field is empty",
          life: 3000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.p-card {
  padding: 3em 5em;
}
.p-inputtext {
  width: 100%;
}
</style>
