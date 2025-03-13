<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title>Добавить новый материал</v-card-title>

      <v-form @submit.prevent="submitMaterial">
        <v-text-field v-model="title" label="Название" required></v-text-field>

        <v-textarea v-model="content" label="Текст материала" required></v-textarea>

        <v-select
          v-model="courseId"
          :items="courses"
          item-title="title"
          item-value="id"
          label="Выберите курс"
          required
        ></v-select>

        <v-select
          v-model="parentId"
          :items="topics"
          item-title="title"
          item-value="id"
          label="Родительская тема"
          clearable
        ></v-select>

        <v-file-input label="Загрузить файлы" multiple accept="image/*,video/*" @change="handleFiles"></v-file-input>

        <v-btn type="submit" color="primary" :loading="loading">Создать материал</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "CreateMaterial",
  setup() {
    const store = useStore();
    const router = useRouter();

    const title = ref("");
    const content = ref("");
    const courseId = ref(null);
    const parentId = ref(null);
    const files = ref([]);
    const loading = ref(false);

    const topics = computed(() => store.state.topics);
    const courses = computed(() => store.state.courses);

    const handleFiles = (event) => {
      files.value = event.target.files;
    };

    const submitMaterial = async () => {
      if (!courseId.value) {
        alert("Выберите курс!");
        return;
      }

      loading.value = true;
      const formData = new FormData();
      formData.append("title", title.value);
      formData.append("content", content.value);
      formData.append("courseId", courseId.value);

      if (parentId.value) {
        formData.append("parentId", parentId.value);
      }

      for (let file of files.value) {
        formData.append("media", file);
      }

      try {
        console.log("Отправляемый formData:", ...formData.entries());
        await store.dispatch("createMaterial", formData);
        router.push("/materials");
      } catch (error) {
        alert("Ошибка при создании материала.");
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      store.dispatch("fetchTopics");
      store.dispatch("fetchCourses");
    });

    return { title, content, courseId, parentId, files, loading, topics, courses, handleFiles, submitMaterial };
  },
};
</script>
