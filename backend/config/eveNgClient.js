const axios = require("axios");
const cookie = require("cookie");
require("dotenv").config();

const EVE_NG_HOST = process.env.EVE_NG_API_URL;
const EVE_NG_ADMIN = process.env.EVE_NG_USERNAME;
const EVE_NG_PASSWORD = process.env.EVE_NG_PASSWORD;

let sessionId = null;

const loginAndGetSession = async () => {
  try {
    console.log("🔹 Попытка авторизации...");

    const response = await axios.post(
      `${EVE_NG_HOST}/api/auth/login`,
      {
        username: EVE_NG_ADMIN,
        password: EVE_NG_PASSWORD,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log("🔹 Заголовки ответа:", response.headers);

    const cookies = response.headers["set-cookie"];
    if (!cookies) throw new Error("❌ Сервер не вернул cookie!");

    const sessionCookie = cookies.find((cookieStr) =>
      cookieStr.startsWith("unetlab_session=")
    );
    if (!sessionCookie) throw new Error("❌ Cookie сессии не найден!");

    const parsedCookie = cookie.parse(sessionCookie);
    sessionId = parsedCookie.unetlab_session;

    console.log("✅ Авторизация успешна! Новый Session ID:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("❌ Ошибка авторизации:", error.message);
    return null;
  }
};

const eveNgClient = axios.create({
  baseURL: EVE_NG_HOST,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

eveNgClient.interceptors.request.use(
  async (config) => {
    if (!sessionId) {
      sessionId = await loginAndGetSession();
    }

    console.log("🔹 Перед отправкой запроса. Session ID:", sessionId);

    config.headers.Cookie = `unetlab_session=${sessionId}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
module.exports = { eveNgClient, loginAndGetSession };
