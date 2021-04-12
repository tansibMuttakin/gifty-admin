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
              :disabled="!selectedProducts || !selectedProducts.length"
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
          :value="products"
          :paginator="true"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          v-model:selection="selectedProducts"
          v-model:filters="filters"
          filterDisplay="menu"
          :loading="loading"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          :globalFilterFields="['title', 'category', 'type', 'rating', 'price']"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="p-d-flex p-jc-between p-ai-center">
              <h5 class="p-m-0">Products</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </div>
          </template>
          <template #empty> No products found. </template>
          <template #loading> Loading products data. Please wait. </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="title"
            header="Title"
            sortable
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              {{ data.title }}
            </template>
          </Column>
          <Column
            field="thumbnail"
            header="Thumbnail"
            style="min-width: 10rem"
            sortable
          >
            <template #body="{ data }">
              <img
                :src="
                  data.thumbnail
                    ? data.thumbnail
                    : 'assets/layout/images/product/product-placeholder.svg'
                "
                width="60"
                class="product-image"
              />
            </template>
          </Column>
          <Column
            field="category"
            header="Category"
            sortable
            filterMatchMode="contains"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <span>{{ data.category }}</span>
            </template>
          </Column>
          <Column
            field="type"
            header="Type"
            sortable
            filterField="representative"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              <span>{{ data.type }}</span>
            </template>
          </Column>
          <Column
            field="price"
            header="Price"
            sortable
            dataType="numeric"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> ${{ data.price }} </template>
          </Column>
          <Column
            field="rating"
            header="Rating"
            sortable
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              <span class="p-column-title">Rating</span>
              <Rating
                :modelValue="data.rating"
                :readonly="true"
                :cancel="false"
              />
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <div class="p-d-flex">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success p-mr-2"
                  @click="editProduct(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeleteProduct(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="Product Details"
          :modal="true"
          class="p-fluid"
        >
          <img
            :src="
              product.thumbnail
                ? product.thumbnail
                : 'assets/layout/images/product/product-placeholder.svg'
            "
            :alt="product.image"
            class="product-image"
            v-if="update"
          />
          <div class="p-field">
            <label for="title">Title</label>
            <InputText
              id="title"
              v-model.trim="product.title"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.title }"
            />
            <small class="p-invalid" v-if="submitted && !product.title"
              >Title is required.</small
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
            <label for="description">Description</label>
            <Textarea
              id="description"
              v-model="product.description"
              required="true"
              rows="3"
              cols="20"
            />
          </div>

          <div class="p-field">
            <label class="p-mb-3">Category</label>
            <div class="p-formgrid p-grid">
              <div class="p-field-radiobutton p-col-6">
                <RadioButton
                  id="category1"
                  name="category"
                  value="Lilies"
                  v-model="product.category"
                />
                <label for="category1">Lilies</label>
              </div>
              <div class="p-field-radiobutton p-col-6">
                <RadioButton
                  id="category2"
                  name="category"
                  value="Chocolate"
                  v-model="product.category"
                />
                <label for="category2">Chocolate</label>
              </div>
              <div class="p-field-radiobutton p-col-6">
                <RadioButton
                  id="category3"
                  name="category"
                  value="Teddy Bear"
                  v-model="product.category"
                />
                <label for="category3">Teddy Bear</label>
              </div>
              <div class="p-field-radiobutton p-col-6">
                <RadioButton
                  id="category4"
                  name="category"
                  value="toys"
                  v-model="product.category"
                />
                <label for="category4">Toys</label>
              </div>
            </div>
          </div>

          <div class="p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="price">Price</label>
              <InputNumber
                id="price"
                v-model="product.price"
                mode="currency"
                currency="USD"
                locale="en-US"
                :minFractionDigits="2"
              />
            </div>
            <div class="p-field p-col">
              <label for="quantity">Quantity</label>
              <InputNumber
                id="quantity"
                v-model="product.quantity"
                integeronly
              />
            </div>
            <div v-if="update" class="p-field p-col">
              <label for="rating">Rating</label>
              <InputNumber
                id="rating"
                v-model="product.rating"
                mode="decimal"
              />
            </div>
          </div>
          <div class="p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="quantity">Weight(g)</label>
              <InputNumber
                id="weight"
                v-model="product.weight"
                mode="decimal"
                :minFractionDigits="2"
              />
            </div>
            <div class="p-field p-col">
              <label for="type">Type</label>
              <InputText
                id="type"
                v-model.trim="product.type"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.type }"
              />
            </div>
            <div class="p-field p-col">
              <label for="genere">Genere</label>
              <InputText
                id="genere"
                v-model.trim="product.generecs"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.genere }"
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
              @click="update ? updateProduct() : saveProduct()"
            />
          </template>
        </Dialog>

        <!-- single product delete modal -->
        <Dialog
          v-model:visible="deleteProductDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ product.title }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteProduct"
            />
          </template>
        </Dialog>

        <!-- multiple product delete modal -->
        <Dialog
          v-model:visible="deleteSelectedProductsDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span v-if="product"
              >Are you sure you want to delete the selected products?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteSelectedProductsDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedProducts"
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

export default {
  data() {
    return {
      product: {},
      productDialog: false,
      products: [],
      latestProducts: [],
      update: false,
      image: {},
      deleteProductDialog: false,
      deleteSelectedProductsDialog: false,
      selectedProducts: null,
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
    };
  },
  mounted() {
    db.collection("products").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        let data = { id, ...doc.data() };
        this.latestProducts.push(data);
        this.products = this.latestProducts;
      });
      this.latestProducts = [];
      this.loading = false;
    });
  },
  methods: {
    openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.submitted = false;
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
    async uploadImage() {
      const file = this.$refs.newImage.files[0];
      if (file) {
        let storageRef = firebase.storage().ref();
        let uploadTask = storageRef.child(file.name).put(file);
        await uploadTask.on(
          "state_changed",
          () => {},
          function (error) {
            // Handle unsuccessful uploads
            console.log(error);
          },
          async () => {
            console.log("should execute before");
            let downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {});
            this.product.thumbnail = downloadURL;
          }
        );
      }
    },
    async saveProduct() {
      this.submitted = true;
      if (this.product.title.trim()) {
        this.uploadImage();
        console.log("after this");

        console.log(this.product.thumbnail);

        this.product.rating = 0;
        this.product.created = firebase.firestore.Timestamp.now();
        this.products.push(this.product);

        // save product to firestore

        console.log(this.product);
        db.collection("products")
          .add(this.product)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Product Created",
              life: 3000,
            });
            this.productDialog = false;
            this.product = {};
            this.image = {};
          });
      }
    },
    updateProduct() {
      let { id, ...data } = this.product;
      let index = this.products.findIndex((obj) => obj.id == id);
      this.product.update = firebase.firestore.Timestamp.now();
      this.products[index] = data;
      this.productDialog = false;

      db.collection("products")
        .doc(this.product.id)
        .update(this.product)
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Updated",
            life: 3000,
          });
        });
    },
    editProduct(product) {
      this.product = { ...product };
      this.update = true;
      this.productDialog = true;
    },
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductDialog = true;
    },
    confirmDeleteSelected() {
      this.deleteSelectedProductsDialog = true;
    },
    deleteProduct() {
      let index = this.products.findIndex((obj) => obj.id == this.product.id);
      this.products.splice(index, 1);
      db.collection("products")
        .doc(this.product.id)
        .delete()
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product deleted",
            life: 3000,
          });
          this.deleteProductDialog = false;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "danger",
            summary: "Unsuccessful",
            detail: `${error}`,
            life: 3000,
          });
        });
    },
    deleteSelectedProducts() {
      this.products = this.products.filter(
        (val) => !this.selectedProducts.includes(val)
      );
      this.selectedProducts.forEach((val) => {
        db.collection("products").doc(val.id).delete();
      });
      this.deleteSelectedProductsDialog = false;
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products deleted",
        life: 3000,
      });
    },
  },
};
</script>

<style scoped lang="scss">
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
