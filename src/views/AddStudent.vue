<template>
  <div class="p-grid p-fluid">
    <div class="p-col-12">
      <div class="card">
        <!-- <Toast /> -->
        <!-- <h5>Advanced</h5> -->
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12 p-md-6">
            <label>First Name</label>
            <InputText
              v-model="student.first_name"
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
              v-model="student.last_name"
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
            <label>Sex</label>
            <div class="p-grid">
              <div class="p-col-12 p-md-4 p-mt-3">
                <div class="p-field-radiobutton">
                  <RadioButton
                    name="option"
                    value="male"
                    v-model="student.sex"
                  />
                  <label for="option1">Male</label>
                </div>
              </div>
              <div class="p-col-12 p-md-4 p-mt-3">
                <div class="p-field-radiobutton">
                  <RadioButton
                    name="option"
                    value="female"
                    v-model="student.sex"
                  />
                  <label>Female</label>
                </div>
              </div>
            </div>
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Birth Date</label>
            <Calendar
              :showIcon="true"
              :showButtonBar="true"
              v-model="student.birthday"
            ></Calendar>
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Email</label>
            <InputText
              id="email"
              v-model="student.email"
              type="text"
              :class="{ 'p-invalid': validationErrors.email && submitted }"
            />
            <small
              v-show="validationErrors.email && submitted"
              class="p-error"
              >{{ validationErrors.email }}</small
            >
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Contact Number</label>
            <InputText v-model="student.contact_number" type="text" />
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>School</label>
            <InputText
              v-model="student.school"
              type="text"
              :class="{ 'p-invalid': validationErrors.school && submitted }"
            />
            <small v-show="validationErrors.school && submitted" class="p-error"
              >School is required.</small
            >
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Rate</label>
            <InputText
              v-model="student.rate"
              type="text"
              :class="{ 'p-invalid': validationErrors.rate && submitted }"
            />
            <small
              v-show="validationErrors.rate && submitted"
              class="p-error"
              >{{ validationErrors.rate }}</small
            >
          </div>
          <!-- <div class="p-field p-col-12 p-md-6">
            <label>Family Group</label>
            <div class="p-grid">
              <div class="p-col-12 p-md-4 p-mt-3">
                <div class="p-field-radiobutton">
                  <RadioButton name="option" :value="true" v-model="isFamily" />
                  <label for="option1">Yes</label>
                </div>
              </div>
              <div class="p-col-12 p-md-4 p-mt-3">
                <div class="p-field-radiobutton">
                  <RadioButton
                    name="option"
                    :value="false"
                    v-model="isFamily"
                    :disable="familyGroups == null || familyGroups.length == 0"
                  />
                  <label>No</label>
                </div>
              </div>
            </div>
          </div> -->

          <div class="p-field p-col-12 p-md-6">
            <label>Family Group</label>
            <Dropdown
              v-model="student.family_group"
              :options="familyGroups"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>
          <div class="p-field p-col-12 p-md-6">
            <label>Avatar</label>
            <SelectButton v-model="student.avatar" :options="avatars">
              <template #option="slotProps">
                <div class="center">
                  <img
                    v-if="slotProps.option"
                    :alt="slotProps.option"
                    :src="'assets/layout/images/' + slotProps.option"
                  />
                  <div style="text-align: center" v-else>None</div>
                  <!-- <div>{{slotProps.option}}</div> -->
                </div>
              </template>
            </SelectButton>
          </div>
          <div class="p-col-4 p-offset-8">
            <Button
              @click="addStudent"
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
import FamilyGroupService from "../service/FamilyGroupService";
import StudentService from "../service/StudentService";

export default {
  data() {
    return {
      student: {
        first_name: "",
        last_name: "",
        sex: "male",
        birthday: new Date(),
        email: "",
        contact_number: "",
        school: "",
        rate: "",
        family_group: null,
        avatar: null,
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
  created() {
    this.studentService = new StudentService();
    this.familyGroupService = new FamilyGroupService();
  },
  async mounted() {
    const data = await this.familyGroupService.getFamilyGroups();
    const noneOption = { name: "None" };
    this.student.family_group = noneOption;
    this.familyGroups = [noneOption, ...data];
  },
  methods: {
    async addStudent() {
      this.submitted = true;
      if (this.validateForm()) {
        try {
          var res = await this.studentService.addStudent({
            ...this.student,
            family_group:
              this.student.family_group.name == "None"
                ? null
                : this.student.family_group.id,
            avatars: this.student.avatar ?? "",
          });
          console.log(res)
          if (res.return_status == "error") {
            this.showFail("Add Student Failed", res.return_message);
            return
          }
          const newStudent = res.student;
          this.showSuccess(
            "Add Student Success",
            "Successfully added " +
              newStudent.first_name +
              " " +
              newStudent.last_name
          );
          this.reset();
        } catch (err) {
          console.log(err.response.data);
          this.showFail("Add Student Failed", err);
        }
      }
    },
    reset() {
      this.student = {
        first_name: "",
        last_name: "",
        sex: "male",
        birthday: new Date(),
        email: "",
        contact_number: "",
        school: "",
        rate: "",
        family_group: null,
        avatar: null,
      };
      const noneOption = { name: "None" };
      this.student.family_group = noneOption;
    },
    validateForm() {
      if (!this.student.first_name.trim())
        this.validationErrors["first_name"] = true;
      else delete this.validationErrors["first_name"];

      if (!this.student.last_name.trim())
        this.validationErrors["last_name"] = true;
      else delete this.validationErrors["last_name"];

      // if (!this.student.email.trim())
      //   this.validationErrors["email"] = "Email is required.";
      // else if (!this.validateEmail(this.student.email.trim()))
      //   this.validationErrors["email"] = "Invalid email.";
      // else delete this.validationErrors["email"];

      if (!this.student.school.trim()) this.validationErrors["school"] = true;
      else delete this.validationErrors["school"];

      if (!this.student.rate.trim())
        this.validationErrors["rate"] = "Rate is required.";
      else if (isNaN(this.student.rate.trim()))
        this.validationErrors["rate"] = "Rate must be a number.";
      else delete this.validationErrors["rate"];

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
