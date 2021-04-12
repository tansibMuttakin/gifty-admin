<template>
  <div class="p-grid">
    <div class="p-col-12">
      <Card>
        <template #title> Register </template>
        <template #content>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="name" class="p-d-block p-my-2">FullName</label>
            <InputText id="name" type="text" placeholder="Name" />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="email" class="p-d-block p-my-2">Email</label>
            <InputText id="email" type="email" placeholder="Email" />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="address" class="p-d-block p-my-2">Address</label>
            <Textarea :autoResize="true" rows="5" cols="30" />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Password</label>
            <InputText id="password" type="password" placeholder="Password" />
          </div>
          <div class="p-col-12 p-mb-2 p-lg-12 p-mb-lg-0">
            <label for="" class="p-d-block p-my-2">Retype password</label>
            <InputText id="retypePassword" type="password" placeholder="Retype Password" />
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-check" label="Register" />
          <p class="p-my-3">Have an account already? <router-link to="/login"><b>Signin here.</b></router-link></p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
    mounted(){
        
    }
};
</script>

<style lang="scss" scoped>
.p-grid {
  background-image: url("https://images.unsplash.com/photo-1453834190665-46ff0a1fbd5a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lmdCUyMGJveHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80");
  background-repeat: no-repeat;
  background-size:cover;
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
