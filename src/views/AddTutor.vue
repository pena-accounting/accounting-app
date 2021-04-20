<template>
  <div class="p-grid p-fluid">
    <div class="p-col-12">
      <div class="card">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-6">
            <label>First Name</label>
            <InputText
              v-model="tutor.first_name"
              type="text"
              :class="{ 'p-invalid': validationErrors.first_name && submitted }"
            />
            <small
              v-show="validationErrors.first_name && submitted"
              class="p-error"
              >First Name is required.</small
            >
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Last Name</label>
            <InputText
              v-model="tutor.last_name"
              type="text"
              :class="{ 'p-invalid': validationErrors.last_name && submitted }"
            />
            <small
              v-show="validationErrors.last_name && submitted"
              class="p-error"
              >Last Name is required.</small
            >
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Email</label>
            <InputText
              id="email"
              v-model="tutor.email"
              type="text"
              :class="{ 'p-invalid': validationErrors.email && submitted }"
            />
            <small
              v-show="validationErrors.email && submitted"
              class="p-error"
              >{{ validationErrors.email }}</small
            >
          </div>
          <div class="p-col-4 p-offset-8">
            <Button
              @click="addTutor"
              label="Submit"
              class="p-button-raised"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TutorService from '../service/TutorService';

export default {
  data() {
    return {
      tutor: {
        first_name: "",
        last_name: "",
        email: "",
      },
      familyGroups: null,
      validationErrors: {},
      submitted: false,
      avatars: [
        null,
        "avatar_1.png",
        "avatar_2.png",
        "avatar_3.png",
        "avatar_4.png",
      ],
    };
  },
  familyGroupService: null,
  studentService: null,
  tutorService:null,
  created() {
    this.tutorService = new TutorService();
  },
  async mounted() {

  },
  methods: {
    async addTutor() {
      this.submitted = true;
      if (this.validateForm()) {
        try {
          var newTutor = await this.tutorService.addTutor(this.tutor);
          console.log(newTutor)
          newTutor = newTutor.tutor;
          this.showSuccess(
            "Add Tutor Success",
            "Successfully added " +
              newTutor.first_name +
              " " +
              newTutor.last_name
          );
          this.reset();
        } catch (err) {
          console.log(err.response.data);
          this.showFail("Add Tutor Failed", err);
        }
      }
    },
    reset() {
      this.tutor = {
        first_name: "",
        last_name: "",
        email: "",
      };
    },
    validateForm() {
      if (!this.tutor.first_name.trim())
        this.validationErrors["first_name"] = true;
      else delete this.validationErrors["first_name"];

      if (!this.tutor.last_name.trim())
        this.validationErrors["last_name"] = true;
      else delete this.validationErrors["last_name"];

      // if (!this.tutor.email.trim())
      //   this.validationErrors["email"] = "Email is required.";
      if (this.tutor.email.trim() && !this.validateEmail(this.tutor.email.trim()))
        this.validationErrors["email"] = "Invalid email.";
      else delete this.validationErrors["email"];

      return !Object.keys(this.validationErrors).length;
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
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

<style scoped lang="scss">
.p-multiselect {
  min-width: 15rem;
}

.multiselect-custom {
  .p-multiselect-label:not(.p-placeholder) {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  .country-item {
    display: flex;
    align-items: center;

    span.flag {
      width: 18px;
      height: 12px;
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    }
  }

  .country-item-value {
    border-radius: 3px;
    display: inline-flex;
    margin-right: 0.5rem;
    background-color: #2196f3;
    color: #ffffff;
  }
}

.center {
  display: block;
  margin: auto;
}
</style>
