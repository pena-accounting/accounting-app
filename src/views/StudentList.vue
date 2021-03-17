<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <!-- <Toast /> -->
        <!-- <h4>Default</h4>
        <p>Pagination, sorting, filtering and checkbox selection.</p> -->
        <DataTable
          :value="filteredStudents"
          :paginator="true"
          class="p-datatable-customers"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          v-model:selection="selectedStudents"
          :loading="loading"
        >
          <template #header>
            <div class="table-header">
              List of Students
              <Dropdown
                v-model="filterOption"
                :options="filterOptions"
                placeholder="Select One"
              ></Dropdown>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters1['global']"
                  placeholder="Global Search"
                />
              </span>
            </div>
          </template>
          <template #empty> No students found. </template>
          <template #loading> Loading students data. Please wait. </template>
          <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
          <Column header="First Name" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.first_name }}
            </template>
          </Column>

          <Column header="Last Name" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.last_name }}
            </template>
          </Column>
          <Column field="school" header="School" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.school }}
            </template>
          </Column>
          <!-- <Column
            header="Country"
            :sortable="true"
            sortField="country.name"
            filterField="country.name"
          >
            <template #body="slotProps">
              <img
                src="assets/layout/flags/flag_placeholder.png"
                :alt="slotProps.data.country.name"
                :class="'flag flag-' + slotProps.data.country.code"
                width="30"
              />
              <span
                style="margin-left: 0.5em; vertical-align: middle"
                class="image-text"
                >{{ slotProps.data.country.name }}</span
              >
            </template>
          </Column> -->
          <!-- <Column
            header="Representative"
            :sortable="true"
            sortField="representative.name"
            filterField="representative.name"
          >
            <template #body="slotProps">
              <img
                :alt="slotProps.data.representative.name"
                :src="
                  'assets/layout/images/avatar/' +
                  slotProps.data.representative.image
                "
                width="32"
                style="vertical-align: middle"
              />
              <span
                style="margin-left: 0.5em; vertical-align: middle"
                class="image-text"
                >{{ slotProps.data.representative.name }}</span
              >
            </template>
          </Column> -->
          <Column field="rate" header="Rate" :sortable="true">
            <template #body="slotProps">
              <span>{{ slotProps.data.rate }}</span>
            </template>
          </Column>
          <!-- <Column field="status" header="Status" :sortable="true">
            <template #body="slotProps">
              <span :class="'customer-badge status-' + slotProps.data.status">{{
                slotProps.data.status
              }}</span>
            </template>
          </Column> -->
          <!-- <Column field="activity" header="Activity" :sortable="true">
            <template #body="slotProps">
              <ProgressBar
                :value="slotProps.data.activity"
                :showValue="false"
              />
            </template>
          </Column> -->
          <Column
            headerStyle="width: 10rem; text-align: center"
            bodyStyle="text-align: center; overflow: visible"
          >
            <template #body="slotProps">
              <span class="p-buttonset">
                <Button
                  type="button"
                  icon="pi pi-search"
                  class="p-button-info"
                  @click="openDialog(slotProps.data, 'view')"
                ></Button>
                <!-- <Button
                  type="button"
                  icon="pi pi-user-edit"
                  class="p-button-warning"
                  @click="openDialog(slotProps.data, 'edit')"
                ></Button> -->
                <Button
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  :disabled="slotProps.data.archive"
                  @click="openConfirmation(slotProps.data)"
                ></Button>
              </span>
            </template>
          </Column>
        </DataTable>
        <Dialog
          v-model:visible="studentDialog"
          :style="{ width: '750px' }"
          header="Student Details"
          :modal="true"
          :closable="true"
        >
          <div class="p-grid p-fluid">
            <div class="p-field p-col-6">
              <label>First Name</label>
              <InputText
                v-if="curStudent"
                v-model="changedStudent.first_name"
                required="true"
                :disabled="mode === 'view'"
                autofocus
              />
            </div>
            <div class="p-field p-col-6">
              <label>Last Name</label>
              <InputText
                v-if="curStudent"
                v-model="changedStudent.last_name"
                required="true"
                :disabled="mode === 'view'"
              />
            </div>
            <div class="p-field p-col-6">
              <label>Email</label>
              <InputText
                v-if="curStudent"
                v-model="changedStudent.email"
                required="true"
                :disabled="mode === 'view'"
              />
            </div>
            <div class="p-field p-col-6">
              <label>Birth Date</label>
              <Calendar
                v-if="curStudent"
                v-model="changedStudent.birthday"
                :showIcon="true"
                :showButtonBar="true"
                :disabled="mode === 'view'"
              ></Calendar>
            </div>
            <div class="p-field p-col-6">
              <label>School</label>
              <InputText
                v-if="curStudent"
                v-model="changedStudent.school"
                required="true"
                :disabled="mode === 'view'"
              />
            </div>
            <div class="p-field p-col-6">
              <label>Contact Number</label>
              <InputText
                v-if="curStudent"
                v-model="changedStudent.contact_number"
                required="true"
                :disabled="mode === 'view'"
              />
            </div>
            <div class="p-field p-col-6">
              <label>Rate</label>
              <InputText
                v-if="curStudent"
                v-model="changedStudent.rate"
                required="true"
                :disabled="mode === 'view'"
              />
            </div>
            <div
              class="p-field p-col-6"
              v-if="changedStudent.family_group != null"
            >
              <label>Family Group</label>
              <Dropdown
                v-if="curStudent"
                v-model="changedStudent.family_group_obj"
                :options="familyGroups"
                placeholder="Select One"
                optionLabel="name"
                :disabled="mode === 'view'"
              ></Dropdown>
            </div>
            <div class="p-field p-col-6">
              <label>Avatar</label>
              <SelectButton v-model="changedStudent.avatars" :options="avatars" :disabled="mode === 'view'">
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
          </div>
          <template #footer>
            <div v-if="mode === 'view'">
              <Button
                label="Edit"
                icon="pi pi-user-edit"
                class="p-button-text"
                @click="mode = edit"
              />
            </div>
            <div v-if="mode != 'view'">
              <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-text"
                :disabled="!isChanged"
                @click="save"
              />
              <Button
                label="Reset"
                icon="pi pi-refresh"
                class="p-button-text"
                @click="resetStudent"
              />
            </div>
          </template>
        </Dialog>
        <Dialog
          header="Confirmation"
          v-model:visible="displayConfirmation"
          :style="{ width: '350px' }"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span>Are you sure you want to archive?</span>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              @click="closeConfirmation"
              class="p-button-text"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              @click="archiveStudent"
              class="p-button-text"
              autofocus
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import StudentService from "../service/StudentService";
import FamilyGroupService from "../service/FamilyGroupService";
import moment from "moment";
import _ from "lodash";

export default {
  data() {
    return {
      selectedStudents: null,
      filters1: {},
      loading: true,
      students: null,
      studentDialog: false,
      curStudent: null,
      changedStudent: null,
      mode: null,
      displayConfirmation: false,
      filterOption: "Active Only",
      filterOptions: ["All Students", "Active Only", "Archived Only"],
      filteredStudents: [],
      avatars: [
        "",
        "avatar_1.png",
        "avatar_2.png",
        "avatar_3.png",
        "avatar_4.png",
      ],
    };
  },
  studentService: null,
  familyGroupService: null,
  created() {
    this.studentService = new StudentService();
    this.familyGroupService = new FamilyGroupService();
  },
  async mounted() {
    try {
      this.familyGroups = await this.familyGroupService.getFamilyGroups();
      this.students = await this.studentService.getStudents();
      this.students = this.students.map((student) => ({
        ...student,
        birthday: new Date(student.birthday),
        fullname: student.first_name + " " + student.last_name,
        family_group_obj: this.familyGroups.find(
          (grp) => grp.id == student.family_group
        ),
      }));
      console.log(this.students);
      this.refreshFilter(this.filterOption);
      this.showSuccess(
        "Retrieve Students Success",
        "Successfully retrieved " + this.students.length + " students"
      );
    } catch (err) {
      this.showFail("Retrieve Students Fail", err);
    } finally {
      this.loading = false;
    }
  },
  watch: {
    filterOption: function (newFilter) {
      this.refreshFilter(newFilter);
    },
  },
  computed: {
    isChanged: function () {
      return !_.isEqual(this.curStudent, this.changedStudent);
    },
  },
  methods: {
    openDialog(student, mode) {
      this.curStudent = student;
      this.changedStudent = { ...student };
      this.studentDialog = true;
      this.mode = mode;
    },
    openConfirmation(student) {
      this.curStudent = student;
      this.displayConfirmation = true;
    },
    closeConfirmation() {
      this.displayConfirmation = false;
    },
    async archiveStudent() {
      try {
        await this.studentService.archiveStudent({
          student: this.curStudent.id,
        });
        this.curStudent.archive = true;
        console.log(this.students);
        this.refreshFilter(this.filterOption);
        this.showSuccess(
          "Archive Student Success",
          "Successfully archived " + this.curStudent.fullname
        );
        this.curStudent = null;
        this.closeConfirmation();
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Archive Fail", err);
      }
    },
    refreshFilter(filter) {
      this.filteredStudents = this.students.filter(function (student) {
        return filter == "All Students"
          ? true
          : filter == "Active Only"
          ? !student.archive
          : student.archive;
      });
    },
    async save() {
      try {
        // console.log(this.changedStudent)
        const res = await this.studentService.editStudent({
          ...this.changedStudent,
          birthday: moment(this.changedStudent.birthday).format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
          student: this.changedStudent.id,
          family_group:
            this.changedStudent.family_group == null
              ? ""
              : this.changedStudent.family_group_obj.id,
        });
        if (res.return_status != "Success") {
          this.showFail("Edit Student Fail", res.return_message);
          return;
        }
        Object.keys(this.curStudent).forEach((key) => {
          this.curStudent[key] = this.changedStudent[key];
        });
        this.changedStudent = { ...this.curStudent };
        this.refreshFilter(this.filterOption);
        this.showSuccess(
          "Edit Student Success",
          "Successfully edited " +
            this.changedStudent.first_name +
            " " +
            this.changedStudent.last_name
        );
        this.mode = "view";
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Edit Fail", err);
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
    resetStudent() {
      this.changedStudent = { ...this.curStudent };
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep(.p-progressbar) {
  height: 0.5rem;
  background-color: #d8dadc;

  .p-progressbar-value {
    background-color: #607d8b;
  }
}

.p-datatable .p-column-filter {
  display: none;
}

.table-header {
  display: flex;
  justify-content: space-between;
}

::v-deep(.p-datatable.p-datatable-customers) {
  .p-datatable-header {
    padding: 1rem;
    text-align: left;
    font-size: 1.5rem;
  }

  .p-paginator {
    padding: 1rem;
  }

  .p-datatable-thead > tr > th {
    text-align: left;
  }

  .p-datatable-tbody > tr > td {
    cursor: auto;
  }

  .p-dropdown-label:not(.p-placeholder) {
    // text-transform: uppercase;
  }
}

/* Responsive */
.p-datatable-customers .p-datatable-tbody > tr > td .p-column-title {
  display: none;
}

.customer-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;

  &.status-qualified {
    background: #c8e6c9;
    color: #256029;
  }

  &.status-unqualified {
    background: #ffcdd2;
    color: #c63737;
  }

  &.status-negotiation {
    background: #feedaf;
    color: #8a5340;
  }

  &.status-new {
    background: #b3e5fc;
    color: #23547b;
  }

  &.status-renewal {
    background: #eccfff;
    color: #694382;
  }

  &.status-proposal {
    background: #ffd8b2;
    color: #805b36;
  }
}

.p-progressbar-value.ui-widget-header {
  background: #607d8b;
}

@media (max-width: 640px) {
  .p-progressbar {
    margin-top: 0.5rem;
  }
}

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.orders-subtable {
  padding: 1rem;
}

.product-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;

  &.status-instock {
    background: #c8e6c9;
    color: #256029;
  }

  &.status-outofstock {
    background: #ffcdd2;
    color: #c63737;
  }

  &.status-lowstock {
    background: #feedaf;
    color: #8a5340;
  }
}

.order-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;

  &.order-delivered {
    background: #c8e6c9;
    color: #256029;
  }

  &.order-cancelled {
    background: #ffcdd2;
    color: #c63737;
  }

  &.order-pending {
    background: #feedaf;
    color: #8a5340;
  }

  &.order-returned {
    background: #eccfff;
    color: #694382;
  }
}

@media screen and (max-width: 960px) {
  ::v-deep(.p-datatable) {
    &.p-datatable-customers {
      .p-datatable-thead > tr > th,
      .p-datatable-tfoot > tr > td {
        display: none !important;
      }

      .p-datatable-tbody > tr {
        > td {
          text-align: left;
          display: block;
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

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
