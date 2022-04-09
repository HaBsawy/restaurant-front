<template>
  <section>
    <dashboard-table
      :title="title"
      :headingsProps="headings"
      :selectedItem="selectedItem"
      :url="url"
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
        <v-switch
          v-if="!selectedItem.id"
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
import DashboardTable from '@/components/DashboardTable.vue';

export default {
  components: {
    DashboardTable,
  },
  data() {
    return {
      title: 'Categories',
      selectedItem: {},
      url: 'http://localhost:8000/api/dashboard/categories',
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
};
</script>
