<template>
  <v-container>
    <v-row>
      <v-col cols="0">
        <MaterialsList />
      </v-col>

      <v-col cols="12">
        <template v-if="materials.length">
          <MaterialView />
        </template>
        <v-alert v-else type="info">
          Этот курс пока в разработке. Материалы появятся позже.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import MaterialsList from "../components/material/MaterialsList.vue";
import MaterialView from "../components/material/MaterialView.vue";

export default {
  components: {
    MaterialsList,
    MaterialView,
  },
  computed: {
    ...mapState("material", ["materials"]),
  },
};
</script>
