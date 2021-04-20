 <template>
  <div class="p-grid p-fluid dashboard">
    <div class="p-grid p-fluid dashboard" v-if="loading">
      <ProgressSpinner strokeWidth="3" />
    </div>
    <div v-else class="p-grid p-fluid dashboard">
      <!-- <div class="p-col-12 p-lg-12">
      <div class="p-field">
          <Dropdown
            class="weekOptions"
            v-model="tutor"
            :options="tutors"
          ></Dropdown>
        </div>
      </div>
      <Divider/> -->

      <!-- <div class="p-col-12 p-lg-4">
        <div class="card summary">
          <span class="title">Students</span>
          <span class="detail">Number of students</span>
          <span class="count" style="background-color: #007be5; color: white">{{
            countStudents
          }}</span>
        </div>
      </div> -->
      <div class="p-col-12 p-lg-8">
        <div class="card summary">
          <span class="title">Weekly Earnings</span>
          <div class="p-formgroup-inline earningsDetail">
            <span class="detail">Earnings for </span>
            <div class="p-field">
              <Dropdown
                class="weekOptions"
                v-model="weekOption"
                :options="weekOptions"
              ></Dropdown>
            </div>
            <div class="p-field" v-if="weeklyLoading">
              <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="3"
              />
            </div>
          </div>
          <div class="p-formgroup-inline" v-if="weekOption === 'Custom Range'">
            <div class="p-field">
              <label>From</label>
              <Calendar
                v-model="range.from"
                :showIcon="true"
                selectionMode="single"
              ></Calendar>
            </div>
            <div class="p-field">
              <label>To</label>
              <Calendar
                v-model="range.to"
                :showIcon="true"
                selectionMode="single"
              ></Calendar>
            </div>
          </div>

          <span class="count purchases">{{ formatMoney(weeklyEarnings) }}</span>
        </div>
      </div>
      <div class="p-col-12 p-lg-4">
        <div class="card summary">
          <span class="title">Monthly Earnings</span>
          <span class="detail">Earnings for the month</span>
          <span class="count revenue">{{ formatMoney(monthlyEarnings) }}</span>
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
        <Panel
          :header="'Unpaid Sessions as of ' + dateToday"
          style="height: 100%"
        >
          <div v-if="unpaidSessions?.length != 0">
            <div
              class="studentHeader"
              v-for="(apps, student) in unpaidSessionsByStudent"
              :key="student"
            >
              <h5>
                <b>{{ student }}</b>
              </h5>
              <ul class="task-list">
                <li v-for="app in apps" :key="app.id">
                  <span class="task-name">{{ formatRange(app) }}</span>
                  <!-- <br />
              <span class="task-name">Student: {{ app.student_name }}</span> -->
                  <br />
                  <span v-if="app.topic != ''" class="task-name"
                    >Topic: {{ app.topic }}</span
                  >
                </li>
              </ul>
            </div>
          </div>
          <span v-else class="p-tag p-tag-rounded p-tag-warning"
            >No unpaid sessions</span
          >
        </Panel>
      </div>

      <div class="p-col-12 p-md-6 p-lg-4">
        <Panel header="Sessions for Today">
          <ul v-if="sessionsToday?.length != 0" class="task-list">
            <li v-for="app in sessionsToday" :key="app.id">
              <span class="task-name"
                ><b>{{ formatRange2(app) }}</b></span
              >
              <br />
              <span class="task-name">Student: {{ app.student_name }}</span>
              <br />
              <span v-if="app.topic !== ''" class="task-name"
                >Topic: {{ app.topic }}</span
              >
            </li>
          </ul>
          <span v-else class="p-tag p-tag-rounded p-tag-warning"
            >No sessions today</span
          >
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
                  />
                  <img
                    v-else
                    :src="'assets/layout/images/none.png'"
                    width="35"
                  />
                  <span class="name">{{ fullname(student) }}</span>
                  <span class="email">{{ student.email }}</span>
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
          <span v-else class="p-tag p-tag-rounded p-tag-warning"
            >No students today</span
          >
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import StudentService from "../service/StudentService";
import AppointmentService from "../service/AppointmentService";
import DashboardService from "../service/DashboardService";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default {
  data() {
    return {
      // unpaidSessions: null,
      // unpaidSessionsByStudent: null,
      appointments: null,
      students: null,
      weeklyEarnings: null,
      monthlyEarnings: null,
      loading: true,
      weeklyLoading: true,
      weekOptions: [
        "This Week",
        "Last Week",
        "2 Weeks Ago",
        "3 Weeks Ago",
        "4 Weeks Ago",
        "Custom Range",
      ],
      weekOption: "This Week",
      range: {
        from: new Date(moment().day(1)),
        to: new Date(moment().day(7)),
      },
      dateToday: moment().format("dddd MMM D"),
    };
  },
  props: {
    curTutor: Object,
  },
  studentService: null,
  appointmentService: null,
  dashboardService: null,
  created() {
    this.studentService = new StudentService();
    this.appointmentService = new AppointmentService();
    this.dashboardService = new DashboardService();
  },
  watch: {
    weekOption: function () {
      this.updateWeeklyEarnings();
    },
    range: {
      handler: function () {
        this.updateWeeklyEarnings();
      },
      deep: true,
    },
    curTutor: function () {
      this.updateAll();
    },
  },
  computed: {
    unpaidSessions: function () {
      return this.appointments.filter((app) => {
        return !app.paid && !moment(app.start_date).isAfter(moment()) && this.tutorMatch(app);
      });
    },
    unpaidSessionsByStudent: function () {
      return this.groupBy(
        "student_name",
        this.unpaidSessions
      );
    },
    countStudents: function () {
      return this.students?.length;
    },
    countUnpaid: function () {
      return this.unpaidSessions?.length;
    },
    countWeekSessions: function () {
      return this.appointments?.filter((app) => {
        return this.isInWeek(app.start_date) && this.tutorMatch(app);
      }).length;
    },
    countWeekSessionsFinished: function () {
      // sessions that are past or sessions that are paid?
      return this.appointments?.filter((app) => {
        return this.isInWeek(app.start_date) && app.paid && this.tutorMatch(app);
      }).length;
    },
    sessionsToday: function () {
      return this.appointments?.filter((app) => {
        const date = moment(app.start_date);
        const today = moment();
        return today.isSame(date, "day") && this.tutorMatch(app);
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
    this.students = await this.studentService.getStudents();

    this.students = this.students.filter((s) => {
      return !s.archive;
    });

    const data = await this.appointmentService.getAppointments();
    this.appointments = data.results;

    // add student_name to each appointment
    this.appointments.forEach((app) => {
      const match = this.students.find((st) => {
        return st.id == app.student;
      });
      app["student_name"] = match.first_name + " " + match.last_name;
    });

    // this.unpaidSessions = this.appointments.filter((app) => {
    //   return !app.paid && !moment(app.start_date).isAfter(moment());
    // });

    // this.unpaidSessionsByStudent = this.groupBy(
    //   "student_name",
    //   this.unpaidSessions
    // );

    // get income values
    const res = await this.dashboardService.getIncome({
      tutor: this.curTutor.id ?? 'all',
    });
    this.weeklyEarnings = res.weekly;
    this.monthlyEarnings = res.monthly;

    this.loading = false;
    this.weeklyLoading = false;
  },
  methods: {
    tutorMatch(app){
      return this.curTutor.id === undefined ? true : this.curTutor.id === app.tutor;
    },
    async updateAll() {
      const res = await this.dashboardService.getIncome({
        tutor: this.curTutor.id ?? 'all',
      });
      // this.weeklyEarnings = res.weekly;
      this.monthlyEarnings = res.monthly;
      await this.updateWeeklyEarnings();
    },
    async updateWeeklyEarnings() {
      this.weeklyLoading = true;
      const weekOption = this.weekOption;
      let input = 0;
      switch (weekOption) {
        case "This Week": {
          const res = await this.dashboardService.getIncome({
            tutor: this.curTutor.id ?? 'all',
          });
          this.weeklyEarnings = res.weekly;
          this.weeklyLoading = false;
          return;
        }
        case "Last Week":
          input = 1;
          break;
        case "2 Weeks Ago":
          input = 2;
          break;
        case "3 Weeks Ago":
          input = 3;
          break;
        case "4 Weeks Ago":
          input = 4;
          break;
        case "Custom Range": {
          try {
            const res = await this.dashboardService.getWeeklyIncomeRange({
              tutor: this.curTutor.id ?? 'all',
              start_date: moment(this.range.from).format("YYYY-MM-DDTHH:mm:ss"),
              end_date: moment(this.range.to).format("YYYY-MM-DDTHH:mm:ss"),
            });
            this.weeklyEarnings = res.amount;
            this.weeklyLoading = false;
            return;
          } catch (error) {
            console.log(error.response.data);
          }
        }
      }

      const res = await this.dashboardService.getWeeklyIncome({
        tutor: this.curTutor.id ?? 'all',
        prev_week: input,
      });
      this.weeklyEarnings = res.weekly;

      this.weeklyLoading = false;
    },
    groupBy(key, array) {
      return array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});
    },
    isInWeek(date) {
      date = moment(date);
      var range = moment().range(
        moment().day(1).startOf("day"),
        moment().day(7).startOf("day")
      );
      return range.contains(date);
    },
    formatRange(app) {
      return (
        moment(app.start_date).format("ddd MMM D, hh:mma") +
        " - " +
        moment(app.end_date).format("hh:mma")
      );
    },
    formatRange2(app) {
      return (
        moment(app.start_date).format("hh:mma") +
        " - " +
        moment(app.end_date).format("hh:mma")
      );
    },
    fullname(student) {
      return student.first_name + " " + student.last_name;
    },
    formatMoney(val) {
      return val?.toLocaleString("en-PH", {
        currency: "PHP",
        style: "currency",
      });
    },
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

.studentHeader:nth-child(n + 2) {
  margin-top: 15px;
}

.weekOptions {
  margin-left: 7px;
}

.earningsDetail {
  margin-top: 7px;
}
</style>
