<template>
    <!--数据表格-->
    <a-table :loading="loading" :pagination="pagination" :data="data" :bordered="bordered" :size="size" :page-position="pagePosition" :scrollbar="scrollbar" :scroll="scroll" @page-change="onPageChange" @page-size-change="onPageSizeChange">
        <template #columns>
            <template v-for="(item, index) in columns" :key="index">
                <template v-if="item.hasOwnProperty('dataIndex') && item.show">
                    <a-table-column v-if="!!slots[`custom-${item.dataIndex}`]" :title="item.title" :data-index="item.dataIndex" :width="item.width">
                        <template #cell="{ record, column, rowIndex }">
                            <a-table-column>
                                <slot :name="`custom-${item.dataIndex}`" :record="record" :column="column" :row-index="rowIndex" />
                            </a-table-column>
                        </template>
                    </a-table-column>
                    <a-table-column v-else-if="item.hasOwnProperty('options')" :title="item.title" :data-index="item.dataIndex" :width="item.width">
                        <template #cell="{ record, column }">
                            {{ getOptionsText(item.options, record[column.dataIndex]) }}
                        </template>
                    </a-table-column>
                    <a-table-column v-else :title="item.title" :data-index="item.dataIndex" :width="item.width">
                        <template v-if="item.type === 'date-time-picker'" #cell="{ record, column }"> {{ record[column.dataIndex] ? dayjs(record[column.dataIndex]).format('YYYY-MM-DD HH:mm:ss') : '-' }}</template>
                        <template v-else-if="item.type === 'upload-image'" #cell="{ record, column }">
                            <preview-image v-if="record[column.dataIndex]" :url="`${VITE_API_BASE_URL}${record[column.dataIndex]}`" />
                            <a-avatar v-else>无</a-avatar>
                        </template>
                        <template v-else #cell="{ record, column }">{{ record[column.dataIndex] ?? '-' }}</template>
                    </a-table-column>
                </template>
                <template v-else-if="item.hasOwnProperty('slotName') && item.show">
                    <a-table-column :title="item.title" :data-index="item.slotName">
                        <template #cell="{ record, column, rowIndex }">
                            <slot :name="`slot-${item.slotName}`" :record="record" :column="column" :row-index="rowIndex" />
                        </template>
                    </a-table-column>
                </template>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import getOptionsText from '../../utils/tableTool'
import { defineProps, defineEmits, onBeforeMount, reactive, PropType, useSlots, RenderFunction } from 'vue'
import PreviewImage from '../preview-image/index.vue'
import { TableColumnData } from '@arco-design/web-vue/es/table/interface'

const { VITE_API_BASE_URL } = import.meta.env

interface MyTableColumnData extends TableColumnData {
    title: string
    dataIndex?: string
    slotName?: string
    width?: number
    show: boolean
    options?: any
    type: string
}

interface MyTableData {
    key?: string
    expand?: string | RenderFunction
    children?: MyTableData[]
    disabled?: boolean
    isLeaf?: boolean

    [name: string]: any
}

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    bordered: {
        type: Boolean,
        default: false,
    },
    scrollbar: {
        type: Boolean,
        default: false,
    },
    scroll: {
        type: Object as PropType<{
            x?: number | string
            y?: number | string
            minWidth?: number | string
            maxHeight?: number | string
        }>,
        default: undefined,
    },
    pagination: {
        type: [Boolean, Object] as PropType<
            | boolean
            | {
                  total: number
                  current: number
                  pageSize: number
                  showTotal?: boolean
                  showMore?: boolean
                  showJumper?: boolean
                  pageSizeOptions?: number[]
                  showPageSize?: boolean
              }
        >,
        default: false,
    },
    pagePosition: {
        type: [String] as PropType<'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'>,
        default: 'br',
    },
    size: {
        type: String as PropType<'mini' | 'medium' | 'large' | 'small'>,
        default: 'large',
    },
    columns: {
        type: Array as PropType<MyTableColumnData[]>,
        default() {
            return []
        },
    },
    data: {
        type: Array as PropType<MyTableData[]>,
        default: [],
    },
})

const emit = defineEmits(['onPageChange', 'onPageSizeChange'])
const slots = useSlots()

const state = reactive({
    loading: false,
    bordered: false,
    scrollbar: false,
    pagination: reactive<any>(false),
    pagePosition: 'br',
    size: 'large',
    columns: reactive<any[]>([]),
    data: reactive<any[]>([]),
})

onBeforeMount(() => {
    state.loading = props.loading
    state.scrollbar = props.scrollbar
    state.bordered = props.bordered
    state.pagination = props.pagination
    state.pagePosition = props.pagePosition
    state.size = props.size
    state.columns = props.columns
    state.data = props.data
})

const onPageChange = (page: number) => {
    emit('onPageChange', page)
}
const onPageSizeChange = (pageSize: number) => {
    console.log(pageSize)
    emit('onPageSizeChange', pageSize)
}
</script>

<style scoped></style>