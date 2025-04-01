<template>
  <div class="console-container">
    <div ref="terminalContainer" class="terminal"></div>
  </div>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default {
  name: 'TheConsole',
  data() {
    return {
      terminal: null,
      fitAddon: null,
      socket: null,
    };
  },
  mounted() {
    this.terminal = new Terminal({
      cursorBlink: true,
      rows: 20,
      cols: 80,
    });
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.$refs.terminalContainer);
    this.fitAddon.fit();

    const nodeId = this.$route.params.id;
    this.socket = new WebSocket(`ws://localhost:5001/${nodeId}`);
    this.socket.onopen = () => {
      this.terminal.write("Подключено к Telnet Proxy...\r\n");
    };
    this.socket.onmessage = (event) => {
      this.terminal.write(event.data);
    };
    this.socket.onerror = () => {
      this.terminal.write("Ошибка подключения\r\n");
    };

    this.terminal.onData(data => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.terminal.write(data);
        this.socket.send(data);
      }
    });
  },
};
</script>

<style scoped>
.console-container {
  background-color: #000;
  color: #0f0;
  padding: 10px;
  border: 1px solid #333;
}
.terminal {
  width: 800px;
  height: 400px;
}
</style>
