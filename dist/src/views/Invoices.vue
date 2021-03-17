<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <h5>Filter</h5>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-6">
            <label>Filter by</label>
            <div class="p-grid">
              <div class="p-col-6 p-mt-3">
                <div class="p-field-radiobutton">
                  <RadioButton
                    name="option"
                    value="student"
                    v-model="filterBy"
                    @click="famGrp = null"
                    :disabled="allStudents == null || allStudents.length == 0"
                  />
                  <label for="option1">Student</label>
                </div>
              </div>
              <div class="p-col-6 p-mt-3">
                <div class="p-field-radiobutton">
                  <RadioButton
                    name="option"
                    value="famGrp"
                    v-model="filterBy"
                    @click="student = null"
                    :disabled="familyGroups == null || familyGroups.length == 0"
                  />
                  <label>Family Group</label>
                </div>
              </div>
              <div class="p-field p-col-6">
                <label>From</label>
                <Calendar
                  v-model="range.from"
                  :showIcon="true"
                  selectionMode="single"
                ></Calendar>
              </div>
              <div class="p-field p-col-6">
                <label>To</label>
                <Calendar
                  v-model="range.to"
                  :showIcon="true"
                  selectionMode="single"
                ></Calendar>
              </div>
              <div
                v-if="filterBy === 'student'"
                class="p-field p-col-12 p-md-6"
              >
                <label>Student</label>
                <Dropdown
                  v-model="student"
                  :options="allStudents"
                  optionLabel="fullname"
                  placeholder="Select One"
                  :disabled="allStudents == null || allSessions == null"
                ></Dropdown>
              </div>
              <div v-if="filterBy === 'famGrp'" class="p-field p-col-12 p-md-6">
                <label>Family Group</label>
                <Dropdown
                  v-model="famGrp"
                  :options="familyGroups"
                  placeholder="Select One"
                  optionLabel="name"
                  :disabled="familyGroups == null || allSessions == null"
                ></Dropdown>
              </div>
              <div class="p-field p-col-12 p-md-6">
                <label>Status</label>
                <Dropdown v-model="status" :options="statusOptions"></Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="p-col-12"
      v-if="
        (filterBy === 'student' && student != null) ||
        (filterBy === 'famGrp' && famGrp != null)
      "
    >
      <div class="card">
        <h5>
          Invoice of
          <span v-if="filterBy === 'student'">
            <b>{{ student.fullname }}</b>
          </span>
          <span v-if="filterBy === 'famGrp'">
            the <b>{{ famGrp.name }} Family</b>
          </span>
          from <u>{{ formatRange() }}</u>
        </h5>
        <!-- <p>
          Use this page to start from scratch and place your custom content.
        </p> -->
        <div class="p-grid">
          <div class="p-col-12 p-md-4">
            <div class="card">
              <h5>Session/s</h5>
              <ScrollPanel
                v-if="filteredSessions.length > 0"
                style="width: 100%; height: 500px"
                class="custom p-shadow-1"
              >
                <Card
                  v-for="session in filteredSessions"
                  :key="session.id"
                  class="p-mb-2 p-shadow-1"
                >
                  <template #title>
                    <h5 style="margin-bottom: 0">{{ formatDate(session) }}</h5>
                    <!-- <Button icon="pi pi-plus" class="p-button-text" /> -->
                  </template>

                  <template #subtitle
                    ><span>{{ formatTime(session) }}</span>
                  </template>

                  <template #content>
                    <div class="cardContent">
                      <span v-if="session.student_object.avatars">
                        <img
                          :src="
                            'assets/layout/images/' +
                            session.student_object.avatars
                          "
                        />
                      </span>
                      <p>
                        {{ session.student_object.fullname }}
                        <br />Topic: {{ session.topic }}
                      </p>
                    </div>
                    <span v-if="session.paid" class="p-tag">Paid</span>
                  </template>
                </Card>
              </ScrollPanel>
              <span v-else class="p-badge p-badge-lg p-badge-warning"
                >No Sessions Found</span
              >
            </div>
          </div>
          <div class="p-col-12 p-md-8">
            <div class="card">
              <h5>Amount Breakdown</h5>
              <DataTable
                :value="filteredStudents"
                class="p-datatable-customers"
                :rows="10"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
              >
                <!-- <template #header>
                  <div class="table-header">
                    List of Students
                    <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText
                        v-model="filters1['global']"
                        placeholder="Global Search"
                      />
                    </span>
                  </div>
                </template> -->
                <template #empty> No students found. </template>
                <template #loading>
                  Loading students data. Please wait.
                </template>
                <Column field="name" header="Name">
                  <template #body="slotProps">
                    {{ slotProps.data.fullname }}
                  </template>
                </Column>
                <Column field="sessions" header="Time">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.time }}</span>
                  </template>
                </Column>
                <Column field="rate" header="Rate">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.rate }}</span>
                  </template>
                </Column>
                <Column field="total" header="Amount">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.total }}</span>
                  </template>
                </Column>
                <template #footer>
                  <td colspan="3" style="text-align: right">
                    Total: {{ totalRate }}
                  </td>
                </template>
              </DataTable>
              <div
                class="p-formgroup p-mt-2"
                v-if="status == 'Not Paid' && filteredSessions?.length != 0"
              >
                <!-- <div class="p-field">
              <label class="p-sr-only">Name</label>
              <InputText
                type="text"
                placeholder="Family Name"
                v-model="form.name"
                :class="{ 'p-invalid': validationErrors.name && submitted }"
              />
              <small v-show="validationErrors.name && submitted" class="p-error"
                >Name is required.</small
              >
            </div> -->
                <Button label="Update All to Paid" @click="payAll"></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StudentService from "../service/StudentService";
import AppointmentService from "../service/AppointmentService";
import FamilyGroupService from "../service/FamilyGroupService";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default {
  data() {
    return {
      filterBy: "student",
      allStudents: null,
      filteredStudents: [],
      student: null,
      famGrp: null,
      range: {
        from: new Date(moment().day(1)),
        to: new Date(moment().day(7)),
      },
      status: "Both",
      statusOptions: ["Paid", "Not Paid", "Both"],
      familyGroups: null,
      allSessions: null,
      filteredSessions: [],
      loading: false,
    };
  },
  studentService: null,
  familyGroupService: null,
  appointmentService: null,
  created() {
    this.studentService = new StudentService();
    this.familyGroupService = new FamilyGroupService();
    this.appointmentService = new AppointmentService();
  },
  async mounted() {
    this.allStudents = await this.studentService.getStudents();
    this.allStudents = this.allStudents.filter((s) => {
      return !s.archive;
    });

    this.allStudents = this.allStudents.map((student) => ({
      ...student,
      fullname: student.first_name + " " + student.last_name,
    }));

    this.updateSessions();

    this.familyGroups = await this.familyGroupService.getFamilyGroups();
    this.loading = false;
  },
  computed: {
    totalRate() {
      return this.filteredStudents.length == 0
        ? 0
        : this.filteredStudents.reduce((a, c) => a + c.total, 0);
    },
    lastNames() {
      return this.allStudents == null
        ? []
        : this.allStudents.map(({ name }) => name.split(" ")[1]);
    },
  },
  watch: {
    famGrp: function (newGrp) {
      if (newGrp == null) {
        this.filteredSessions = [];
        return;
      }
      this.updateFilter();
    },
    student: function (newStudent) {
      // console.log(newStudent);
      // console.log(oldStudent);
      if (newStudent == null) {
        this.filteredSessions = [];
        return;
      }
      this.updateFilter();
    },
    range: {
      handler: function () {
        // console.log(newRange);
        // console.log(oldRange);
        if (
          (this.filterBy == "student" && this.student == null) ||
          (this.filterBy == "famGrp" && this.famGrp == null)
        ) {
          return;
        }
        this.updateFilter();
      },
      deep: true,
    },
    status: function () {
      if (
        (this.filterBy == "student" && this.student == null) ||
        (this.filterBy == "famGrp" && this.famGrp == null)
      ) {
        return;
      }
      this.updateFilter();
    },
  },
  methods: {
    isInRange(date) {
      date = moment(date);
      var range = moment().range(
        moment(this.range.from).startOf("day"),
        moment(this.range.to).endOf("day")
      );
      return range.contains(date);
    },
    updateFilter() {
      this.loading = true;

      if (this.filterBy == "student") {
        this.filteredSessions = this.allSessions.filter((session) => {
          return (
            session.student == this.student.id &&
            (this.status == "Both"
              ? true
              : this.status == "Paid"
              ? session.paid
              : !session.paid) &&
            this.isInRange(session.start_date)
          );
        });

        this.filteredStudents = this.allStudents.filter((st) => {
          return st.id == this.student.id;
        });

        let totalHours = 0;
        let totalMinutes = 0;
        this.filteredSessions.forEach((sesh) => {
          totalHours += sesh.nos_of_hours;
          totalMinutes += sesh.nos_of_mins;
        });
        while (totalMinutes >= 60) {
          totalMinutes -= 60;
          totalHours += 1;
        }
        this.filteredStudents[0].time =
          totalHours + "hr " + totalMinutes + "min";
        this.filteredStudents[0].sessions = this.filteredSessions.length;

        const hourFee = totalHours * this.filteredStudents[0].rate;
        const quarterlyRate = this.filteredStudents[0].rate / 4;
        let minutesFee = 0;
        if (totalMinutes == 15) minutesFee += quarterlyRate * 1;
        else if (totalMinutes == 30) minutesFee += quarterlyRate * 2;
        else if (totalMinutes == 45) minutesFee += quarterlyRate * 3;

        this.filteredStudents[0].total = hourFee + minutesFee;
      } else {
        // const group = this.famGrp;
        const ids = this.famGrp.students.map((st) => st.id);

        this.filteredSessions = this.allSessions.filter((session) => {
          return (
            ids.includes(session.student) &&
            (this.status == "Both"
              ? true
              : this.status == "Paid"
              ? session.paid
              : !session.paid) &&
            this.isInRange(session.start_date)
          );
        });

        this.filteredStudents = this.allStudents.filter((student) => {
          return ids.includes(student.id);
        });

        this.filteredStudents.forEach((student) => {
          const filtered = this.filteredSessions.filter((session) => {
            return session.student == student.id;
          });

          let totalHours = 0;
          let totalMinutes = 0;
          filtered.forEach((sesh) => {
            totalHours += sesh.nos_of_hours;
            totalMinutes += sesh.nos_of_mins;
          });

          while (totalMinutes >= 60) {
            totalMinutes -= 60;
            totalHours += 1;
          }

          student.time = totalHours + "hr " + totalMinutes + "min";

          const hourFee = totalHours * student.rate;
          const quarterlyRate = student.rate / 4;
          let minutesFee = 0;
          if (totalMinutes == 15) minutesFee += quarterlyRate * 1;
          else if (totalMinutes == 30) minutesFee += quarterlyRate * 2;
          else if (totalMinutes == 45) minutesFee += quarterlyRate * 3;

          student.sessions = filtered.length;
          student.total = hourFee + minutesFee;
        });
      }

      this.loading = false;
    },
    async updateSessions() {
      try {
        this.allSessions = await this.appointmentService.getAppointments();
        this.allSessions = this.allSessions.results;
        this.allSessions = this.allSessions.map((session) => ({
          ...session,
          student_object: this.allStudents.find((student) => {
            return session.student == student.id;
          }),
        }));
      } catch (err) {
        // console.log(err.response.data);
        this.showFail("Failed to retrieve sessions", err.message);
      }
    },
    async payAll() {
      this.loading = true;

      try {
        if (this.famGrp == null) {
          // pay all for student
          await this.appointmentService.updateStudentToPaid({
            student: this.student.id,
            start_date: moment(this.range.from)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            end_date: moment(this.range.to)
              .endOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
          });

          await this.updateSessions();
          this.updateFilter();

          this.showSuccess(
            "Update Sucess",
            "Successfully updated sessions of " +
              this.student.fullname +
              " to paid"
          );
        } else if (this.student == null) {
          // pay all for family group
          const res = await this.appointmentService.updateFamilyToPaid({
            family_group: this.famGrp.id,
            start_date: moment(this.range.from)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            end_date: moment(this.range.to)
              .endOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
          });

          console.log(res);

          await this.updateSessions();
          this.updateFilter();

          this.showSuccess(
            "Update Sucess",
            "Successfully updated sessions of family " +
              this.famGrp.name +
              " to paid"
          );
        }
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Update Failed", err.message);
      }

      this.loading = false;
    },
    formatRange() {
      return (
        moment(this.range.from).format("ddd MMM D, YYYY") +
        " to " +
        moment(this.range.to).format("ddd MMM D, YYYY")
      );
    },
    formatDate(session) {
      return moment(session.start_date).format("MMM D, YYYY - dddd");
    },
    formatTime(session) {
      return (
        moment(session.start_date).format("h:mma") +
        " - " +
        moment(session.end_date).format("h:mma")
      );
    },
    showSuccess(summary, detail) {
      this.$toast.add({
        severity: "success",
        summary,
        detail,
        life: 3000,
      });
    },
    showFail(summary, detail) {
      this.$toast.add({
        severity: "error",
        summary,
        detail,
        life: 3000,
      });
    },
  },
};
</script>

<style>
.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1;
}

.cardContent {
  display: flex;
}

.cardContent p {
  margin-bottom: 5px;
}

.cardContent img {
  margin-right: 5px;
}
</style>
