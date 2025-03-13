<template>
  <v-card v-if="selectedMaterial">
    <v-card-title>{{ selectedMaterial.title }}</v-card-title>
    <v-card-text v-html="selectedMaterial.content"></v-card-text>

    <div v-if="parsedMediaUrls.length">
      <img 
        v-for="file in parsedMediaUrls" 
        :key="file.path" 
        :src="'http://localhost:5000' + file.path" 
        style="max-width: 100%;" 
      />
    </div>

    <v-btn @click="prevMaterial" :disabled="prevId === null">← Назад</v-btn>
    <v-btn @click="nextMaterial" :disabled="nextId === null">Вперёд →</v-btn>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['selectedMaterial', 'materials']),
    parsedMediaUrls() {
    try {
      return this.selectedMaterial?.mediaUrls ? JSON.parse(this.selectedMaterial.mediaUrls) : [];
    } catch (e) {
      console.error("Ошибка парсинга mediaUrls:", e);
      return [];
    }
  },
    prevId() {
      const index = this.materials.findIndex(m => m.id === this.selectedMaterial?.id);
      return index > 0 ? this.materials[index - 1].id : null;
    },

    nextId() {
      const index = this.materials.findIndex(m => m.id === this.selectedMaterial?.id);
      return index < this.materials.length - 1 ? this.materials[index + 1].id : null;
    }
  },

  methods: {
    ...mapActions(['fetchMaterial']),

    prevMaterial() {
      if (this.prevId) this.fetchMaterial(this.prevId);
    },

    nextMaterial() {
      if (this.nextId) this.fetchMaterial(this.nextId);
    }
  }
};
</script>
