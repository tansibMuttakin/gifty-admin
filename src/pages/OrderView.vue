<template>
  <div>
    <Toast />
    <Card v-if="loading">
      <template #content>
        <div class="p-text-center">
          <i
            class="pi pi-spin pi-spinner"
            style="fontsize: 2rem"
            v-if="true"
          ></i>
        </div>
      </template>
    </Card>
    <Card v-else>
      <template #title>ORDER ID- {{ orderId }} </template>
      <template #content>
        <div class="p-d-flex p-jc-between p-mb-3">
          <div class="recieverInfo">
            <h4 class="p-text-bold">Reciever Info:</h4>
            <p>
              Name: <span class="p-text-bold">{{ order.name }}</span>
            </p>
            <p>
              Address: <span class="p-text-bold">{{ order.address }}</span>
            </p>
            <p>
              Phone: <span class="p-text-bold">{{ order.phone }}</span>
            </p>
          </div>
          <div class="senderInfo">
            <h4 class="p-text-bold">Sender Info:</h4>
            <p>
              Name:
              <span class="p-text-bold">{{
                !order.sendAnonymous ? order.senderName : "Anonymous Sender"
              }}</span>
            </p>
            <p>
              Email:
              <span class="p-text-bold">{{
                !order.sendAnonymous ? order.senderEmail : "Anonymous Sender"
              }}</span>
            </p>
            <p>
              Phone:
              <span class="p-text-bold">{{
                !order.sendAnonymous ? order.senderPhone : "Anonymous Sender"
              }}</span>
            </p>
          </div>
        </div>
        <div class="orderInfo p-my-5">
          <h4 class="p-text-bold">Order Info:</h4>
          <p>
            Total items:
            <span class="p-text-bold">{{ orderItems.length }}</span>
          </p>
          <p>
            Total Price: <span class="p-text-bold">${{ getTotalPrice }}</span>
          </p>
          <p>
            Order created at:
            <span class="p-text-bold">{{ orderCreateDate }}</span>
          </p>
          <p>
            Delivery Date:
            <span class="p-text-bold">{{ order.deliveryDate }}</span>
          </p>
          <div class="p-d-flex p-ai-center">
            <p class="p-m-0">Order status:</p>
            <Dropdown
              v-model="selectedStatus"
              :options="status"
              optionLabel="name"
              optionValue="value"
              @change="setStatus"
            />
          </div>
        </div>
        <DataTable :value="orderItems" responsiveLayout="scroll">
          <template #header>
            <div class="p-d-flex p-jc-between p-ai-center">
              <h5 class="p-m-0">Order Items</h5>
            </div>
          </template>
          <Column field="title" header="Title"></Column>
          <Column field="thumbnail" header="Thumbnail">
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
          <Column field="quantity" header="Quantity"></Column>
          <Column field="price" header="Unit Price"></Column>
          <Column field="totalPrice" header="Total Price">
            <template #body="{ data }">
              {{ data.quantity * data.price }}
            </template>
          </Column>
        </DataTable>
      </template>
      <template #footer>
        <div>
          <h3>Sub Total: {{getTotalPrice}}</h3>
          <h3>Tax: {{tax}}</h3>
          <h3 class="p-p-3" style="background:green; width:15%; color:white">Total: {{Math.floor(getTotalPrice+(getTotalPrice*tax))}}</h3>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import db from "../db";
export default {
  data() {
    return {
      id: "",
      order: {},
      orderItems: [],
      orderId: "",
      orderCreateDate: "",
      selectedStatus: "",
      status: [
        { name: "Pending", value: "Pending" },
        { name: "Delivered", value: "Delivered" },
      ],
      loading: true,
      tax:0.15,
    };
  },
  methods: {
    async setStatus(event) {
      console.log(event.value);
      await db
        .collection("orders")
        .doc(this.id)
        .update({
          pending: event.value == "Pending" ? true : false,
        });
      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Order status changed",
        life: 3000,
      });
    },
  },
  async created() {
    this.id = this.$route.params.id;
    let order = await db.collection("orders").doc(this.id).get();
    this.orderId = order.data().orderId;
    this.order = order.data();
    // this.order.push(order.data());
    let orderItems = order.data().orderItems;
    orderItems.forEach((orderItem) => {
      this.orderItems.push(orderItem);
    });
    this.selectedStatus = !this.order.pending ? "Delivered" : "Pending";
    this.orderCreateDate = this.order.createdAt
      .toDate()
      .toLocaleDateString("en-BS");
    this.loading = false;
  },
  computed: {
    getTotalPrice() {
      let price = 0;
      this.orderItems.forEach((item) => {
        price += +item.price;
      });
      return price;
    },
  },
};
</script>

<style lang="scss">
.p-card {
  padding: 3rem;
}
.p-card-title {
  background-color: lightgray;
  text-align: center;
  padding: 20px;
}
</style>