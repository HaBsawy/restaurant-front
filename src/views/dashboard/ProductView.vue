<template>
  <section>
    <dashboard-table
      :title="title"
      :headingsProps="headings"
      :selectedItem="selectedItem"
      :extraData="extraData"
      :url="url"
      @updateSelectedItem="(item) => (selectedItem = item)"
    >
      <v-col cols="12" v-if="!selectedItem.id">
        <v-select
          v-model="selectedItem.category_id"
          :items="extraData.categories"
          item-text="name_en"
          item-value="id"
          label="Category"
        ></v-select>
      </v-col>
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
        <v-textarea
          v-model="selectedItem.description_en"
          label="Description in english*"
          required
        ></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="selectedItem.description_ar"
          label="Description in arabic*"
          required
        ></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-model="selectedItem.product_main_image"
          accept="image/*"
          label="Main Image"
          prepend-icon=""
        ></v-file-input>
      </v-col>
      <v-col cols="12">
        <v-file-input
          v-model="selectedItem.product_images"
          accept="image/*"
          label="Other Images"
          multiple
          prepend-icon=""
        ></v-file-input>
      </v-col>
      <!-- <v-col cols="12">
        <v-text-field v-model="selectedItem.price" label="Price*" required></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-switch
          v-model="selectedItem.has_discount"
          label="Has Discount"
          false-value="0"
          true-value="1"
        ></v-switch>
      </v-col> -->

      <!-- <v-col v-if="selectedItem.has_discount" cols="12">
        <v-text-field v-model="selectedItem.discount" label="Discount (%)*"></v-text-field>
      </v-col> -->
      <v-col cols="12" v-if="!selectedItem.id">
        <v-switch
          v-model="selectedItem.active"
          label="Is active"
          false-value="0"
          true-value="1"
        ></v-switch>
      </v-col>
    </dashboard-table>
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
      title: 'Products',
      selectedItem: {},
      extraData: {
        categories: [],
      },
      url: 'http://localhost:8000/api/dashboard/products',
      headings: [
        {
          name: 'Id',
          data: 'id',
          orderBy: null,
          orderByIcon: null,
        },
        {
          name: 'Image',
          data: 'main_image',
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
          showOne: true,
        },
      ],
    };
  },
  created() {
    axios
      .get('http://localhost:8000/api/dashboard/categories/select-category', {
        headers: { Authorization: `Bearer ${this.$store.state.user.token}` },
      })
      .then((response) => {
        this.extraData.categories = response.data.payload;
      })
      .catch((error) => {
        this.$store.dispatch('snackbar/error', error.response.data.msg);
      });
  },
};
</script>
