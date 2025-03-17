<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item 
        v-for="material in materials" 
        :key="material.id" 
        @click="selectMaterial(material.id)"
      >
        {{ material.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState("material", ['materials'])
  },

  methods: {
    ...mapActions("material", ['fetchMaterials', 'fetchMaterial']),
    selectMaterial(id) {
      this.fetchMaterial(id);
    }
  },

  watch: {
  "$route.params.courseSlug": {
    immediate: true,
    handler(slug) {
      if (slug) {
        this.fetchMaterials(slug);
      }
    }
  }
}
};
</script>
