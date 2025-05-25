<template>
  <v-card v-if="selectedMaterial" style="width: 90%; margin: auto">
    <v-card-title class="full-title">{{ selectedMaterial.title }}</v-card-title>
    <v-card-text
      style="white-space: pre-wrap"
      v-html="selectedMaterial.content"
    ></v-card-text>

    <div v-if="parsedMediaUrls.length">
      <template v-for="(file, index) in parsedMediaUrls" :key="index">
        <img
          v-if="file.type === 'image'"
          :src="getFileUrl(file)"
          style="max-width: 100%"
        />
        <video
          v-else-if="file.type === 'video'"
          :src="getFileUrl(file)"
          controls
          style="max-width: 100%"
        ></video>
      </template>
    </div>

    <div class="button-container">
      <div class="nav-buttons">
        <v-btn @click="prevMaterial" :disabled="prevId === null">← Назад</v-btn>
        <v-btn @click="nextMaterial" :disabled="nextId === null"
          >Вперёд →</v-btn
        >
      </div>
      <v-btn v-if="hasTasks" @click="startTask" color="primary"
        >Начать задание</v-btn
      >
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("material", ["selectedMaterial", "materials"]),
    parsedMediaUrls() {
      if (!this.selectedMaterial?.mediaUrls) return [];

      const mediaUrlsArray = JSON.parse(this.selectedMaterial.mediaUrls);
      console.log(mediaUrlsArray);

      return mediaUrlsArray.map((file) => {
        const extension = file.filename.split(".").pop().toLowerCase();
        return {
          filename: file.filename,
          path: file.path,
          type: this.getFileType(extension),
        };
      });
    },
    prevId() {
      const index = this.materials.findIndex(
        (m) => m.id === this.selectedMaterial?.id
      );
      return index > 0 ? this.materials[index - 1].id : null;
    },
    nextId() {
      const index = this.materials.findIndex(
        (m) => m.id === this.selectedMaterial?.id
      );
      return index < this.materials.length - 1
        ? this.materials[index + 1].id
        : null;
    },
    hasTasks() {
      return (
        this.selectedMaterial &&
        this.selectedMaterial.tasks &&
        this.selectedMaterial.tasks.length > 0
      );
    },
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
      return `http://localhost:5000${file.path}`;
    },

    getFileType(extension) {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const videoExtensions = ["mp4", "webm", "ogg"];

      if (imageExtensions.includes(extension)) {
        return "image";
      } else if (videoExtensions.includes(extension)) {
        return "video";
      } else {
        return "unknown";
      }
    },

    startTask() {
      this.$router.push("/eve");
      console.log('Кнопка "начать задание" нажата');
    },
  },
};
</script>

<style scoped>
.full-title {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  word-break: break-word;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.nav-buttons {
  display: flex;
  gap: 8px;
}
</style>
