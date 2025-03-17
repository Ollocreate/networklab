<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <MaterialsList />
      </v-col>

      <v-col cols="10">
        <MaterialView />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MaterialsList from '../components/MaterialsList.vue';
import MaterialView from '../components/MaterialView.vue';

export default {
  components: {
    MaterialsList,
    MaterialView
  }
};
</script>
