<!-- <template>
    <div class="appointment-container">
      <h3>Book an Appointment</h3>
      <div v-if="events.length">
        <h4>Appointments:</h4>
        <ul>
          <li v-for="event in events" :key="event.id">
            {{ event.title }} - {{ event.start }} to {{ event.end }}
          </li>
        </ul>
      </div>
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
  
  // 从 Firestore 获取预约数据
  const fetchAppointments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    events.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("data is",data);
      return {
        id: doc.id,
        ...data,
        start: data.start?.toDate(),  // 将 Firestore 的 Timestamp 转换为 JavaScript 的 Date
        end: data.end?.toDate(),      // 使用 ?. 避免字段不存在时报错
      };
      
    });

    // 添加一个测试事件来确认显示效果
    events.value.push({
      id: '1',
      title: 'Test Event',
      start: new Date(),
      end: new Date(new Date().getTime() + 3600 * 1000),
    });

    console.log('Events:', events.value); // 检查 events 数据
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

  
  // 创建新的预约
  const createHourlyAppointment = async (date) => {
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
          start: date,
          end: endDate,
          title,
        });
      } catch (error) {
        console.error('Error saving appointment:', error);
      }
    }
  };
  
  // 当点击事件时跳转到预约详情页面
  const goToAppointmentDetail = (event) => {
    router.push({ name: 'AppointmentDetail', params: { id: event.id } });
  };
  
  onMounted(() => {
  fetchAppointments();
  
  // 添加一个示例事件，方便查看效果
  events.value.push({
    id: '1',
    title: 'Test Event',
    start: new Date(),
    end: new Date(new Date().getTime() + 3600 * 1000),
  });
});
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
  </style>
   -->
  <template></template>
  