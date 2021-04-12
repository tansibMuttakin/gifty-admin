<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button" @click="onMenuToggle">
      <span class="pi pi-bars"></span>
    </button>
    <div class="layout-topbar-icons">
      <span class="layout-topbar-search">
        <InputText type="text" style="width: 20em" placeholder="Search" />
        <span class="layout-topbar-search-icon pi pi-search"></span>
      </span>
      <button
        class="p-link"
        type="button"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="overlay_tmenu"
      >
        <span class="layout-topbar-item-text">Settings</span>
        <span class="layout-topbar-icon pi pi-cog"></span>
      </button>
      <TieredMenu id="overlay_tmenu" ref="menu" :model="items" :popup="true" />
      <button class="p-link" @click="logout()">
        <span class="layout-topbar-icon pi pi-fw pi-power-off"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { label: "account", icon: "pi pi-fw pi-user", to: "/accounts" },
        { label: "notification", icon: "pi pi-fw pi-inbox" },
      ],
    };
  },
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    logout(){
      window.localStorage.removeItem('loggedinUser');
      window.localStorage.removeItem('uid');
      this.$router.push('/login');
    }
  },
};
</script>

<style lang="scss" scoped>
.p-tieredmenu {
  width: max-content;
}
</style>