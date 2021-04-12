<template>
  <div class="layout-profile">
    <div>
      <img src="assets/layout/images/profile.png" alt="" />
    </div>
    <button class="p-link layout-profile-link" @click="onClick">
      <span class="username">Tansib-Al-Muhaimin</span>
      <i class="pi pi-fw pi-cog"></i>
    </button>
    <transition name="layout-submenu-wrapper">
      <ul v-show="expanded">
        <router-link to="/accounts">
          <li>
            <button class="p-link">
              <i class="pi pi-fw pi-user"></i><span>Account</span>
            </button>
          </li>
        </router-link>
        <li>
          <button class="p-link">
            <i class="pi pi-fw pi-inbox"></i><span>Notifications</span
            ><span class="menuitem-badge">2</span>
          </button>
        </li>
        <li>
          <button class="p-link" @click="logout()">
            <i class="pi pi-fw pi-power-off"></i><span>Logout</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    onClick(event) {
      this.expanded = !this.expanded;
      event.preventDefault();
    },
    logout(){
      window.localStorage.removeItem('loggedinUser');
      window.localStorage.removeItem('uid');
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
</style>