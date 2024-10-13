<template>
    <div class="appointment-container">
      <h3>Book an Appointment</h3>
      <p>Currently fetched appointments: {{ events.length }}</p>
      <vue-cal
        v-model="events"
        :disable-views="['years', 'year', 'month']"
        :time="true"
        :time-range="{ start: '00:00', end: '23:59' }"
        @cell-click="createHourlyAppointment"
        @event-click="goToAppointmentDetail"
        :week-view-start="0"
        :week-view-end="24"
        default-view="week"
        :disabled-dates="disabledDates"
        :events="events"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  
  const db = getFirestore();
  const router = useRouter();
  const events = ref([]);
  const disabledDates = ref([]);
  
  // 从 Firestore 获取预约数据
  const fetchAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      events.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          start: data.start && data.start.toDate(),  // 将 Firestore 的 Timestamp 转换为 JavaScript 的 Date
          end: data.end && data.end.toDate(),        // 使用 && 避免字段不存在时报错
          title: data.title,
        };
      });
  
      // 设置被预约的时间为不可用
      disabledDates.value = events.value.map(event => ({ start: event.start, end: event.end }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  
  // 创建新的预约
  const createHourlyAppointment = async (date) => {
    // 检查选择的时间是否与现有预约冲突
    const isConflict = events.value.some(event => date >= event.start && date < event.end);
    if (isConflict) {
      alert('The selected time slot is already booked. Please choose another time.');
      return;
    }
  
    const title = prompt('Enter appointment title');
    if (title) {
      const endDate = new Date(date);
      endDate.setHours(date.getHours() + 1);
  
      try {
        await addDoc(collection(db, 'appointments'), {
          start: Timestamp.fromDate(date),   // 将 JavaScript Date 转换为 Firestore Timestamp
          end: Timestamp.fromDate(endDate),  // 将 JavaScript Date 转换为 Firestore Timestamp
          title,
        });
  
        // 本地状态更新
        events.value.push({
          id: Math.random().toString(36).substr(2, 9),  // 临时生成一个唯一 ID
          start: date,
          end: endDate,
          title,
        });
        disabledDates.value.push({ start: date, end: endDate });
      } catch (error) {
        console.error('Error saving appointment:', error);
      }
    }
  };
  
  // 当点击事件时跳转到预约详情页面
  const goToAppointmentDetail = (event) => {
    if (event && event.id) {
      router.push({ name: 'AppointmentDetail', params: { id: event.id } });
    } else {
      console.error('Invalid event data:', event);
    }
  };
  
  onMounted(fetchAppointments);
  </script>
  
  <style scoped>
  .appointment-container {
    padding: 20px;
    max-width: 800px;
    margin: 40px auto;
    border-top: 1px solid #ccc;
  }
  
  .appointment-container h3 {
    margin-bottom: 20px;
  }
  
  button {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .vuecal__event {
    background-color: #ff0000 !important;
    color: #ffffff !important;
  }
  </style>