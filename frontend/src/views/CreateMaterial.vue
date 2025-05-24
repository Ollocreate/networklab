<template>
  <v-container>
      <v-form @submit.prevent="submitMaterial">
        <h2>Добавить новый материал</h2>
        <v-text-field v-model="title" label="Название" required></v-text-field>

        <v-textarea
          v-model="content"
          label="Текст материала"
          required
        ></v-textarea>

        <v-select
          v-model="courseId"
          :items="courses"
          item-title="title"
          item-value="id"
          label="Выберите курс"
          required
        ></v-select>

        <v-select
          v-if="topics.length > 0"
          v-model="parentId"
          :items="filteredTopics"
          item-title="title"
          item-value="id"
          label="Родительская тема"
          clearable
        ></v-select>

        <v-file-input
          label="Загрузить файлы"
          multiple
          accept="image/*,video/*"
          @change="handleFiles"
        ></v-file-input>

        <v-btn type="submit" color="primary" :loading="loading"
          >Создать материал</v-btn
        >
      </v-form>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { watch } from "vue";

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

    const topics = computed(() => store.state.material.topics);
    const filteredTopics = computed(() => {
      if (!courseId.value) return [];
      return topics.value.filter((topic) => topic.courseId === courseId.value);
    });

    const courses = computed(() => store.state.material.courses);

    watch(courseId, () => {
      parentId.value = null;
    });
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
        await store.dispatch("material/createMaterial", formData);
        router.push("/teacher");
      } catch (error) {
        alert("Ошибка при создании материала.");
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await store.dispatch("material/fetchCourses");
      await store.dispatch("material/fetchTopics");
    }); 

    return {
      title,
      content,
      courseId,
      parentId,
      files,
      loading,
      topics,
      filteredTopics,
      courses,
      handleFiles,
      submitMaterial,
    };
  },
};
</script>

<style scoped>
.v-form {
  padding-top: 30px;
}
</style>
