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
              :disabled="!selectedOrders || !selectedOrders.length"
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
          :value="orders"
          :paginator="true"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          v-model:selection="selectedOrders"
          v-model:filters="filters"
          filterDisplay="menu"
          :loading="loading"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          :globalFilterFields="['orderId', 'name', 'status', 'phone']"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="p-d-flex p-jc-between p-ai-center">
              <h5 class="p-m-0">Orders</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </div>
          </template>
          <template #empty> No Orders found. </template>
          <template #loading> Loading orders data. Please wait. </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="orderId"
            header="Order-Id"
            sortable
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              {{ data.orderId }}
            </template>
          </Column>
          <Column
            field="name"
            header="Name"
            sortable
            dataType="text"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> {{ data.name }} </template>
          </Column>
          <Column
            field="address"
            header="Address"
            sortable
            dataType="text"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> {{ data.address }} </template>
          </Column>
          <Column
            field="phone"
            header="Phone"
            sortable
            dataType="text"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> {{ data.phone }} </template>
          </Column>
          <Column
            field="date"
            header="Date"
            sortable
            dataType="text"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> {{ data.deliveryDate }} </template>
          </Column>
          <Column
            field="status"
            header="Status"
            sortable
            dataType="text"
            style="min-width: 8rem"
          >
            <template #body="{ data }">
              <span :class="data.pending? 'p-badge-danger':'p-badge-success'">{{
                data.pending ? "Pending" : "Delivered"
              }}</span>
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <div class="p-d-flex">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-success p-mr-2"
                  @click="viewOrder(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeleteOrder(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- <Dialog
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
                :minFractionDigits="1"
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
        </Dialog> -->

        <!-- single product delete modal -->
        <Dialog
          v-model:visible="deleteOrderDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span v-if="order"
              >Are you sure you want to delete orderId- <b>{{ order.orderId }}</b> by <b>{{order.name}}</b> ?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteOrderDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteOrder"
            />
          </template>
        </Dialog>

        <!-- multiple product delete modal -->
        <!-- <Dialog
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
        </Dialog> -->
      </div>
    </div>
  </div>
</template>

<script>
import db from "../db";
import { FilterMatchMode, FilterOperator } from "primevue/api";
export default {
  data() {
    return {
      orders: [],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      },
      order:{},
      deleteOrderDialog : false,
      loading: true,
    };
  },
  async created() {
    let orders = await db.collection("orders").get("orders");
    orders.forEach((doc) => {
      let id = doc.id;
      let data = { id, ...doc.data() };
      this.orders.push(data);
      this.loading = false;
      console.log(doc.data());
    });
  },
  methods: {
    viewOrder(order) {
      let id = order.id;
      this.$router.push({ name: "orderView", params: { id } });
    },
    confirmDeleteOrder(order){
      this.order = order;
      this.deleteOrderDialog = true;
      console.log(this.order);
    },
    deleteOrder(){
      let index = this.orders.findIndex((obj) => obj.id == this.order.id);
      this.orders.splice(index, 1);
      db.collection("orders")
        .doc(this.order.id)
        .delete()
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Order deleted",
            life: 3000,
          });
          this.deleteOrderDialog = false;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "danger",
            summary: "Unsuccessful",
            detail: `${error}`,
            life: 3000,
          });
        });
    }
  },
};
</script>

<style lang="scss" scoped>
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
</style>