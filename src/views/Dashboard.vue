 <template>
  <div class="p-grid p-fluid dashboard">
    <div class="p-col-12 p-lg-4">
      <div class="card summary">
        <span class="title">Students</span>
        <span class="detail">Number of students</span>
        <span class="count" style="background-color: #007be5; color: white">{{
          countStudents
        }}</span>
      </div>
    </div>
    <div class="p-col-12 p-lg-4">
      <div class="card summary">
        <span class="title">Weekly Earnings</span>
        <span class="detail">Earnings for the week</span>
        <span class="count purchases">{{formatMoney(weeklyEarnings)}}</span>
      </div>
    </div>
    <div class="p-col-12 p-lg-4">
      <div class="card summary">
        <span class="title">Monthly Earnings</span>
        <span class="detail">Earnings for the month</span>
        <span class="count revenue">{{formatMoney(monthlyEarnings)}}</span>
      </div>
    </div>
    <div class="p-col-12 p-lg-4">
      <div class="card summary">
        <span class="title">Unpaid Sessions</span>
        <span class="detail">Number of unpaid sessions</span>
        <span class="count visitors">{{ countUnpaid }}</span>
      </div>
    </div>
    <div class="p-col-12 p-lg-4">
      <div class="card summary">
        <span class="title">Weekly Sessions</span>
        <span class="detail">Number of sessions for the week</span>
        <span class="count purchases">{{ countWeekSessions }}</span>
      </div>
    </div>
    <div class="p-col-12 p-lg-4">
      <div class="card summary">
        <span class="title">Finished Sessions</span>
        <span class="detail">Finished sessions for the week</span>
        <span class="count revenue">{{ countWeekSessionsFinished }}</span>
      </div>
    </div>

    <div class="p-col-12 p-md-6 p-lg-4">
      <Panel header="Unpaid Sessions" style="height: 100%">
        <ul v-if="unpaidSessions?.length != 0" class="task-list">
          <li  v-for="app in unpaidSessions" :key="app.id">
            <span class="task-name"><b>{{ formatRange(app) }}</b></span>
            <br/>
            <span class="task-name">Student: {{ app.student_name }}</span>
            <br/>

            <span class="task-name">Topic: {{ app.topic }}</span>
          </li>
          <!-- <li>
            <Checkbox name="task" value="reports" v-model="tasksCheckbox" />
            <span class="task-name">Sales Reports</span>
            <i class="pi pi-chart-bar" />
          </li> -->
        </ul>
        <span v-else class="p-tag p-tag-rounded p-tag-warning">No unpaid sessions</span>
      </Panel>
    </div>

    <div class="p-col-12 p-md-6 p-lg-4">
      <Panel header="Sessions for Today">
          <ul v-if="sessionsToday?.length != 0" class="task-list">
          <li v-for="app in sessionsToday" :key="app.id">
            <span class="task-name"><b>{{ formatRange2(app) }}</b></span>
            <br/>
            <span class="task-name">Student: {{ app.student_name }}</span>
            <br/>

            <span class="task-name">Topic: {{ app.topic }}</span>
          </li>
        </ul>
        <span v-else class="p-tag p-tag-rounded p-tag-warning">No sessions today</span>
      </Panel>
    </div>

    <div class="p-col-12 p-lg-4 contacts">
      <Panel header="Students for Today" class="studentsPanel">
        <ul v-if="studentsToday?.length != 0">
          <li v-for="student in studentsToday" :key="student.id">
            <button class="p-link">
              <div>
              <img
                v-if="student.avatars !== ''"
                :src="'assets/layout/images/' + student.avatars"
                width="35"
                alt="avatar1"
              />
              <img
                v-else
                :src="'assets/layout/images/none.png'"
                width="35"
                alt="avatar1"
              />
              <span class="name">{{fullname(student)}}</span>
              <span class="email">{{student.email}}</span>
              </div>
            </button>
          </li>
          <!-- <li>
            <button class="p-link">
              <img
                src="assets/layout/images/avatar_1.png"
                width="35"
                alt="avatar1"
              />
              <span class="name">Claire Williams</span>
              <span class="email">clare@primevue.com</span>
            </button>
          </li> -->
        </ul>
        <span v-else class="p-tag p-tag-rounded p-tag-warning">No students today</span>
      </Panel>
    </div>
  </div>
</template>

<script>
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import StudentService from "../service/StudentService";
import AppointmentService from "../service/AppointmentService";
import DashboardService from "../service/DashboardService";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default {
  data() {
    return {
      tasksCheckbox: [],
      dropdownCities: [
        { name: "New York", code: "NY" },
        { name: "Rome", code: "RM" },
        { name: "London", code: "LDN" },
        { name: "Istanbul", code: "IST" },
        { name: "Paris", code: "PRS" },
      ],
      dropdownCity: null,
      options: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultDate: "2019-01-01",
        header: {
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        editable: true,
      },
      events: null,
      products: null,
      selectedProducts: null,
      lineData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: "#2f4860",
            borderColor: "#2f4860",
          },
          {
            label: "Second Dataset",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
          },
        ],
      },
      unpaidSessions: null,
      appointments: null,
      students: null,
      weeklyEarnings:null,
      monthlyEarnings:null,
    };
  },
  studentService: null,
  appointmentService: null,
  dashboardService: null,
  created() {
    this.studentService = new StudentService();
    this.appointmentService = new AppointmentService();
    this.dashboardService = new DashboardService();
  },
  computed: {
    countStudents: function () {
      return this.students?.length;
    },
    countUnpaid: function () {
      return this.unpaidSessions?.length;
    },
    countWeekSessions: function () {
      return this.appointments?.filter((app) => {
        return this.isInWeek(app.start_date);
      }).length;
    },
    countWeekSessionsFinished: function () {
      // sessions that are past or sessions that are paid?
      return this.appointments?.filter((app) => {
        return this.isInWeek(app.start_date) && app.paid;
      }).length;
    },
    sessionsToday: function () {
      return this.appointments?.filter((app) => {
        const date = moment(app.start_date);
        const today = moment();
        return today.isSame(date, "day");
      });
    },
    studentsToday: function () {
      const ids = this.sessionsToday?.map((session) => session.student);
      return this.students?.filter((student) => {
        return ids?.includes(student.id);
      });
    },
  },
  async mounted() {
    // let afId = this.$route.query['af_id'];
    // if (afId) {
    //     let today = new Date();
    //     let expire = new Date();
    //     expire.setTime(today.getTime() + 3600000*24*7);
    //     document.cookie = 'primeaffiliateid=' + afId + ';expires=' + expire.toUTCString() + ';path=/; domain:primefaces.org';
    // }
    this.students = await this.studentService.getStudents();

    this.students = this.students.filter((s) => {
        return !s.archive;
      });

    const data = await this.appointmentService.getAppointments();
    this.appointments = data.results;
    this.appointments.forEach((app) => {
      const match = this.students.find((st) => {
        return st.id == app.student;
      });
      app['student_name'] = match.first_name + " " + match.last_name;
    })
    this.unpaidSessions = this.appointments.filter((app) => {
      return !app.paid;
    });

    // get income values
    const res = await this.dashboardService.getIncome();
    this.weeklyEarnings = res.weekly;
    this.monthlyEarnings = res.monthly;
  },
  methods: {
    isInWeek(date) {
      date = moment(date);
      var range = moment().range(
        moment().day(1).startOf("day"),
        moment().day(7).startOf("day")
      );
      return range.contains(date);
    },
    formatRange(app) {
      return moment(app.start_date).format('ddd MMM D, hh:mma') + " - " + moment(app.end_date).format('hh:mma');
    },
    formatRange2(app) {
      return moment(app.start_date).format('hh:mma') + " - " + moment(app.end_date).format('hh:mma');
    },
    fullname(student){
      return student.first_name + " " + student.last_name;
    },
    formatMoney(val){
      return val?.toLocaleString('en-PH', {currency: 'PHP', style: 'currency'});
    }
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  ::v-deep(.p-datatable) {
    &.p-datatable-customers {
      .p-datatable-thead > tr > th,
      .p-datatable-tfoot > tr > td {
        display: none !important;
      }

      .p-datatable-tbody > tr {
        border-bottom: 1px solid #dee2e6;
        > td {
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0 none !important;
          width: 100% !important;
          float: left;
          clear: left;
          border: 0 none;

          .p-column-title {
            padding: 0.4rem;
            min-width: 30%;
            display: inline-block;
            margin: -0.4rem 1rem -0.4rem -0.4rem;
            font-weight: bold;
          }

          .p-progressbar {
            margin-top: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
