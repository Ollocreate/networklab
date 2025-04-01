const WebSocket = require("ws");
const { Telnet } = require("telnet-client");

const wss = new WebSocket.Server({ port: 5001 });

wss.on("connection", async (ws) => {
  console.log("🔗 Клиент подключился к Telnet Proxy");

  const connection = new Telnet();

  const telnetParams = {
    host: "192.168.116.128", // Ваш IP-адрес
    port: 32769, // Ваш порт
    negotiationMandatory: false,
    timeout: 1500,
  };

  try {
    await connection.connect(telnetParams);
    console.log("✅ Telnet соединение установлено");

    // Обрабатываем данные от Telnet и пересылаем клиенту по WebSocket
    connection.on("data", (data) => {
      ws.send(data.toString());
    });

    let commandBuffer = "";

    // Получаем команды из WebSocket
    ws.on("message", async (message) => {
      try {
        commandBuffer += message;

        // Проверяем на завершение команды (например, символ новой строки)
        if (commandBuffer.includes("\r") || commandBuffer.includes("\n")) {
          console.log("💻 Отправка команды в Telnet:", commandBuffer.trim());
          await connection.send(commandBuffer);
          commandBuffer = ""; // Очищаем буфер после отправки
        }
      } catch (err) {
        console.error("Ошибка отправки команды в Telnet:", err);
      }
    });

    ws.on("close", () => {
      console.log("❌ WebSocket соединение закрыто");
      connection.end();
    });
  } catch (error) {
    console.error("Ошибка подключения по Telnet:", error);
    ws.send(`Ошибка подключения: ${error.message}`);
    ws.close();
  }
});

console.log("🚀 Telnet Proxy WebSocket сервер запущен на порту 5001");
