<template>
	<div class="p-grid">
        <div class="p-col-12">
			<div class="card card-w-title">
				<!-- <h5>TabMenu</h5>
				<p>Steps and TabMenu are integrated with the same child routes.</p> -->
				<TabMenu :model="nestedRouteItems" />
				<router-view :curTutor="curTutor"/>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
            nestedRouteItems: [
					{
						label: 'Weekly Schedule',
						to: '/schedule'
					},
					{
						label: 'Add Appointment',
						to: '/schedule/addappointment'
					},
				],
		};
	},
	created() {
	},
	mounted() {
	},
	props: {
    curTutor: Object,
  },
	methods: {

	}
}
</script>

<style scoped>

</style>
