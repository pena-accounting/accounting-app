<template>
	<div class="p-grid">
        <div class="p-col-12">
			<div class="card card-w-title">
				<!-- <h5>TabMenu</h5>
				<p>Steps and TabMenu are integrated with the same child routes.</p> -->
				<TabMenu :model="nestedRouteItems" />
				<router-view/>
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
						label: 'Student List',
						to: '/student'
					},
					{
						label: 'Add Student',
						to: '/student/add'
					},
					{
						label: 'Family Groups',
						to: '/student/family'
					},
				],
		};
	},
	created() {
	},
	mounted() {
	},
	methods: {

	}
}
</script>

<style scoped>

</style>
