<template>
	<div class="p-grid">
        <div class="p-col-12">
			<div class="card card-w-title">
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
						label: 'Tutor List',
						to: '/tutor'
					},
					{
						label: 'Add Tutor',
						to: '/tutor/add'
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
