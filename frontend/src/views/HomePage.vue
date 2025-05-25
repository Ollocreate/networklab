<template>
  <div class="home-container">
    <h1 class="title">
      Добро пожаловать в систему изучения сетевых технологий
    </h1>

    <p class="description">
      Это веб-приложение разработано для поддержки образовательного процесса по
      дисциплине «Сетевые технологии» и предназначено как для студентов, так и
      для преподавателей.
    </p>

    <h2 class="subtitle">Возможности платформы:</h2>
    <ul class="features-list">
      <li>
        Доступ к теоретическим материалам по ключевым темам сетевых технологий.
      </li>
      <li>
        Выполнение лабораторных работ в среде симуляции EVE-NG, приближенной к
        реальным условиям.
      </li>
      <li>
        Аутентификация и авторизация пользователей с разграничением прав доступа
        (студенты, преподаватели, администраторы).
      </li>
      <li>
        Отслеживание прогресса и статистики прохождения курсов каждым студентом.
      </li>
      <li>
        Инструменты администрирования, включая управление пользователями и
        учебным контентом.
      </li>
    </ul>

    <p class="footer">
      Эта платформа позволяет сделать процесс обучения практикоориентированным,
      управляемым и прозрачным как для обучающихся, так и для преподавателей.
    </p>

    <p class="author">Автор: Неустроева О.Г., студентка группы 211-322</p>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
.home-container {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.description {
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 30px;
  text-align: justify;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.features-list {
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 30px;
  font-size: 1.1rem;
  line-height: 1.5;
}

.features-list li {
  margin-bottom: 10px;
}

.footer {
  font-size: 1.1rem;
  margin-bottom: 40px;
  text-align: justify;
}

.author {
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
  color: #7f8c8d;
}
</style>
