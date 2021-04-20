<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button" @click="onMenuToggle">
      <span class="pi pi-bars"></span>
    </button>
    <div class="layout-topbar-icons" v-if="showTutors">
      <span class="layout-topbar-search">
        <div class="p-field">
          <Dropdown
            class="weekOptions"
            v-model="tutor"
            :options="tutors"
            optionLabel="fullname"
          ></Dropdown>
        </div>
        <!-- <InputText type="text" placeholder="Search" /> -->
        <!-- <span class="layout-topbar-search-icon pi pi-search"></span> -->
      </span>
      <!-- <button class="p-link">
				<span class="layout-topbar-item-text">Events</span>
				<span class="layout-topbar-icon pi pi-calendar"></span>
				<span class="layout-topbar-badge">5</span>
			</button> -->
      <!-- <button class="p-link">
        <span class="layout-topbar-item-text">Settings</span>
        <span class="layout-topbar-icon pi pi-cog"></span>
      </button> -->
      <!-- <button class="p-link">
				<span class="layout-topbar-item-text">User</span>
				<span class="layout-topbar-icon pi pi-user"></span>
			</button> -->
    </div>
  </div>
</template>

<script>
import TutorService from "./service/TutorService";
export default {
  data() {
    return {
      tutors: null,
      tutor: null,
      allTutorsOption: {
        fullname: "All Tutors",
      },
    };
  },
  props: {
    routeName: String,
  },
  tutorService:null,
  created() {
    this.tutorService = new TutorService();
  },
  async mounted() {
    try {
      this.tutors = await this.tutorService.getUnarchivedTutors();
      this.tutors = this.tutors.map((tutor) => ({
        ...tutor,
        fullname: tutor.first_name + " " + tutor.last_name,
      }));
      if (this.tutors.length == 0) {
        this.showWarn(
          "No Tutors Added",
          "Add tutors first before adding appointments"
        );
        return;
      }
      this.tutors.unshift(this.allTutorsOption);
      this.tutor = this.allTutorsOption;
    } catch (err) {
      this.showFail("Error", err);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    showTutors: function () {
      return this.routeName == "weeklysched" || this.routeName == "dashboard";
    },
  },
  watch: {
    tutor: function () {
      this.$emit("tutor-change", this.tutor);
    },
  },
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
	showWarn(summary, detail) {
      this.$toast.add({
        severity: "warn",
        summary,
        detail,
        life: 7000,
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