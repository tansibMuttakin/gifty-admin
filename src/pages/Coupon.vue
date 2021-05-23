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
        </Toolbar>

        <DataTable
          :value="coupons"
          :paginator="true"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          v-model:selection="selectedCoupons"
          v-model:filters="filters"
          filterDisplay="menu"
          :loading="loading"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          :globalFilterFields="['code', 'discount']"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="p-d-flex p-jc-between p-ai-center">
              <h5 class="p-m-0">Coupons</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </div>
          </template>
          <template #empty> No Coupons found. </template>
          <template #loading> Loading Coupons data. Please wait. </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <Column
            field="code"
            header="Code"
            sortable
            dataType="text"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> {{ data.code }} </template>
          </Column>
          <Column
            field="discount"
            header="Discount in %"
            sortable
            dataType="number"
            style="min-width: 8rem"
          >
            <template #body="{ data }"> {{ data.discount }} </template>
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
        <Dialog
          v-model:visible="couponDialog"
          :style="{ width: '450px' }"
          header="Coupons"
          :modal="true"
          class="p-fluid"
        >
          <div class="p-field">
            <label for="fullName">Coupon Code</label>
            <InputText
              id="code"
              v-model.trim="coupon.code"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !coupon.code }"
            />
            <small class="p-invalid" v-if="submitted && !coupon.code"
              >Code is required.</small
            >
          </div>

          <div class="p-formgrid p-grid">
            <div class="p-field p-col">
              <label for="price">Discount in %</label>
              <InputNumber id="discount" v-model="coupon.discount" />
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
              @click="update ? updateCoupon() : saveCoupon()"
            />
          </template>
        </Dialog>

        <!-- single product delete modal -->
        <!-- <Dialog
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
        </Dialog> -->

        <!-- multiple product delete modal -->
        <!-- <Dialog
          v-model:visible="deleteSelectedOrdersDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span v-if="selectedOrders"
              >Are you sure you want to delete the selected orders?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteSelectedOrdersDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedOrders"
            />
          </template>
        </Dialog> -->
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
      coupons: [],
      coupon: {
        code: "",
        discount: "",
      },
      couponDialog: false,
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
  methods: {
    openNew() {
      this.coupon = {};
      this.submitted = false;
      this.couponDialog = true;
    },
    hideDialog() {
      this.submitted = false;
      this.couponDialog = false;
    },
    async saveCoupon() {
      this.submitted = true;
      if (this.coupon.code.trim()) {
        this.coupon.created = firebase.firestore.Timestamp.now();
        this.coupons.push(this.coupon);

        // save product to firestore

        console.log(this.coupon);
        db.collection("coupons")
          .add(this.coupon)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Coupon Created",
              life: 3000,
            });
            this.couponDialog = false;
            this.coupon = {};
          });
      }
    },
  },
  async created() {
    let coupons = await db.collection("coupons").get("coupons");
    if (coupons.empty) {
      this.loading = false;
    } else {
      coupons.forEach((doc) => {
        let id = doc.id;
        let data = { id, ...doc.data() };
        this.coupons.push(data);
        this.loading = false;
        console.log(doc.data());
      });
    }
  },
};
</script>

<style>
</style>