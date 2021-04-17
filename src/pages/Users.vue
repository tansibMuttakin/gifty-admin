<template>
  <div class="p-grid crud-demo">
    <div class="p-col-12">
      <div class="card">
        <Toast />
        <Toolbar class="p-mb-4">
          <template v-slot:left>
            <Button
              label="New"
              icon="pi pi-plus"
              class="p-button-success p-mr-2"
              @click="openNew()"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              class="p-button-danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedUsers || !selectedUsers.length"
            />
          </template>

          <template v-slot:right>
            <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              label="Import"
              chooseLabel="Import"
              class="p-mr-2 p-d-inline-block"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <DataTable
          :value="users"
          :paginator="true"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          v-model:selection="selectedUsers"
          v-model:filters="filters"
          filterDisplay="menu"
          :loading="loading"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          :globalFilterFields="[
            'fullName',
            'email',
            'address',
            'phone',
            'status',
          ]"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="p-d-flex p-jc-between p-ai-center">
              <h5 class="p-m-0">Users</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </div>
          </template>
          <template #empty> No users found. </template>
          <template #loading> Loading users data. Please wait. </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="fullName"
            header="Name"
            sortable
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              {{ data.fullName }}
            </template>
          </Column>
          <Column
            field="imgUrl"
            header="Image"
            style="min-width: 10rem"
            sortable
          >
            <template #body="{ data }">
              <img
                :src="
                  data.imgUrl
                    ? data.imgUrl
                    : 'assets/layout/images/product/product-placeholder.svg'
                "
                width="60"
                class="product-image"
              />
            </template>
          </Column>
          <Column
            field="email"
            header="Email"
            sortable
            filterMatchMode="contains"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <span>{{ data.email ? data.email : "N/A" }}</span>
            </template>
          </Column>
          <Column
            field="phone"
            header="Phone"
            sortable
            dataType="numeric"
            style="min-width: 8rem"
          >
            <template #body="{ data }">
              {{ data.phone ? data.phone : "N/A" }}
            </template>
          </Column>
          <Column
            field="address"
            header="Address"
            sortable
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 10rem"
          >
            <template #body="{ data }">{{
              data.address ? data.address : "N/A"
            }}</template>
          </Column>
          <Column
            field="status"
            header="Status"
            sortable
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 10rem"
          >
            <template #body="{ data }"
              ><span
                :class="
                  data.status == 'enable' ? 'p-badge-success' : 'p-badge-danger'
                "
                >{{ data.status }}</span
              ></template
            >
          </Column>
          <Column>
            <template #body="slotProps">
              <div class="p-d-flex">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success p-mr-2"
                  @click="editUser(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeleteUser(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="userDialog"
          :style="{ width: '450px' }"
          header="User Details"
          :modal="true"
          class="p-fluid"
        >
          <img
            :src="
              user.imgUrl
                ? user.imgUrl
                : 'assets/layout/images/product/product-placeholder.svg'
            "
            :alt="user.fullName"
            class="product-image"
            v-if="update"
          />
          <div class="p-field">
            <label for="fullName">FullName</label>
            <InputText
              id="fullName"
              v-model.trim="user.fullName"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !user.fullName }"
            />
            <small class="p-invalid" v-if="submitted && !user.fullName"
              >Name is required.</small
            >
          </div>
          <div class="p-field">
            <label for="">Upload image</label>
            <div class="p-d-flex p-jc-between">
              <input ref="newImage" type="file" @change="previewImage" />
              <img :src="image.url" :alt="image.name" width="60" />
            </div>
          </div>
          <div class="p-field">
            <label for="description">Address</label>
            <Textarea
              id="description"
              v-model="user.address"
              required="true"
              rows="3"
              cols="20"
              :autoResize="true"
            />
          </div>

          <div class="p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="price">Email</label>
              <InputText id="email" v-model="user.email" />
            </div>
            <div class="p-field p-col">
              <label for="quantity">Phone</label>
              <InputText id="quantity" v-model="user.phone" />
            </div>
          </div>
          <div v-if="update" class="p-formgrid p-grid">
            <div class="p-field p-col-6">
              <label for="quantity">Status</label>
              <Dropdown
                v-model="selectedStatus"
                :options="status"
                optionLabel="name"
                optionValue="value"
              />
            </div>
          </div>
          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="p-button-text"
              @click="update ? updateUser() : saveUser()"
            />
          </template>
        </Dialog>

        <!-- single product delete modal -->
        <Dialog
          v-model:visible="deleteUserDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span v-if="user"
              >Are you sure you want to delete <b>{{ user.fullName }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteUserDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteUser"
            />
          </template>
        </Dialog>

        <!-- multiple product delete modal -->
        <Dialog
          v-model:visible="deleteSelectedUsersDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span v-if="user"
              >Are you sure you want to delete the selected users?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteSelectedUsersDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedUsers"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "../firebase";
import db from "../db";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { server } from "../helper";
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      userDialog: false,
      users: [],
      latestUsers: [],
      update: false,
      image: {},
      selectedStatus: "",
      deleteUserDialog: false,
      deleteSelectedUsersDialog: false,
      selectedUsers: null,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      },
      loading: true,
      status: [
        { name: "Enable", value: "enable" },
        { name: "Disable", value: "disable" },
      ],
    };
  },
  mounted() {
    db.collection("users").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        let data = { id, ...doc.data() };
        this.latestUsers.push(data);
        this.users = this.latestUsers;
      });
      this.latestUsers = [];
      this.loading = false;
    });
  },
  methods: {
    openNew() {
      this.user = {};
      this.submitted = false;
      this.userDialog = true;
    },
    hideDialog() {
      this.userDialog = false;
      this.submitted = false;
      if (this.update) {
        this.update = false;
      }
      this.image = {};
    },
    previewImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          this.image.url = reader.result;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    uploadImage() {
      const file = this.$refs.newImage.files[0];
      if (file) {
        this.user.imageName = file.name;
        let storageRef = firebase.storage().ref();
        let uploadTask = storageRef.child("users/" + file.name).put(file);
        uploadTask.on(
          "state_changed",
          () => {},
          function (error) {
            // Handle unsuccessful uploads
            console.log(error);
          },
          async () => {
            let downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            this.user.imgUrl = downloadURL;
            console.log("should execute before");
          }
        );
      }
    },
    async saveUser() {
      let uid = "";
      this.submitted = true;
      this.user.status = "enable";
      if (this.user.fullName.trim()) {
        this.uploadImage();
        console.log("should execute after");
        console.log(this.user.imgUrl);
        this.user.created = firebase.firestore.Timestamp.now();
        this.users.push(this.user);
        console.log(this.user);

        // save user to firebase auth
        try {
          let userCredential = await firebase
            .auth()
            .createUserWithEmailAndPassword(this.user.email, "password");
          // Signed in
          let user = userCredential.user;
          uid = user.uid;
          console.log(user + "=>" + uid);
        } catch (error) {
          console.log(error);
        }

        // save user to firestore
        try {
          await db.collection("users").doc(uid).set(this.user);
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "User Created",
            life: 3000,
          });

          this.userDialog = false;
          this.user = {};
          this.image = {};
        } catch (error) {
          console.log(error);
        }
      }
    },
    async updateUser() {
      this.loading = true;
      let { id, ...data } = this.user;
      let index = this.users.findIndex((obj) => obj.id == id);
      this.user.update = firebase.firestore.Timestamp.now();
      this.users[index] = data;
      this.userDialog = false;
      this.uploadImage();
      try {
        if (this.selectedStatus == "enable") {
          this.user.status = "enable";
          await axios.get(`${server.baseURL}/api/user/enable/${this.user.id}`);
        } else if (this.selectedStatus == "disable") {
          this.user.status = "disable";
          await axios.get(`${server.baseURL}/api/user/disable/${this.user.id}`);
        }
      } catch (error) {
        console.log(error);
      }

      try {
        await db.collection("users").doc(this.user.id).update(this.user);
        this.loading = false;
        this.selectedStatus = "";
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "User Updated",
          life: 3000,
        });
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    editUser(user) {
      this.user = { ...user };
      this.selectedStatus = user.status;
      this.update = true;
      this.userDialog = true;
    },
    confirmDeleteUser(user) {
      this.user = user;
      this.deleteUserDialog = true;
    },
    confirmDeleteSelected() {
      this.deleteSelectedUsersDialog = true;
    },
    async deleteUser() {
      let index = this.users.findIndex((obj) => obj.id == this.user.id);
      this.users.splice(index, 1);
      try {
        // if (this.user.imgUrl) {
        //   let fileName = this.user.imgUrl
        //   console.log(fileName);
        //   // Create a reference to the file to delete
        //   let storageRef = firebase.storage().ref();
        //   let desertRef = storageRef.child("users/" + fileName);
        //   await desertRef.delete();
        // }

        await axios.delete(`${server.baseURL}/api/user/delete/${this.user.id}`);
        await db.collection("users").doc(this.user.id).delete();
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "User deleted",
          life: 3000,
        });
        this.deleteUserDialog = false;
      } catch (error) {
        this.$toast.add({
          severity: "danger",
          summary: "Unsuccessful",
          detail: `${error}`,
          life: 3000,
        });
      }
    },
    deleteSelectedUsers() {
      this.deleteSelectedUsersDialog = false;
      this.loading = true;
      this.users = this.users.filter(
        (val) => !this.selectedUsers.includes(val)
      );

      this.selectedUsers.forEach(async (val) => {
        try {
          await axios.delete(`${server.baseURL}/api/user/delete/${val.id}`);
          await db.collection("users").doc(val.id).delete();
          this.$toast.add({
            severity: "success",
            summary: " Delete successful",
            life: 3000,
          });
        } catch (error) {
          this.$toast.add({
            severity: "danger",
            summary: "Unsuccessful",
            detail: `${error}`,
            life: 3000,
          });
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.p-badge-danger {
  background: red;
  padding: 5px;
  color: white;
}
.p-badge-success {
  background: rgb(68, 143, 78);
  padding: 5px;
  color: white;
}
.table-header {
  display: flex;
  justify-content: space-between;
}

.product-image {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;

  &.status-instock {
    background: #c8e6c9;
    color: #256029;
  }

  &.status-outofstock {
    background: #ffcdd2;
    color: #c63737;
  }

  &.status-lowstock {
    background: #feedaf;
    color: #8a5340;
  }
}

::v-deep(.p-toolbar) {
  flex-wrap: wrap;
  .p-button {
    margin-bottom: 0.25rem;
  }
}
</style>
