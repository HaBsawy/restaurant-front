<template>
  <section>
    <v-card :loading="loading">
      <div v-if="loading">
        <v-card-title class="first-title">Loading...</v-card-title>
      </div>
      <div v-else>
        <div v-if="category.id">
          <v-card-title class="first-title">
            {{ category.name_en }}
          </v-card-title>
          <v-card-text>

            <dashboard-table
              class="mt-5"
              :title="additionTitle"
              :headingsProps="additionHeadings"
              :selectedItem="selectedItem"
              :extraData="extraData"
              :url="additionUrl"
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

            <dashboard-table
              class="mt-5"
              :title="removeTitle"
              :headingsProps="removeHeadings"
              :selectedItem="selectedItem"
              :extraData="extraData"
              :url="removeUrl"
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
      category: {},
      url: 'http://localhost:8000/api/dashboard/categories',

      additionTitle: 'Additions',
      selectedItem: {},
      extraData: {
        withoutPagination: true,
      },
      additionUrl: 'http://localhost:8000/api/dashboard/products',
      additionHeadings: [
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
      removeTitle: 'Removes',
      removeUrl: 'http://localhost:8000/api/dashboard/products',
      removeHeadings: [
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
          this.category = response.data.payload;
          this.additionUrl = `http://localhost:8000/api/dashboard/categories/${response.data.payload.id}/additions`;
          this.removeUrl = `http://localhost:8000/api/dashboard/categories/${response.data.payload.id}/removes`;
        })
        .catch((error) => {
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        })
        .finally(() => {
          this.loading = false;
        });
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
