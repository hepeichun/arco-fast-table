<template>
    <a-row>
        <a-col :flex="1">
            <a-form :model="formModel as Record<string, any>" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
                <a-row :gutter="16" style="min-height: 156px">
                    <template v-for="(item, index) in state.columns" :key="index">
                        <a-col v-if="item.hasOwnProperty('dataIndex') && (item.filterShow ?? item.show)" v-show="(!state.spreadStatus && index < 9) || state.spreadStatus" :span="8">
                            <a-form-item :field="item.dataIndex" :label="item.title">
                                <a-input-number v-if="(item.filterType ?? item.type) === 'number'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请输入${item.title}`" />
                                <template v-else-if="(item.filterType ?? item.type) === 'cascader' && typeof item.options !== 'undefined' && item.options instanceof Array">
                                    <a-cascader v-model:model-value="formModel[item.dataIndex]" :options="item.options" allow-clear allow-search :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                </template>
                                <template v-else-if="(item.filterType ?? item.type) === 'select' && typeof item.options !== 'undefined' && item.options instanceof Array">
                                    <a-select v-model="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" allow-clear allow-search :options="item.options" :default-value="formModel[item.dataIndex]" />
                                </template>
                                <template v-else-if="(item.filterType ?? item.type) === 'radio' && typeof item.options !== 'undefined' && item.options instanceof Array">
                                    <a-select v-model="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" allow-clear :options="item.options" :default-value="formModel[item.dataIndex]" />
                                </template>
                                <template v-else-if="(item.filterType ?? item.type) === 'multiple-select' && typeof item.options !== 'undefined' && item.options instanceof Array">
                                    <a-select v-model="formModel[item.dataIndex]" multiple :placeholder="`请选择${item.title}`" allow-clear allow-search :options="item.options" :default-value="formModel[item.dataIndex]" />
                                </template>
                                <template v-else-if="(item.filterType ?? item.type) === 'checkbox' && typeof item.options !== 'undefined' && item.options instanceof Array">
                                    <a-select v-model="formModel[item.dataIndex]" multiple :placeholder="`请选择${item.title}`" allow-clear allow-search :options="item.options" :default-value="formModel[item.dataIndex]" />
                                </template>
                                <!--年选择器-->
                                <a-year-picker v-else-if="(item.filterType ?? item.type) === 'year-picker'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                <!--月选择器-->
                                <a-month-picker v-else-if="(item.filterType ?? item.type) === 'month-picker'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                <!--日期选择器-->
                                <a-date-picker v-else-if="(item.filterType ?? item.type) === 'date-picker'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                <!--日期选择器-->
                                <a-date-picker v-else-if="(item.filterType ?? item.type) === 'date-time-picker'" v-model="formModel[item.dataIndex]" show-time format="YYYY-MM-DD HH:mm:ss" :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                <!--季度选择器-->
                                <a-quarter-picker v-else-if="(item.filterType ?? item.type) === 'quarter-picker'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                <!--周选择器-->
                                <a-week-picker v-else-if="(item.filterType ?? item.type) === 'week-picker'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                                <!--日期范围选择器-->
                                <a-range-picker v-else-if="(item.filterType ?? item.type) === 'range-picker-date'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" />
                                <range-number v-else-if="(item.filterType ?? item.type) === 'range-number'" v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" />
                                <a-input v-else v-model="formModel[item.dataIndex]" :default-value="formModel[item.dataIndex]" :placeholder="`请输入${item.title}`" />
                            </a-form-item>
                        </a-col>
                    </template>
                </a-row>
            </a-form>
        </a-col>
        <a-divider direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
                <a-button type="primary" @click="search"><template #icon><icon-search /></template>搜索</a-button>
                <a-button @click="reset"><template #icon><icon-refresh /></template>重置</a-button>
                <a-button @click="spread"><template #icon><icon-up v-if="state.spreadStatus" /><icon-down v-else /></template>{{ state.spreadStatus ? '收起' : '展开' }}</a-button>
            </a-space>
        </a-col>
    </a-row>
</template>

<script lang="ts" setup>
import { reactive, defineProps, defineEmits, onBeforeMount, PropType, watch } from 'vue'
import RangeNumber from './components/range-number/RangeNumber.vue'
import { TableColumnData } from '@arco-design/web-vue/es/table/interface'

interface MyTableColumnData extends TableColumnData {
    title: string
    dataIndex?: string
    show: boolean
    options?: any[] | { label: string; value: string }[]
    type: string
    filterShow?: boolean
    filterType?: string
}

const props = defineProps({
    form: {
        type: Object as PropType<any[any] | undefined>,
        default() {
            return {}
        },
    },
    columns: {
        type: Array as PropType<MyTableColumnData[]>,
        default() {
            return []
        },
    },
    defaultValue: {
        type: Object,
        default() {
            return []
        },
    },
})
const emits = defineEmits(['search'])

const state = reactive<any[any]>({
    columns: reactive<any[any]>({}),
    spreadStatus: false,
})
const formModel = reactive<any[any] | undefined>({})

const search = () => {
    emits('search', formModel)
}
const reset = () => {
    Object.keys(formModel).forEach((key) => {
        formModel[key] = formModel[key] instanceof Object ? [] : ''
    })
}

const spread = () => {
    state.spreadStatus = !state.spreadStatus
}

const init = () => {
    for (let i = 0; i < state.columns.length; i += 1) {
        formModel[state.columns[i].dataIndex] = props.defaultValue[state.columns[i].dataIndex] ?? ''
    }
}
watch(props, (old, newProps: any) => {
    // console.log(old,newProps)
    const newColumns = newProps.columns
    if (typeof newColumns.filterType === 'undefined') {
        newColumns.filterType = newColumns.type
    }
    state.columns = newProps.columns
    formModel.value = {}
    init()
})
onBeforeMount(() => {
    const newColumns: MyTableColumnData[] = props.columns

    for (let i = 0; i < newColumns.length; i++) {
        if (typeof newColumns[i].filterType === 'undefined') {
            newColumns[i].filterType = newColumns[i].type
        }
    }

    state.columns = newColumns
    init()
})
</script>

<style lang="less" scoped></style>
