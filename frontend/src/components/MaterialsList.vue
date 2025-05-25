<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item
        v-for="material in materials"
        :key="material.id"
        @click="selectMaterial(material.id)"
        :class="{ 'selected-material': selectedMaterial?.id === material.id }"
        class="material-item"
      >
        <div class="title-wrapper">
          <span
            class="material-title"
            :class="{ expanded: selectedMaterial?.id === material.id }"
          >
            {{ material.title }}
          </span>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("material", ["materials", "selectedMaterial"]),
  },

  methods: {
    ...mapActions("material", ["fetchMaterials", "fetchMaterial"]),

    selectMaterial(id) {
      if (this.selectedMaterial?.id !== id) {
        this.fetchMaterial(id);
      }
    },
  },

  watch: {
    "$route.params.courseSlug": {
      immediate: true,
      handler(slug) {
        if (slug) {
          this.fetchMaterials(slug);
        }
      },
    },
  },
};
</script>

<style scoped>
.material-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.selected-material {
  background-color: #bbdefb;
}

.title-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.material-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 24px);
  transition: max-width 0.3s ease;
}

.material-title.expanded {
  white-space: normal;
  max-width: 100%;
}
</style>
