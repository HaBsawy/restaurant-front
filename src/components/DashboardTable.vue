<template>
  <v-card :loading="loading">
    <v-card-title class="first-title">
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn @click="create()">Create</v-btn>
    </v-card-title>
    <v-card-title class="second-title">
      <v-text-field
        @keyup="getData()"
        v-model="pagination.search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-select
        @change="getData()"
        :items="[5, 10, 15, 20]"
        label="Item per page"
        v-model="pagination.perPage"
      ></v-select>
    </v-card-title>
    <v-simple-table dense v-if="!loading">
      <template v-slot:default>
        <thead>
          <tr>
            <th
              v-for="(heading, i) in headings"
              :key="`${title}_${heading.name}`"
              @click="changeOrderBy(i)"
              class="text-left"
            >
              {{ heading.name }} <span v-html="heading.orderByIcon"></span>
            </th>
          </tr>
        </thead>
        <tbody v-if="data.length > 0">
          <tr v-for="(item, index) in data" :key="item.name">
            <td v-for="heading in headings" :key="`${title}_${heading.name}_${index}`">
              <div v-if="heading.name == 'Actions'">
                <router-link :to="`${title.toLowerCase()}/${item.id}`" v-if="heading.showOne">
                  <v-btn icon>
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </router-link>
                <v-btn icon @click="edit(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="destroy(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
              <div v-else-if="heading.name == 'Active'">
                <v-switch v-model="item[heading.data]" @change="changeStatus(item)"></v-switch>
              </div>
              <div v-else-if="heading.name == 'Image'">
                <div v-if="item[heading.data]">
                  <v-img max-height="150" max-width="250" :src="item[heading.data]['path']"></v-img>
                </div>
              </div>
              <div v-else>
                {{ item[heading.data] }}
              </div>
            </td>
          </tr>
        </tbody>
        <thead v-else>
          <tr>
            <td :colspan="headings.length" class="text-center">There is no data</td>
          </tr>
        </thead>
      </template>
    </v-simple-table>
    <div v-if="!loading && pagination.length > 1" class="text-center">
      <v-pagination
        class="pagination"
        v-model="pagination.page"
        :length="pagination.length"
        :total-visible="6"
        @input="getData()"
      ></v-pagination>
    </div>
    <v-dialog v-model="formDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ selectedItem.id ? 'Edit' : 'Create' }} {{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <slot> </slot>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="formDialog = false"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="save()" :loading="formLoading"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Delete {{ title }}</span>
        </v-card-title>
        <v-card-text>
          <h3>Do you sure that you want to delete this item ?</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="destroyItem()" :loading="formLoading">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    headingsProps: Array,
    selectedItem: Object,
    extraData: Object,
    title: String,
    url: String,
  },
  data() {
    return {
      formDialog: false,
      deleteDialog: false,
      formLoading: false,
      loading: true,
      pagination: {
        page: 1,
        length: 0,
        perPage: 10,
        search: '',
      },
      data: [],
      headings: [],
    };
  },
  created() {
    this.headings = this.headingsProps;
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      let queries = `page=${this.pagination.page}&per-page=${this.pagination.perPage}`;
      if (this.pagination.search) {
        queries += `&search=${this.pagination.search}`;
      }
      this.headings.forEach((element) => {
        if (element.orderBy) {
          queries += `&order-${element.data}=${element.orderBy}`;
        }
      });
      axios
        .get(`${this.url}?${queries}`, {
          headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
        })
        .then((response) => {
          this.data = response.data.payload.data;
          this.pagination.length = response.data.payload.last_page;
        })
        .catch((error) => {
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeOrderBy(i) {
      if (this.headings[i].name !== 'Actions') {
        if (this.headings[i].orderBy === 'desc') {
          this.headings[i].orderBy = null;
          this.headings[i].orderByIcon = null;
        } else if (this.headings[i].orderBy === 'asc') {
          this.headings[i].orderBy = 'desc';
          this.headings[i].orderByIcon = '&darr;';
        } else {
          this.headings[i].orderBy = 'asc';
          this.headings[i].orderByIcon = '&uarr;';
        }
        this.getData();
      }
    },
    create() {
      this.formLoading = false;
      this.formDialog = true;
      this.$emit('updateSelectedItem', {});
    },
    edit(item) {
      this.formLoading = false;
      this.formDialog = true;
      this.$emit('updateSelectedItem', item);
    },
    save() {
      this.formLoading = true;
      const formData = new FormData();
      Object.keys(this.selectedItem).forEach((element) => {
        if (Array.isArray(this.selectedItem[element])) {
          this.selectedItem[element].forEach((item) => {
            formData.append(`${element}[]`, item);
          });
        } else {
          formData.append(element, this.selectedItem[element]);
        }
      });
      if (this.selectedItem.id) {
        // formData.append('_method', 'PUT');
        formData.append('_method', 'put');
        axios
          .post(`${this.url}/${this.selectedItem.id}`, formData, {
            headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
          })
          .then((respose) => {
            this.$store.dispatch('snackbar/success', respose.data.msg);
          })
          .catch((error) => {
            this.$store.dispatch('snackbar/error', error.response.data.msg);
          })
          .finally(() => {
            this.formLoading = false;
            this.formDialog = false;
            this.$emit('updateSelectedItem', {});
            this.getData();
          });
      } else {
        axios
          .post(this.url, formData, {
            headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
          })
          .then((respose) => {
            this.$store.dispatch('snackbar/success', respose.data.msg);
          })
          .catch((error) => {
            this.$store.dispatch('snackbar/error', error.response.data.msg);
          })
          .finally(() => {
            this.formLoading = false;
            this.formDialog = false;
            this.$emit('updateSelectedItem', {});
            this.getData();
          });
      }
    },
    destroy(item) {
      this.formDialog = false;
      this.deleteDialog = true;
      this.$emit('updateSelectedItem', item);
    },
    destroyItem() {
      axios
        .delete(`${this.url}/${this.selectedItem.id}`, {
          headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
        })
        .then((respose) => {
          this.$store.dispatch('snackbar/success', respose.data.msg);
        })
        .catch((error) => {
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        })
        .finally(() => {
          this.formLoading = false;
          this.deleteDialog = false;
          this.$emit('updateSelectedItem', {});
          this.getData();
        });
    },
    changeStatus(item) {
      axios
        .put(`${this.url}/${item.id}/change-status`, item, {
          headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
        })
        .then((respose) => {
          this.$store.dispatch('snackbar/success', respose.data.msg);
        })
        .catch((error) => {
          this.$store.dispatch('snackbar/error', error.response.data.msg);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
