<template>
  <div>
    <div>
      <ParcelTableView ref="parcelTableViewRef" :currentPage="page"></ParcelTableView>
    </div>
  </div>
</template>

<script>
import ParcelTableView from "@/components/ParcelTableView.vue";

export default {
  components: {
    ParcelTableView
  },
  data() {
    return {
      page: 1
    }
  }
}
</script>

<style scoped>

</style>
