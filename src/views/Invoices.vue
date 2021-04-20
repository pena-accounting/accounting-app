<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <h5>Filter Options</h5>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12">
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
                  :disabled="
                    allStudents == null ||
                    allSessions == null ||
                    allStudents.length <= 1
                  "
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
              <div class="p-field p-col-12 p-md-3">
                <label>Status</label>
                <Dropdown v-model="status" :options="statusOptions"></Dropdown>
              </div>
              <div class="p-field p-col-12 p-md-3">
                <label>Tutor</label>
                <Dropdown
                  placeholder="Select One"
                  v-model="tutor"
                  :options="tutors"
                  optionLabel="fullname"
                  :disabled="tutors.length === 0"
                ></Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProgressSpinner v-if="loading" strokeWidth="3"/>

    <div
      class="p-col-12"
      v-if="
        (filterBy === 'student' && student != null) ||
        (filterBy === 'famGrp' && famGrp != null)
      "
    >
      <div class="card">
        <!-- <p>
          Use this page to start from scratch and place your custom content.
        </p> -->
        <div class="p-grid">
          <div class="p-col-12 p-md-12">
            <div class="card">
              <!-- <h5>Amount Breakdown</h5> -->
              <div class="header">
                <h5>
                  Statement of
                  <span v-if="filterBy === 'student'">
                    <b>{{ student.fullname }}</b>
                  </span>
                  <span v-if="filterBy === 'famGrp'">
                    the <b>{{ famGrp.name }} Family</b>
                  </span>
                  from <u>{{ formatRange() }}</u>
                </h5>
                <Button
                  :disabled="filteredSessions.length == 0"
                  label="Save to Excel"
                  class="p-button-rounded p-button-outlined p-button-success p-mb-3"
                  @click="save"
                />
                <!-- <div v-if="filteredSessions.length!=0">
  <download-csv :data="filteredSessions">
    Download Data
</download-csv>
</div> -->
              </div>
              <DataTable
                :value="filteredSessions"
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
                <template #empty> No sessions found. </template>
                <template #loading> Loading sessions. Please wait. </template>
                <Column header="Date">
                  <template #body="slotProps">
                    {{ getDate(slotProps.data) }}
                  </template>
                </Column>
                <Column field="sessions" header="Time">
                  <template #body="slotProps">
                    <span>{{ formatTime(slotProps.data) }}</span>
                  </template>
                </Column>
                <Column field="name" header="Name">
                  <template #body="slotProps">
                    {{ slotProps.data.student_object.fullname }}
                  </template>
                </Column>
                <Column header="Tutor">
                  <template #body="slotProps">
                    {{ slotProps.data.tutor_object.fullname }}
                  </template>
                </Column>
                <Column header="Hours">
                  <template #body="slotProps">
                    {{ formatHours(slotProps.data) }}
                  </template>
                </Column>
                <!-- <Column field="rate" header="Rate">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.student_object.rate }}</span>
                  </template>
                </Column> -->
                <Column field="total" header="Amount">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.total }}</span>
                  </template>
                </Column>
                <template #footer>
                  <table style="text-align: left">
                    <tr>
                      <td colspan="4"></td>
                      <td style="padding-left: 15px">
                        {{ totalTime }}
                      </td>
                      <td style="padding-left: 15px">
                        {{ totalRate }}
                      </td>
                    </tr>
                  </table>
                </template>
              </DataTable>
              <div
                class="p-formgroup p-mt-2"
                v-if="status == 'Not Paid' && filteredSessions?.length != 0"
              >
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
import TutorService from "../service/TutorService";
import Moment from "moment";
import { extendMoment } from "moment-range";
import exportFromJSON from "export-from-json";

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
      status: "Not Paid",
      statusOptions: ["Paid", "Not Paid", "Both"],
      familyGroups: null,
      allSessions: null,
      filteredSessions: [],
      loading: true,
      tutors: [],
      tutor: null,
      allStudentsOption: {
        fullname: "All Students",
      },
      allTutorsOption: {
        fullname: "All Tutors",
      },
    };
  },
  studentService: null,
  familyGroupService: null,
  appointmentService: null,
  tutorService: null,
  created() {
    this.studentService = new StudentService();
    this.familyGroupService = new FamilyGroupService();
    this.appointmentService = new AppointmentService();
    this.tutorService = new TutorService();
  },
  async mounted() {
    this.allStudents = await this.studentService.getUnarchivedStudents();
    // this.allStudents = this.allStudents.filter((s) => {
    //   return !s.archive;
    // });

    this.allStudents = this.allStudents.map((student) => ({
      ...student,
      fullname: student.first_name + " " + student.last_name,
    }));

    this.allStudents.unshift(this.allStudentsOption);
    this.tutors = await this.tutorService.getUnarchivedTutors();
    this.tutors = this.tutors.map((tutor) => ({
      ...tutor,
      fullname: tutor.first_name + " " + tutor.last_name,
    }));
    await this.updateSessions();

    this.tutors.unshift(this.allTutorsOption);
    this.tutor = this.allTutorsOption;
    if (this.allStudents.length > 1) {
      this.student = this.allStudentsOption;
    } else {
      this.showWarn(
        "No Students Added",
        "Add students first before viewing statements"
      );
    }

    this.familyGroups = await this.familyGroupService.getFamilyGroups();
    this.loading = false;
  },
  computed: {
    totalRate() {
      return this.filteredSessions.length == 0
        ? 0
        : this.filteredSessions.reduce((a, c) => a + c.total, 0);
      // return this.filteredStudents.length == 0
      //   ? 0
      //   : this.filteredStudents.reduce((a, c) => a + c.total, 0);
    },
    totalTime() {
      let hours =
        this.filteredSessions.length == 0
          ? 0
          : this.filteredSessions.reduce((a, c) => a + c.nos_of_hours, 0);

      let minutes =
        this.filteredSessions.length == 0
          ? 0
          : this.filteredSessions.reduce((a, c) => a + c.nos_of_mins, 0);

      while (minutes >= 60) {
        minutes -= 60;
        hours += 1;
      }

      const minuteField = minutes === 0 ? "" : minutes + "mins";
      return hours + "hrs " + minuteField;
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
    tutor: function () {
      if (
        (this.filterBy == "student" && this.student == null) ||
        (this.filterBy == "famGrp" && this.famGrp == null)
      ) {
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
        const allStudentsMode =
          this.student.fullname === this.allStudentsOption.fullname;

        const allTutorsMode =
          this.tutor.fullname === this.allTutorsOption.fullname;

        this.filteredSessions = this.allSessions.filter((session) => {
          return (
            (allStudentsMode ? true : session.student == this.student.id) &&
            (allTutorsMode ? true : session.tutor == this.tutor.id) &&
            (this.status == "Both"
              ? true
              : this.status == "Paid"
              ? session.paid
              : !session.paid) &&
            this.isInRange(session.start_date)
          );
        });
        // console.log(this.filteredSessions);
      } else {
        // const group = this.famGrp;
        const ids = this.famGrp.students.map((st) => st.id);

        const allTutorsMode =
          this.tutor.fullname === this.allTutorsOption.fullname;

        this.filteredSessions = this.allSessions.filter((session) => {
          return (
            ids.includes(session.student) &&
            (allTutorsMode ? true : session.tutor == this.tutor.id) &&
            (this.status == "Both"
              ? true
              : this.status == "Paid"
              ? session.paid
              : !session.paid) &&
            this.isInRange(session.start_date)
          );
        });
      }

      this.loading = false;
    },
    async updateSessions() {
      try {
        this.allSessions = await this.appointmentService.getAppointments();
        this.allSessions = this.allSessions.results;
        this.allSessions = this.allSessions.map((session) => {
          const foundStudent = this.allStudents.find((student) => {
            return session.student == student.id;
          });

          const foundTutor = this.tutors.find((tutor) => {
            return tutor.id == session.tutor;
          });

          const hourFee = session.nos_of_hours * foundStudent.rate;
          const quarterlyRate = foundStudent.rate / 4;

          let minutesFee = 0;
          if (session.nos_of_mins == 15) minutesFee += quarterlyRate * 1;
          else if (session.nos_of_mins == 30) minutesFee += quarterlyRate * 2;
          else if (session.nos_of_mins == 45) minutesFee += quarterlyRate * 3;

          const total = hourFee + minutesFee;
          return {
            ...session,
            student_object: foundStudent,
            total,
            tutor_object: foundTutor,
          };
        });
      } catch (err) {
        // console.log(err.response.data);
        this.showFail("Failed to retrieve sessions", err.message);
      }
    },
    async payAll() {
      this.loading = true;
      const allTutorsMode =
        this.tutor.fullname === this.allTutorsOption.fullname;
      try {
        if (this.famGrp == null) {
          const allStudentsMode =
            this.student.fullname === this.allStudentsOption.fullname;
          // pay all for student
          await this.appointmentService.updateStudentToPaid({
            student: allStudentsMode ? "all" : this.student.id,
            tutor: allTutorsMode ? "all" : this.tutor.id,
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
          await this.appointmentService.updateFamilyToPaid({
            family_group: this.famGrp.id,
            tutor: allTutorsMode ? "all" : this.tutor.id,
            start_date: moment(this.range.from)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            end_date: moment(this.range.to)
              .endOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
          });

          // console.log(res);

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
    formatHours(session) {
      const minuteField =
        session.nos_of_mins === 0 ? "" : session.nos_of_mins + "min";
      return session.nos_of_hours + "hr " + minuteField;
    },
    getDate(session) {
      return moment(session.start_date).format("D-MMM");
    },
    save() {
      const data = this.filteredSessions.map((sesh) => ({
        Date: this.getDate(sesh),
        Time: this.formatTime(sesh),
        Name: sesh.student_object.fullname,
        Tutor: sesh.tutor_object.fullname,
        Hours: this.formatHours(sesh),
        Amount: sesh.total,
      }));
      data.push({
        Date: "",
        Time: "",
        Name: "",
        Tutor: "",
        Hours: this.totalTime,
        Amount: this.totalRate,
      });
      const fileName = "statement-" + Date.now();
      const exportType = "xls";
      exportFromJSON({
        data,
        fileName,
        exportType,
      });
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
    showWarn(summary, detail) {
      this.$toast.add({
        severity: "warn",
        summary,
        detail,
        life: 7000,
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

div.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@keyframes p-progress-spinner-color {
    100%,
    0% {
        stroke: #0057e7;
    }
    40% {
        stroke: #1863db;
    }
    66% {
        stroke: rgb(78, 126, 202);
    }
    80%,
    90% {
        stroke: rgb(96, 137, 202);
    }
}
</style>
