<template>
  <section :class="lang === 'en' ? '' : 'rtl'">
    <v-card :loading="loading">
      <div v-if="loading">
        <v-card-title class="first-title">Loading...</v-card-title>
      </div>
      <div v-else>
        <div v-if="product.id">
          <v-card-title class="first-title">
            {{ product[`name_${lang}`] }}
            <v-btn class="mx-3" @click="changeLang()">
              {{ lang === 'en' ? 'عربي' : 'English' }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-img width="50%" max-height="400" :src="product.main_image.path"></v-img>
            <div class="my-5">{{ product[`description_${lang}`] }}</div>
            <h3 class="mt-3 mb-2">Images</h3>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th :class="lang === 'en' ? 'text-left' : 'text-right'">#</th>
                    <th :class="lang === 'en' ? 'text-left' : 'text-right'">Image</th>
                    <th :class="lang === 'en' ? 'text-left' : 'text-right'">Action</th>
                  </tr>
                </thead>
                <tbody v-if="product.images.length > 0">
                  <tr v-for="(image, index) in product.images" :key="`image_${image.id}`">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <v-img max-height="150" max-width="250" :src="image.path"></v-img>
                    </td>
                    <td>
                      <v-btn icon @click="destroy(image)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td class="text-center" colspan="3">There are no images for this product</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <dashboard-table
              class="mt-5"
              :title="title"
              :headingsProps="headings"
              :selectedItem="selectedItem"
              :extraData="extraData"
              :url="priceUrl"
              @updateSelectedItem="(item) => (selectedItem = item)"
            >
              <v-col cols="12">
                <v-text-field
                  v-model="selectedItem.name_en"
                  label="Name in english*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedItem.name_ar"
                  label="Name in arabic*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="selectedItem.price" label="Price*" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-switch
                  v-model="selectedItem.has_discount"
                  label="Has Discount"
                  false-value="0"
                  true-value="1"
                ></v-switch>
              </v-col>

              <v-col v-if="selectedItem.has_discount && selectedItem.has_discount == 1" cols="6">
                <v-text-field v-model="selectedItem.discount" label="Discount (%)*"></v-text-field>
              </v-col>
              <v-col cols="12" v-if="!selectedItem.id">
                <v-switch
                  v-model="selectedItem.active"
                  label="Is active"
                  false-value="0"
                  true-value="1"
                ></v-switch>
              </v-col>
            </dashboard-table>
          </v-card-text>
        </div>
        <div v-else>
          <v-card-title class="first-title">404 Not Found</v-card-title>
        </div>
        <v-dialog v-model="deleteDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Delete Image</span>
            </v-card-title>
            <v-card-text>
              <h3>Do you sure that you want to delete this image ?</h3>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteDialog = false"> Close </v-btn>
              <v-btn color="blue darken-1" text @click="destroyImage()" :loading="formLoading">
                Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </section>
</template>

<script>
import axios from 'axios';
import DashboardTable from '@/components/DashboardTable.vue';

export default {
  components: {
    DashboardTable,
  },
  data() {
    return {
      deleteDialog: false,
      formLoading: false,
      loading: true,
      lang: 'en',
      product: {},
      selectedImage: {},
      url: 'http://localhost:8000/api/dashboard/products',

      title: 'Sizes',
      selectedItem: {},
      extraData: {
        withoutPagination: true,
      },
      priceUrl: 'http://localhost:8000/api/dashboard/products',
      headings: [
        {
          name: 'Id',
          data: 'id',
          orderBy: null,
          orderByIcon: null,
        },
        {
          name: 'Name En',
          data: 'name_en',
          orderBy: null,
          orderByIcon: null,
        },
        {
          name: 'Name Ar',
          data: 'name_ar',
          orderBy: null,
          orderByIcon: null,
        },
        {
          name: 'Price',
          data: 'price',
        },
        {
          name: 'Active',
          data: 'active',
          orderBy: null,
          orderByIcon: null,
        },
        {
          name: 'Actions',
          data: 'actions',
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      axios
        .get(`${this.url}/${this.$route.params.id}`, {
          headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
        })
        .then((response) => {
          this.product = response.data.payload;
          this.priceUrl = `http://localhost:8000/api/dashboard/products/${response.data.payload.id}/sizes`;
        })
        .catch((error) => {
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    destroy(image) {
      this.deleteDialog = true;
      this.selectedImage = image;
    },
    destroyImage() {
      axios
        .delete(`${this.url}/${this.$route.params.id}/images/${this.selectedImage.id}`, {
          headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
        })
        .then((respose) => {
          this.$store.dispatch('snackbar/success', respose.data.msg);
        })
        .catch((error) => {
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getData();
        });
    },
    changeLang() {
      this.lang = this.lang === 'en' ? 'ar' : 'en';
    },
  },
};
</script>

<style lang="scss" scoped>
.rtl {
  direction: rtl;
}

.first-title {
  padding: 20px;
}
.second-title {
  padding: 0 20px 20px;
}
.pagination {
  padding: 20px;
}
a {
  text-decoration: none;
}
</style>
