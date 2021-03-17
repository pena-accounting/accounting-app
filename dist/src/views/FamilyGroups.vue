<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <!-- <h4>Default</h4>
        <p>Pagination, sorting, filtering and checkbox selection.</p> -->
        <!-- <Toast /> -->
        <DataTable
          :value="familyGroups"
          v-model:expandedRows="expandedRows"
          class="p-datatable-customers"
          dataKey="id"
          @row-expand="onRowExpand"
          @row-collapse="onRowCollapse"
          :loading="loading"
        >
          <template #header>
            <div class="table-header-container">
              <Button
                icon="pi pi-plus"
                label="Expand All"
                @click="expandAll"
                class="p-mr-2"
              />
              <Button
                icon="pi pi-minus"
                label="Collapse All"
                @click="collapseAll"
              />
            </div>
          </template>
          <template #empty> No family groups found. </template>
          <template #loading> Loading students data. Please wait. </template>
          <Column :expander="true" headerStyle="width: 3rem" />
          <Column field="name" header="Name" :sortable="true"></Column>
          <Column
            headerStyle="width: 10rem; text-align: center"
            bodyStyle="text-align: center; overflow: visible"
            header="Actions"
          >
            <template #body="slotProps">
              <span class="p-buttonset">
                <Button
                  type="button"
                  icon="pi pi-search"
                  class="p-button-info"
                  @click="openGroupDialog(slotProps.data, 'view')"
                ></Button>
                <Button
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="openArchiveConfirmation(slotProps.data)"
                ></Button>
              </span>
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="orders-subtable">
              <h5>Family Group {{ slotProps.data.name }}</h5>
              <DataTable :value="slotProps.data.students">
                <template #empty> No students found. </template>
                <Column
                  field="fullname"
                  header="Name"
                  :sortable="true"
                ></Column>
                <Column field="rate" header="Rate" :sortable="true"></Column>

                <Column
                  field="school"
                  header="School"
                  :sortable="true"
                ></Column>
                <Column header="Actions">
                  <template #body="slotProps2">
                    <span class="p-buttonset">
                      <Button
                        type="button"
                        icon="pi pi-search"
                        class="p-button-info"
                        @click="openDialog(slotProps2.data, 'view')"
                      ></Button>
                      <Button
                        type="button"
                        icon="pi pi-user-minus"
                        class="p-button-danger"
                        @click="
                          openConfirmation(slotProps2.data, slotProps.data)
                        "
                      ></Button>
                    </span>
                  </template>
                </Column>
                <template #footer>
                  <!-- {{slotProps.data}} -->

                  <td colspan="3">
                    <Button
                      label="Add Student"
                      :disabled="dummyStudents[slotProps.data.name] == null"
                      @click="
                        addToGroup(slotProps.data.name, slotProps.data.id)
                      "
                    />
                    <Dropdown
                      v-model="dummyStudents[slotProps.data.name]"
                      class="p-ml-2"
                      :options="[...students]"
                      optionLabel="fullname"
                      placeholder="Select One"
                    ></Dropdown>
                  </td>
                </template>
              </DataTable>
            </div>
          </template>
        </DataTable>

        <!-- Edit Student Dialog -->
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
            <!-- <div
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
            </div> -->
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

        <!-- Edit Group Dialog -->
        <Dialog
          v-model:visible="groupDialog"
          :style="{ width: '550px' }"
          header="Group Details"
          :modal="true"
          :closable="true"
        >
          <div class="p-grid p-fluid">
            <div class="p-field p-col-6">
              <label>Group Name</label>
              <InputText
                v-if="curGroup"
                v-model="changedGroup.name"
                required="true"
                :disabled="mode2 === 'view'"
                autofocus
              />
            </div>
          </div>
          <template #footer>
            <div v-if="mode2 === 'view'">
              <Button
                label="Edit"
                icon="pi pi-user-edit"
                class="p-button-text"
                @click="mode2 = edit"
              />
            </div>
            <div v-if="mode2 != 'view'">
              <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-text"
                @click="saveGroup"
              />
              <Button
                label="Reset"
                icon="pi pi-refresh"
                class="p-button-text"
                @click="resetGroup"
              />
            </div>
          </template>
        </Dialog>

        <!-- Remove From Family Group Dialog -->
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
            <span>Are you sure you want to remove from family group?</span>
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
              @click="removeStudent"
              class="p-button-text"
              autofocus
            />
          </template>
        </Dialog>

        <!-- Archive Family Group Dialog -->
        <Dialog
          header="Confirmation"
          v-model:visible="displayArchiveConfirmation"
          :style="{ width: '350px' }"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle p-mr-3"
              style="font-size: 2rem"
            />
            <span>Are you sure you want to archive family group?</span>
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
              @click="archiveGroup"
              class="p-button-text"
              autofocus
            />
          </template>
        </Dialog>
      </div>

      <!-- Add New Group Card -->
      <div class="card">
        <!-- <h5>Panel</h5> -->
        <Panel header="Add Family Group" :toggleable="true">
          <div class="p-formgroup-inline">
            <div class="p-field">
              <label class="p-sr-only">Name</label>
              <InputText
                type="text"
                placeholder="Family Name"
                v-model="form.name"
                :class="{ 'p-invalid': validationErrors.name && submitted }"
              />
              <InlineMessage v-show="validationErrors.name && submitted">Name is required</InlineMessage>
            </div>
            <Button label="Submit" @click="addFamilyGroup"></Button>
          </div>
        </Panel>
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
      filters1: {},
      filters2: {},
      loading1: true,
      loading2: true,
      expandedRows: [],
      loading: true,
      students: null,
      studentDialog: false,
      groupDialog: false,
      curStudent: null,
      changedStudent: null,
      curGroup: null,
      changedGroup: null,
      displayArchiveConfirmation: false,
      mode: null,
      mode2: null,
      displayConfirmation: false,
      familyGroups: null,
      dummyStudents: {},
      form: {
        name: "",
      },
      validationErrors: {},
      submitted: false,
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
      this.students = await this.studentService.getStudents();
      this.students = this.students.filter((s) => {
        return !s.archive;
      });
      this.students = this.students.map((student) => ({
        ...student,
        fullname: student.first_name + " " + student.last_name,
      }));

      await this.refreshFamilyGroups();
    } catch (err) {
      this.showFail("Failed to retrieve Family Groups", err.response.data);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    isChanged: function () {
      return !_.isEqual(this.curStudent, this.changedStudent);
    },
  },
  methods: {
    onRowExpand(event) {
      this.$toast.add({
        severity: "info",
        summary: "Family Group Expanded",
        detail: event.data.name,
        life: 3000,
      });
    },
    onRowCollapse(event) {
      this.$toast.add({
        severity: "success",
        summary: "Family Group Collapsed",
        detail: event.data.name,
        life: 3000,
      });
    },
    expandAll() {
      this.expandedRows = this.familyGroups.filter((p) => p.name);
      this.$toast.add({
        severity: "success",
        summary: "All Rows Expanded",
        life: 3000,
      });
    },
    collapseAll() {
      this.expandedRows = null;
      this.$toast.add({
        severity: "success",
        summary: "All Rows Collapsed",
        life: 3000,
      });
    },
    initDummys() {
      this.familyGroups.forEach((group) => {
        this.dummyStudents[group.name] = null;
      });
    },
    openDialog(student, mode) {
      this.curStudent = student;
      this.changedStudent = { ...student };
      this.studentDialog = true;
      this.mode = mode;
    },
    openGroupDialog(group, mode2) {
      this.curGroup = group;
      this.changedGroup = { ...group };
      this.groupDialog = true;
      this.mode2 = mode2;
    },
    openConfirmation(student, group) {
      this.curStudent = student;
      this.curGroup = group;
      this.displayConfirmation = true;
    },
    openArchiveConfirmation(group) {
      this.curGroup = group;
      this.displayArchiveConfirmation = true;
    },
    closeConfirmation() {
      this.displayConfirmation = false;
      this.displayArchiveConfirmation = false;
      this.curGroup = null;
      this.curStudent = null;
    },
    async removeStudent() {
      try {
        await this.familyGroupService.removeStudentFromGroup({
          family_group: this.curGroup.id,
          student: this.curStudent.id,
        });
        this.showSuccess(
          "Remove Success",
          "Successfully removed " +
            this.curStudent.fullname +
            " from family group " +
            this.curGroup.name
        );
        this.refreshFamilyGroups();
        this.closeConfirmation();
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Remove Fail", err);
      }
    },
    async archiveGroup() {
      try {
        await this.familyGroupService.archiveFamilyGroup({
          family_group: this.curGroup.id,
        });
        this.showSuccess(
          "Archive Group Success",
          "Successfully archived " + this.curGroup.name
        );
        this.refreshFamilyGroups();
        this.closeConfirmation();
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Archive Fail", err);
      }
    },
    async addFamilyGroup() {
      this.submitted = true;
      if (this.validateForm()) {
        try {
          var result = await this.familyGroupService.addFamilyGroup(
            Object.assign({}, this.form)
          );
          // console.log(newGroup);
          if (result.return_status != "Success") {
            this.showFail("Add Family Group Failed", result.return_message);
            return;
          }
          this.showSuccess(
            "Add Family Group Success",
            "Successfully added family group "
          );
          await this.refreshFamilyGroups();
          this.form.name = "";
        } catch (err) {
          console.log(err.response.data);
          this.showFail("Add Family Group Failed", err.response.data);
        }
      }
    },
    async refreshFamilyGroups() {
      this.loading = true;
      try {
        // this.students = await this.studentService.getStudents();
        // this.students = this.students.map((student) => ({
        //   ...student,
        //   fullname: student.first_name + " " + student.last_name,
        // }));
        this.familyGroups = await this.familyGroupService.getFamilyGroups();
        this.familyGroups.forEach((group) => {
          group.students = group.students.map((student) => ({
            ...student,
            birthday: new Date(student.birthday),
            fullname: student.first_name + " " + student.last_name,
          }));
        });
        this.initDummys();
        this.showSuccess(
          "Retrieve Family Groups Success",
          this.familyGroups.length + " family groups"
        );
      } catch (err) {
        this.showFail("Failed to retrieve Family Groups", err.response.data);
      } finally {
        this.loading = false;
      }
    },
    async addToGroup(name, id) {
      try {
        var result = await this.familyGroupService.addStudentToGroup({
          family_group: id,
          student: this.dummyStudents[name].id,
        });
        if (result.return_status != "Success") {
          this.showFail("Add Family Group Failed", result.return_message);
          return;
        }
        this.showSuccess(
          "Add to group success",
          "Succesfully added " + this.dummyStudents[name].first_name
        );
        await this.refreshFamilyGroups();
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Add to Family Group Failed", err.response.data);
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
    validateForm() {
      if (!this.form.name.trim()) this.validationErrors["name"] = true;
      else delete this.validationErrors["name"];

      return !Object.keys(this.validationErrors).length;
    },
    async save() {
      try {
        const res = await this.studentService.editStudent({
          ...this.changedStudent,
          birthday: moment(this.changedStudent.birthday).format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
          student: this.changedStudent.id,
          // family_group:
          //   this.changedStudent.family_group == null
          //     ? ""
          //     : this.changedStudent.family_group_obj.id,
        });
        console.log(res);
        if (res.return_status != "Success") {
          this.showFail("Edit Student Fail", res.return_message);
          return;
        }
        Object.keys(this.curStudent).forEach((key) => {
          this.curStudent[key] = this.changedStudent[key];
          this.curStudent["fullname"] =
            this.changedStudent.first_name +
            " " +
            this.changedStudent.last_name;
        });
        this.changedStudent = { ...this.curStudent };
        // this.refreshFilter(this.filterOption);
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
    async saveGroup() {
      try {
        console.log(this.changedGroup);
        const res = await this.familyGroupService.editFamilyGroup({
          family_group: this.changedGroup.id,
          name: this.changedGroup.name,
        });
        if (res.return_status != "Success") {
          this.showFail("Edit Group Fail", res.return_message);
          return;
        }
        Object.keys(this.curGroup).forEach((key) => {
          this.curGroup[key] = this.changedGroup[key];
        });
        this.changedGroup = { ...this.curGroup };
        // this.refreshFilter(this.filterOption);
        this.showSuccess(
          "Edit Group Success",
          "Successfully edited " + this.changedGroup.name
        );
        this.mode2 = "view";
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Edit Fail", err);
      }
    },
    resetStudent() {
      this.changedStudent = { ...this.curStudent };
    },
    resetGroup() {
      this.changedGroup = { ...this.curGroup };
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

  // .p-dropdown-label:not(.p-placeholder) {
  //   // text-transform: uppercase;
  // }
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
