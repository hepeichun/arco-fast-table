<script setup lang="ts">
import DataTableFilter from '../components/data-table-filter/DataTableFilter.vue'
import DataTableTool from '../components/data-table-tool/DataTableTool.vue'
import DataTable from '../components/data-table/DataTable.vue'
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

const state = reactive({
    filter: {},
    table: {
        loading: false,
        columns: [
            { title: 'ID', dataIndex: 'id', show: false, editHide: true, editType: 'number' },
            { title: '等级', dataIndex: 'level', show: true, editHide: true, editType: 'select',
                options: [
                    { label: '一般', value: 0 },
                    { label: '警告', value: 1 },
                    { label: '错误', value: 2 },
                ],
            },
            { title: '标题', dataIndex: 'title', show: true, editHide: false, editType: 'string' },
            { title: '内容', dataIndex: 'content', show: true, editHide: false, editType: 'string' },
            { title: '发生时间', dataIndex: 'createTime', show: true, editHide: true, editType: 'date-time-picker', filterType: 'range-picker-date' },
            { title: '操作', slotName: 'action', show: true, editHide: true, editType: 'string' },
        ],
        pagination: {
            total: 1,
            current: 1,
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 30, 40, 50],
        },
        data: [{ id: 1, level: 1, title: '异常故障警报', content: 'Docker-3号容器离线', createTime: '2023年5月27日', }],
    },
    popInfo: {
        visible: false,
        title: '新建',
        data: [],
    },
})

const insert = () => {
    state.popInfo.visible = true
}

const insertOkEvent = (data: any) => {
    Message.success('确定')
    console.log(data)
}

const insertCancelEvent = () => {
    Message.warning('取消咯')
}

const refreshTable = () => {
    Message.info('刷新列表')
}
const update = (record: any) => {
    console.log(record)
}
const search = (formModel: any) => {
    console.log(formModel)
    state.filter = formModel
}

const onPageChange = (page: number) => {
    console.log(page)
    state.table.pagination.current = page
    //getTableData()
}
const onPageSizeChange = (pageSize: number) => {
    console.log(pageSize)
    state.table.pagination.pageSize = pageSize
    //getTableData()
}
</script>

<template>
    <div>
        <a-card class="general-card">
            <data-table-filter v-model:columns="state.table.columns" @search="search" />
            <data-table-tool v-model:columns="state.table.columns">
                <!--左边工具栏-->
                <template #tool-left>
                    <a-space>
                        <a-button type="primary" @click="insert()">
                            <template #icon><icon-plus /></template>
                            新建
                        </a-button>
                    </a-space>
                </template>
                <!--右边工具栏-->
                <template #tool-right>
                    <a-space>
                        <a-button @click="refreshTable()">
                            <template #icon><icon-refresh /></template>
                        </a-button>
                    </a-space>
                </template>
            </data-table-tool>
            <data-table v-model:loading="state.table.loading" v-model:columns="state.table.columns" v-model:data="state.table.data" :pagination="state.table.pagination" :bordered="false" @onPageChange="onPageChange" @onPageSizeChange="onPageSizeChange">
                <!--自定义工具栏-->
                <template #slot-action="{ record }">
                    <a-button-group>
                        <a-button type="text" size="small" @click="update(record)">
                            <template #icon><icon-edit /></template>修改
                        </a-button>
                    </a-button-group>
                </template>
            </data-table>
        </a-card>
        <!--弹出框-->
        <table-data-modal v-if="state.popInfo.visible" :columns="state.table.columns" :data="state.popInfo.data" :title="state.popInfo.title" @ok="insertOkEvent" @cancel="insertCancelEvent" />
    </div>
</template>

<style scoped></style>