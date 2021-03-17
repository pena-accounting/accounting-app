<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <!-- <Toast /> -->
        <!-- <h5>Advanced</h5> -->
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-6">
            <label>Student</label>
            <div v-if="loading" class="p-field p-col-12 p-md-6">
              <i class="pi pi-spin pi-spinner" style="fontsize: 4em"></i>
            </div>
            <Dropdown
              v-else
              v-model="appointment.student"
              :options="students"
              optionLabel="fullname"
              placeholder="Select One"
              :disabled="students == null || students.length == 0"
              :class="{ 'p-invalid': validationErrors.student && submitted }"
            ></Dropdown>
            <small
              v-show="validationErrors.student && submitted"
              class="p-error"
              >Student is required.</small
            >
          </div>

          <div class="p-field p-col-6">
            <label>Date</label>
            <Calendar
              v-model="appointment.date"
              :showIcon="true"
              selectionMode="single"
            ></Calendar>
          </div>
          <div class="p-field p-col-6 p-md-3">
            <label>From</label>
            <Calendar
              v-model="appointment.from"
              hourFormat="12"
              :showTime="true"
              :timeOnly="true"
            />
            <!-- <Dropdown
              v-model="appointment.time"
              :options="timeDropdown"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown> -->
          </div>
          <div class="p-field p-col-6 p-md-3">
            <label>To</label>
            <Calendar
              v-model="appointment.to"
              hourFormat="12"
              :showTime="true"
              :timeOnly="true"
              :class="{ 'p-invalid': validationErrors.to && submitted }"
            />
            <small v-show="validationErrors.to && submitted" class="p-error"
              >End time must be later than start time.</small
            >
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Topic</label>
            <InputText
              v-model="appointment.topic"
              type="text"
              :class="{ 'p-invalid': validationErrors.topic && submitted }"
            />
            <small v-show="validationErrors.topic && submitted" class="p-error"
              >Topic is required.</small
            >
          </div>
          <div class="p-field p-col-12 p-md-3">
            <label>Repeat</label>
            <Dropdown
              v-model="appointment.repeat"
              :options="repeatOptions"
              placeholder="Select One"
            ></Dropdown>
          </div>
          <div
            class="p-field p-col-12 p-md-3"
            v-if="appointment.repeat != 'None'"
          >
            <label>Until</label>
            <Calendar
              v-model="appointment.until"
              :class="{ 'p-invalid': validationErrors.until && submitted }"
            />
            <small v-show="validationErrors.until && submitted" class="p-error"
              >End date must be later than start date.</small
            >
          </div>

          <div class="p-field p-col-12 p-md-6">
            <label>Paid</label>
            <ToggleButton
              v-model="appointment.paid"
              onLabel="Yes"
              offLabel="No"
            />
          </div>
          <div class="p-col-4 p-offset-8">
            <Button
              @click="addAppointment"
              label="Submit"
              class="p-button-raised"
              :disabled="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StudentService from "../service/StudentService";
import AppointmentService from "../service/AppointmentService";
import moment from "moment";

export default {
  data() {
    return {
      timeDropdown: [
        { name: "1 Hour", code: "1 Hour" },
        { name: "2 Hours", code: "2 Hours" },
        { name: "3 Hours", code: "3 Hours" },
      ],
      appointment: {
        from: new Date(),
        to: new Date(moment().add(1, "hours")),
        paid: false,
        student: null,
        date: new Date(),
        topic: "",
        repeat: "None",
        until: new Date(moment().add(7, "days")),
      },
      repeatOptions: ["None", "Every Week", "Every Day"],
      students: [],
      validationErrors: {},
      submitted: false,
      loading: true,
    };
  },
  studentService: null,
  appointmentService: null,
  created() {
    this.studentService = new StudentService();
    this.appointmentService = new AppointmentService();
  },
  async mounted() {
    try {
      const data = await this.studentService.getStudents();
      this.students = data;
      this.students = this.students.filter((s) => {
        return !s.archive;
      });
      this.students = this.students.map((student) => ({
        ...student,
        fullname: student.first_name + " " + student.last_name,
      }));
      if (this.students.length == 0) {
        this.showWarn("No Students Added", "Add students first before adding appointments")
      }
    } catch (err) {
      this.showFail("Error", err);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    app: function () {
      const date = moment(this.appointment.date).format().slice(0, 10);
      return {
        start_date: moment(
          date + this.appointment.from.toISOString().slice(10)
        ).format("YYYY-MM-DDTHH:mm:ss"),
        end_date: moment(
          date + this.appointment.to.toISOString().slice(10)
        ).format("YYYY-MM-DDTHH:mm:ss"),
        student: this.appointment.student.id,
        topic: this.appointment.topic,
        paid: this.appointment.paid,
      };
    },
  },
  methods: {
    async addAppointment() {
      this.submitted = true;
      if (this.validateForm()) {
        if (this.appointment.repeat === "None") {
          // add single appointment
          try {
            // console.log(this.app)
            const res = await this.appointmentService.addAppointment(this.app);
            // console.log(res)
            if (res.return_status != "Success") {
              this.showFail("Add Appointment Fail", res.return_message);
              return;
            }
            this.reset();
            this.showSuccess(
              "Add Appointment Success",
              "Successfully added 1 appointment"
            );
          } catch (err) {
            console.log(err.response.data);
            this.showFail("Add Appointment Fail", err);
          }
        } else {
          // add recurring appointment
          try {
            const res = await this.appointmentService.addRecurringAppointment({
              ...this.app,
              recurring: this.appointment.repeat === "Every Week" ? 7 : 1,
              until: moment(this.appointment.until)
                .endOf("day")
                .format("YYYY-MM-DDTHH:mm:ss"),
            });
            if (res.return_status != "Success") {
              this.showFail(
                "Add Recurring Appointment Fail",
                res.return_message
              );
              return;
            }
            this.reset();
            this.showSuccess(
              "Add Recurring Appointment Success",
              "Successfully added recurring appointment"
            );
          } catch (err) {
            console.log(err.response.data);
            this.showFail("Add Recurring Appointment Fail", err);
          }
        }
      }
    },
    reset() {
      this.appointment = {
        from: this.appointment.from,
        to: this.appointment.to,
        paid: false,
        student: null,
        date: new Date(),
        topic: "",
        repeat: "None",
        until: new Date(moment().add(7, "days")),
      };
    },
    validateForm() {
      if (!this.appointment.topic.trim()) this.validationErrors["topic"] = true;
      else delete this.validationErrors["topic"];

      if (this.appointment.student == null)
        this.validationErrors["student"] = true;
      else delete this.validationErrors["student"];

      const from = moment(this.appointment.from);
      const to = moment(this.appointment.to);
      if (!from.isBefore(to)) this.validationErrors["to"] = true;
      else delete this.validationErrors["to"];

      if (
        this.appointment.repeat !== "None" &&
        !moment(this.appointment.date).isBefore(moment(this.appointment.until))
      )
        this.validationErrors["until"] = true;
      else delete this.validationErrors["until"];

      return !Object.keys(this.validationErrors).length;
    },
    showSuccess(summary, detail) {
      this.$toast.add({
        severity: "success",
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

<style scoped>
</style>
