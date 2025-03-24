<template>
  <v-card v-if="selectedMaterial">
    <v-card-title>{{ selectedMaterial.title }}</v-card-title>
    <v-card-text v-html="selectedMaterial.content"></v-card-text>

    <div v-if="parsedMediaUrls.length">
      <template v-for="(file, index) in parsedMediaUrls" :key="index">
        <img 
          v-if="file.type === 'image'" 
          :src="getFileUrl(file)" 
          style="max-width: 100%;" 
        />
        <video 
          v-else-if="file.type === 'video'" 
          :src="getFileUrl(file)" 
          controls 
          style="max-width: 100%;"
        ></video>
      </template>
    </div>

    <v-btn @click="prevMaterial" :disabled="prevId === null">← Назад</v-btn>
    <v-btn @click="nextMaterial" :disabled="nextId === null">Вперёд →</v-btn>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState("material", ["selectedMaterial", "materials"]),
    parsedMediaUrls() {
      if (!this.selectedMaterial?.mediaUrls) return [];

      const mediaUrlsArray = JSON.parse(this.selectedMaterial.mediaUrls);
      console.log(mediaUrlsArray);

      // Преобразуем mediaUrls в массив объектов с type
      return mediaUrlsArray.map(file => {
        const extension = file.filename.split('.').pop().toLowerCase(); // Извлекаем расширение
        return {
          filename: file.filename,
          path: file.path,
          type: this.getFileType(extension) // Определяем тип файла
        };
      });
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
    ...mapActions("material", ["fetchMaterial"]),

    prevMaterial() {
      if (this.prevId) this.fetchMaterial(this.prevId);
    },

    nextMaterial() {
      if (this.nextId) this.fetchMaterial(this.nextId);
    },

    getFileUrl(file) {
      // Возвращает полный URL к файлу
      return `http://localhost:5000${file.path}`;
    },

    getFileType(extension) {
      // Определяем тип файла по расширению
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const videoExtensions = ['mp4', 'webm', 'ogg'];

      if (imageExtensions.includes(extension)) {
        return 'image';
      } else if (videoExtensions.includes(extension)) {
        return 'video';
      } else {
        return 'unknown'; // На случай, если расширение неизвестно
      }
    }
  }
};
</script>
