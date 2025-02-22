import { ref, onUnmounted } from "vue";
import { io } from "socket.io-client";
const ip = import.meta.env.VITE_WS_URL;

export const modbusTCP = () => {
  const socket = io(ip);
  const messages = ref([]);

  // socket.on("welcome", (message) => {});

  socket.on("modbusMessage", (data) => {
    for (const key in data) {
      messages.value[key] = data[key];
    }
  });

  const sendMessage = (message) => {
    socket.emit("modbusMessage", message);
  };

  onUnmounted(() => {
    socket.disconnect();
  });

  return { messages, sendMessage };
};

export const marketing_automation = (base) => {
  const socket = io(ip);
  socket.on("VehiclesInformation", (data) => {
    const index = base.value.data.rows.findIndex(
      (v, i) => v.TV_ID === data.TV_ID
    );
    if (index < 0) {
      return;
    }
    console.table(data);
    base.value.data.rows[index].TV_BatteryPercent = data.TV_BatteryPercent;
  });

  const sendMessage = (message) => {
    socket.emit("VehiclesInformation", message);
  };

  onUnmounted(() => {
    socket.disconnect();
  });

  return { sendMessage };
};

// export default { modbusTCP, marketing_automation };
