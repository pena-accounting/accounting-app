<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <div class="badges p-mb-2">
          <span class="p-tag">Paid Sessions</span>
          <span class="p-tag" style="background-color: white; color: #007be5"
            >Unpaid Sessions</span
          >
        </div>
        <FullCalendar
          :events="filteredAppointments"
          :options="options"
          ref="fullCalendar"
        />

        <Dialog
          v-model:visible="eventDialog"
          :style="{ width: '450px' }"
          header="Session Details"
          :modal="true"
          :closable="true"
          v-on:hide="mode='view'"
        >
          <!-- <Toast /> -->

          <div class="p-fluid">
            <div class="p-field">
              <label for="title">Topic</label>
              <InputText
                id="title"
                v-if="clickedEvent"
                v-model="changedEvent.topic"
                required="true"
                :disabled="mode == 'view'"
                autofocus
              />
            </div>
            <div class="p-field">
              <label for="start">From</label>
              <Calendar
                id="start"
                v-if="clickedEvent"
                v-model="changedEvent.start"
                hourFormat="12"
                :showTime="true"
                appendTo="body"
                :disabled="mode == 'view'"
              />
            </div>
            <div class="p-field">
              <label for="end">To</label>
              <Calendar
                id="end"
                v-if="clickedEvent"
                v-model="changedEvent.end"
                hourFormat="12"
                :showTime="true"
                appendTo="body"
                :disabled="mode == 'view'"
              />
            </div>
            <div class="p-field">
              <label for="title">Tutor</label>
              <Dropdown
                  placeholder="Select One"
                  v-if="clickedEvent"
                  v-model="changedEvent.tutor_object"
                  :options="tutors"
                  optionLabel="fullname"
                  :disabled="mode == 'view'"
                ></Dropdown>
            </div>
            <div class="p-field p-col-6 p-md-6">
              <label for="allday">Paid</label>
              <ToggleButton
                id="allday"
                v-model="changedEvent.paid"
                onLabel="Yes"
                offLabel="No"
                @click="togglePaid"
                :disabled="mode!='view'"
              />
            </div>
          </div>
          <template #footer>
            <Button
              label="Delete"
              icon="pi pi-trash"
              class="p-button-text p-button-danger"
              v-if="mode === 'view'"
              @click="archiveAppointment"
            />
            <Button
              label="Edit"
              icon="pi pi-user-edit"
              class="p-button-text"
              v-if="mode === 'view'"
              @click="mode = 'edit'"
            />

            <Button
              label="Save"
              icon="pi pi-check"
              class="p-button-text"
              @click="save"
              v-if="mode === 'edit'"
            />
            <Button
              label="Reset"
              icon="pi pi-refresh"
              class="p-button-text"
              @click="reset"
              v-if="mode === 'edit'"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import AppointmentService from "../service/AppointmentService";
import TutorService from "../service/TutorService";
import StudentService from "../service/StudentService";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

export default {
  data() {
    return {
      eventDialog: false,
      clickedEvent: null,
      changedEvent: {
        title: "",
        start: null,
        end: "",
        allDay: null,
        paid: null,
      },
      options: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultDate: new Date(),
        defaultView: "timeGridWeek",
        header: {
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        editable: false,
        firstDay:1,
        eventClick: (e) => {
          this.eventDialog = true;
          // console.log(e);
          this.clickedEvent = e.event;
          // console.log(this.clickedEvent);
          this.changedEvent.title = this.clickedEvent.title;
          this.changedEvent.start = this.clickedEvent.start;
          this.changedEvent.end = this.clickedEvent.end;
          this.changedEvent.paid = this.clickedEvent.extendedProps.paid;
          this.changedEvent.topic = this.clickedEvent.extendedProps.topic;
          this.changedEvent.fullname = this.clickedEvent.extendedProps.fullname;
          this.changedEvent.student = this.clickedEvent.extendedProps.student;
          this.changedEvent.tutor_object = this.clickedEvent.extendedProps.tutor_object;
        },
        customButtons: {
          prev: {
            // this overrides the prev button
            text: "PREV",
            click: () => {
              // console.log("eventPrev");
              const calendar = this.$refs.fullCalendar.calendar;
              calendar.prev();
              // console.log(calendar.calendar.view);
            },
          },
          next: {
            // this overrides the next button
            text: "NEXT",
            click: () => {
              // console.log("eventNext");
              const calendar = this.$refs.fullCalendar.calendar;
              calendar.next();
              // console.log(calendar.calendar.view);
            },
          },
        },
      },
      events: null,
      appointments: null,
      filteredAppointments:null,
      students: null,
      mode: "view",
      tutors:null
    };
  },
  tutorService: null,
  appointmentService: null,
  studentService: null,
  props: {
    curTutor: Object,
  },
  created() {
    this.appointmentService = new AppointmentService();
    this.studentService = new StudentService();
    this.tutorService = new TutorService();
  },
  async mounted() {
    try {
      this.students = await this.studentService.getStudents();
      this.tutors = await this.tutorService.getUnarchivedTutors();
      this.tutors = this.tutors.map((tutor) => ({
      ...tutor,
      fullname: tutor.first_name + " " + tutor.last_name,
    }));

      const data = await this.appointmentService.getAppointments();
      this.appointments = data.results;

      // add necessary fields to all appointments
      this.appointments.forEach((appointment) => {
        appointment["start"] = appointment.start_date;
        appointment["end"] = appointment.end_date;
        if (!appointment.paid) {
          appointment["backgroundColor"] = "white";
          appointment["textColor"] = "#007be5";
        }
        const student = this.students.find((s) => {
          return s.id == appointment["student"];
        });
        appointment["fullname"] = student.first_name + " " + student.last_name;
        appointment["title"] =
          appointment["fullname"] + (appointment.topic === "" ? "" : ": " + appointment.topic)
        const tutor = this.tutors.find((t) => {
          return t.id == appointment["tutor"];
        });

        appointment["tutor_object"] = tutor;
      });

      if (this.appointments.length == 0) {
        this.showWarn("No Sessions", "You have not added any sessions yet");
        return;
      }

      this.filteredAppointments = this.curTutor.id === undefined ? this.appointments : this.appointments.filter((app) => app.tutor === this.curTutor.id) 

    } catch (err) {
      console.log(err.response);
    }
  },
  watch: {
    curTutor: function () {
      this.filteredAppointments = this.curTutor.id === undefined ? this.appointments : this.appointments.filter((app) => app.tutor === this.curTutor.id)
    },
  },
  methods: {
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].id === id) {
          index = i;
          break;
        }
      }

      return index;
    },
    async save() {
      try {
        const res = await this.appointmentService.editAppointment({
          appointment:this.clickedEvent.id,
          start_date:moment(this.changedEvent.start).format("YYYY-MM-DDTHH:mm:ss"),
          end_date:moment(this.changedEvent.end).format("YYYY-MM-DDTHH:mm:ss"),
          student:this.changedEvent.student,
          topic:this.changedEvent.topic,
          paid:this.changedEvent.paid,
          tutor:this.changedEvent.tutor_object.id
        })
        if (res.return_status != "Success") {
          this.showFail("Edit Appointment Fail", res.return_message);
          return;
        }
        const tutor = this.tutors.find((t) => {
          return t.id == res.appointments["tutor"];
        });
        res.appointments = {
          ...res.appointments,
          tutor_object:tutor
        }
        this.clickedEvent.setProp(
          "extendedProps",
          res.appointments
        );
        this.clickedEvent.setStart(this.changedEvent.start);
        this.clickedEvent.setEnd(this.changedEvent.end);
        this.clickedEvent.setProp(
          "title",
          this.changedEvent.fullname + (this.changedEvent.topic === "" ? "" : ": " + this.changedEvent.topic)
        );
        //  this.clickedEvent.setProp("extendedProps", result.appointments);
        // this.clickedEvent.setAllDay(this.changedEvent.allDay);

        // this.changedEvent = { title: "", start: null, end: "", allDay: null };

        this.showSuccess("Edit Success", "Successfully edited session");
        this.mode = "view";
        this.eventDialog = false;

        // console.log(this.clickedEvent);
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Edit Appointment Failed", err.message);
      }
    },
    reset() {
      this.changedEvent.title = this.clickedEvent.title;
      this.changedEvent.start = this.clickedEvent.start;
      this.changedEvent.end = this.clickedEvent.end;
      this.changedEvent.topic = this.clickedEvent.extendedProps.topic;
    },
    async togglePaid() {
      // console.log(this.clickedEvent)
      try {
        const result = await this.appointmentService.togglePaid({
          appointment: this.clickedEvent.id,
        });
        this.clickedEvent.setProp("extendedProps", result.appointments);
        if (result.appointments.paid) {
          this.clickedEvent.setProp("backgroundColor", "#007be5");
          this.clickedEvent.setProp("textColor", "white");
        } else {
          this.clickedEvent.setProp("backgroundColor", "white");
          this.clickedEvent.setProp("textColor", "#007be5");
        }
        this.showSuccess(
          "Toggle Status Success",
          "Successfully toggled paid status to " + result.appointments.paid
        );
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Failed to toggle status", err);
      }
    },
    async archiveAppointment() {
      try {
        await this.appointmentService.archiveAppointment({
          appointment: this.clickedEvent.id,
        });
        this.appointments = this.appointments.filter((app) => {
          return app.id != this.clickedEvent.id;
        });
        this.eventDialog = false;
        this.showSuccess("Delete Success", "Successfully deleted session");
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Delete Failed", err.message);
      }
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

<style lang="scss" scoped>
.badges {
  .p-badge,
  .p-tag {
    margin-right: 0.5rem;
  }
}
</style>
