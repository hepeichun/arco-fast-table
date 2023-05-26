<template>
    <a-modal :visible="true" @ok="action.handleOk" @cancel="action.handleCancel">
        <template #title>{{ title }}</template>
        <div class="container">
            <a-form :model="form as Record<string, any>">
                <template v-for="(item, index) in formColumns" :key="index">
                    <a-form-item v-if="!(item.editShow ?? false)" :field="item.dataIndex" :label="item.title">
                        <a-input-number v-if="item.editType === 'number'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请输入${item.title}`"/>
                        <template v-else-if="item.editType === 'radio' && typeof item.options !== 'undefined' && (item.options instanceof Array)">
                            <a-radio-group v-model="form[item.dataIndex]" :options="item.options" />
                        </template>
                        <template v-else-if="item.editType === 'cascader' && typeof item.options !== 'undefined' && (item.options instanceof Array)">
                            <a-cascader v-model:model-value="form[item.dataIndex]" :options="item.options" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" />
                        </template>
                        <template v-else-if="item.editType === 'checkbox' && typeof item.options !== 'undefined' && (item.options instanceof Array)">
                            <a-checkbox-group v-model="form[item.dataIndex]" :options="item.options" :default-value="form[item.dataIndex]" />
                        </template>
                        <template v-else-if="item.editType === 'select' && typeof item.options !== 'undefined' && (item.options instanceof Array)">
                            <a-select v-model="form[item.dataIndex]" :placeholder="`请选择${item.title}`" :options="item.options" :default-value="form[item.dataIndex]"
                                      allow-search :loading="item?.argument?.loading" :filter-option="item?.argument?.filterOption"
                                      @search="(value) => { selectSearch(item, value) }"
                                      @change="(value) => { if(item?.events?.change instanceof Object) item?.events?.change(item, value); }"
                            />
                        </template>
                        <template v-else-if="item.editType === 'multiple-select' && typeof item.options !== 'undefined' && (item.options instanceof Array)">
                            <a-select v-model="form[item.dataIndex]" multiple :placeholder="`请选择${item.title}`" :options="item.options" :default-value="form[item.dataIndex]"
                                      :loading="item?.argument?.loading" :filter-option="item?.argument?.filterOption"
                                      @search="(value) => { selectSearch(item, value) }"
                                      @change="(value) => { if(item?.events?.change instanceof Object) item?.events?.change(item, value); }"
                            />
                        </template>
                        <a-textarea v-else-if="item.editType === 'textarea'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`"/>
                        <a-year-picker v-else-if="item.editType === 'year-picker'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" /><!--年选择器-->
                        <a-month-picker v-else-if="item.editType === 'month-picker'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" /><!--月选择器-->
                        <a-date-picker v-else-if="item.editType === 'date-picker'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" /><!--日期选择器-->
                        <a-date-picker v-else-if="item.editType === 'date-time-picker'" v-model="form[item.dataIndex]" show-time format="YYYY-MM-DD HH:mm:ss" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" /><!--日期选择器-->
                        <a-quarter-picker v-else-if="item.editType === 'quarter-picker'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" /><!--季度选择器-->
                        <a-week-picker v-else-if="item.editType === 'week-picker'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请选择${item.title}`" /><!--周选择器-->
                        <a-range-picker v-else-if="item.editType === 'range-picker-date'" v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" /><!--日期范围选择器-->
                        <a-upload v-else-if="item.editType === 'upload-image' && typeof item.options !== 'undefined' && (item.options instanceof Object)" list-type="picture-card" :action="item.options?.action??''" :default-value="form[item.dataIndex]" :default-file-list="form[item.dataIndex]?[{url: (item?.options?.url_prefix??'') +  form[item.dataIndex]}]:[]" image-preview :limit="1" @success="(fileItem) => { uploadImageSuccess(fileItem, item.dataIndex) }" :headers="item.options?.headers" />
                        <a-input v-else v-model="form[item.dataIndex]" :default-value="form[item.dataIndex]" :placeholder="`请输入${item.title}`" />

                        <template v-if="item.help" #help>
                            <div v-html="item.help"></div>
                        </template>
                    </a-form-item>
                </template>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, onMounted, defineExpose, PropType } from 'vue'
import { Message } from '@arco-design/web-vue'
import { TableColumnData, TableData } from '@arco-design/web-vue/es/table/interface'
import { FileStatus } from '@arco-design/web-vue/es/upload/interfaces'

interface MyTableColumnData extends TableColumnData {
    title: string
    dataIndex?: string
    slotName?: string
    width?: number
    show: boolean
    options?: any
    type: string
    editType?: string
    editShow?: boolean
    events?: Object
}

const props = defineProps({
    columns: {
        type: Array as PropType<MyTableColumnData[]>,
        default() {
            return []
        },
    },
    data: {
        type: Object,
        default() {
            return []
        },
    },
    title: {
        type: String,
        default: '',
    },
})
const emit = defineEmits(['ok', 'cancel'])

const formColumns = reactive<any[any]>([])
const form = reactive<any[any]>({})

const setForm = () => {
    // 解决深拷贝问题
    // const columns = JSON.parse(JSON.stringify(props.columns));
    for (let i = 0; i < props.columns.length; i += 1) {
        const tmpColumns = props.columns[i]
        if (typeof tmpColumns.dataIndex !== 'undefined') {
            formColumns.push(tmpColumns)
            form[tmpColumns.dataIndex] = props.data[tmpColumns.dataIndex] ?? (tmpColumns.editType === 'checkbox' || tmpColumns.editType === 'multiple-select' ? [] : '')
            if (form[tmpColumns.dataIndex] === '-') {
                form[tmpColumns.dataIndex] = ''
            }
            if (['year-picker', 'month-picker', 'date-picker', 'date-time-picker', 'quarter-picker', 'week-picker'].includes(tmpColumns.editType) && form[tmpColumns.dataIndex]) {
                console.log('date', form[tmpColumns.dataIndex])
                form[tmpColumns.dataIndex] = new Date(form[tmpColumns.dataIndex])
            } else if (tmpColumns.editType === 'range-picker-date' && form[tmpColumns.dataIndex][0] && form[tmpColumns.dataIndex][1]) {
                form[tmpColumns.dataIndex] = [new Date(form[tmpColumns.dataIndex][0]), new Date(form[tmpColumns.dataIndex][1])]
            }
        }
    }

    console.log('data', form, props.columns)
}

const selectSearch = (column: any, value: string) => {
    if (column?.events?.search instanceof Object) {
        column?.events?.search(column, value)
    }
}

const uploadImageSuccess = (
    fileItem: {
        uid: string
        status?: FileStatus
        file?: File
        percent?: number
        response?: any
        url?: string
        name?: string
    },
    dataIndex: string
) => {
    console.log(fileItem, dataIndex)
    if (fileItem.response.code !== 200) {
        Message.warning(fileItem.response.msg ?? '上传失败')
        return
    }
    form[dataIndex] = fileItem.response.data
}

const action = {
    handleOk: () => {
        emit('ok', form)
    },
    handleCancel: () => {
        emit('cancel')
    },
}

onMounted(() => {
    setForm()
})

defineExpose({
    formColumns,
    form,
})
</script>

<style scoped></style>
