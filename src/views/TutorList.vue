<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <DataTable
          :value="filteredTutors"
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
              List of Tutors
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
          <template #empty> No tutors found. </template>
          <template #loading> Loading tutors data. Please wait. </template>
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
          <Column header="Email" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.email }}
            </template>
          </Column>
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
          v-model:visible="tutorDialog"
          :style="{ width: '750px' }"
          header="Tutor Details"
          :modal="true"
          :closable="true"
        >
          <div class="p-grid p-fluid">
            <div class="p-field p-col-6">
              <label>First Name</label>
              <InputText
                v-if="curTutor"
                v-model="changedTutor.first_name"
                required="true"
                :disabled="mode === 'view'"
                autofocus
              />
            </div>
            <div class="p-field p-col-6">
              <label>Last Name</label>
              <InputText
                v-if="curTutor"
                v-model="changedTutor.last_name"
                required="true"
                :disabled="mode === 'view'"
              />
            </div>
            <div class="p-field p-col-6">
              <label>Email</label>
              <InputText
                v-if="curTutor"
                v-model="changedTutor.email"
                required="true"
                :disabled="mode === 'view'"
              />
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
                @click="resetTutor"
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
              @click="archiveTutor"
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
import TutorService from "../service/TutorService";
// import moment from "moment";
import _ from "lodash";

export default {
  data() {
    return {
      selectedStudents: null,
      filters1: {},
      loading: true,
      students: null,
      curStudent: null,
      changedStudent: null,
      mode: null,
      displayConfirmation: false,
      filterOption: "Active Only",
      filterOptions: ["All Tutors", "Active Only", "Archived Only"],
      filteredStudents: [],
      avatars: [
        "",
        "avatar_1.png",
        "avatar_2.png",
        "avatar_3.png",
        "avatar_4.png",
      ],
      tutors:[],
      filteredTutors:[],
      curTutor:null,
      changedTutor:null,
      tutorDialog: false,
    };
  },
  tutorService: null,
  created() {
      this.tutorService = new TutorService();
  },
  async mounted() {
    try {
      this.tutors = await this.tutorService.getAllTutors();
      console.log(this.tutors);
      this.refreshFilter(this.filterOption);
      this.showSuccess(
        "Retrieve Tutors Success",
        "Successfully retrieved " + this.tutors.length + " tutors"
      );
    } catch (err) {
      this.showFail("Retrieve Tutors Fail", err);
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
      return !_.isEqual(this.curTutor, this.changedTutor);
    },
  },
  methods: {
    openDialog(tutor, mode) {
      this.curTutor = tutor;
      this.changedTutor = { ...tutor };
      this.tutorDialog = true;
      this.mode = mode;
    },
    openConfirmation(tutor) {
      this.curTutor = tutor;
      this.displayConfirmation = true;
    },
    closeConfirmation() {
      this.displayConfirmation = false;
    },
    async archiveTutor() {
      try {
        await this.tutorService.archiveTutor({
          tutor: this.curTutor.id,
        });
        this.curTutor.archive = true;
        this.refreshFilter(this.filterOption);
        this.showSuccess(
          "Archive Tutor Success",
          "Successfully archived " + this.curTutor.first_name + " " + this.curTutor.last_name
        );
        this.curTutor = null;
        this.closeConfirmation();
      } catch (err) {
        console.log(err.response.data);
        this.showFail("Archive Fail", err);
      }
    },
    refreshFilter(filter) {
      this.filteredTutors = this.tutors.filter((tutor) => {
        return filter == "All Tutors"
          ? true
          : filter == "Active Only"
          ? !tutor.archive
          : tutor.archive;
      });
    },
    async save() {
      try {
        // console.log(this.changedStudent)
        const res = await this.tutorService.editTutor({
          tutor: this.changedTutor.id,
          ...this.changedTutor
        });
        if (res.return_status != "Success") {
          this.showFail("Edit Tutor Fail", res.return_message);
          return;
        }
        Object.keys(this.curTutor).forEach((key) => {
          this.curTutor[key] = this.changedTutor[key];
        });
        this.changedTutor = { ...this.curTutor };
        this.refreshFilter(this.filterOption);
        this.showSuccess(
          "Edit Tutor Success",
          "Successfully edited " +
            this.changedTutor.first_name +
            " " +
            this.changedTutor.last_name
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
    resetTutor() {
      this.changedTutor = { ...this.curTutor };
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
