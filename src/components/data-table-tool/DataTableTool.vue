<template>
    <!--操作按钮栏-->
    <a-row style="margin-bottom: 16px">
        <a-col :span="12">
            <slot name="tool-left" />
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
            <a-space>
                <slot name="tool-right" />
                <a-dropdown position="br" :popup-max-height="false">
                    <a-button>
                        <template #icon><icon-mind-mapping /></template>
                    </a-button>
                    <template #content>
                        <a-checkbox-group direction="vertical" :default-value="getShowColumns()" class="checkbox-group" @change="setColumns">
                            <draggable :list="state.columns" item-key="dataIndex">
                                <template #item="{ element }">
                                    <div class="draggable-label">
                                        <icon-font type="icon-drag-drop-line" class="icon-drag-drop-line" />
                                        <a-checkbox :value="element.dataIndex ?? element.slotName" :default-checked="element.show">{{ element.title }}</a-checkbox>
                                    </div>
                                </template>
                            </draggable>
                        </a-checkbox-group>
                    </template>
                </a-dropdown>
            </a-space>
        </a-col>
    </a-row>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, watch, reactive, onBeforeMount, defineComponent } from 'vue'
import { Icon } from '@arco-design/web-vue'
import Draggable from 'vuedraggable'

const props = defineProps({
    columns: {
        type: Array,
        default() {
            return []
        },
    },
})

const emit = defineEmits(['update:columns'])

const IconFont = Icon.addFromIconFontCn({ src: '//at.alicdn.com/t/c/font_1050956_46oji24054w.js' })

defineComponent({
    IconFont,
})
const state = reactive({
    columns: reactive<any[]>([]),
})
// 用于筛选的时候显示列的，不需要动的工具方法
const getShowColumns = () => {
    const columns = []
    for (let i = 0; i < state.columns.length; i += 1) {
        if (state.columns[i].show) {
            columns.push(state.columns[i].dataIndex ?? state.columns[i].slotName)
        }
    }
    return columns
}

const setColumns = (columns: any) => {
    for (let i = 0; i < state.columns.length; i += 1) {
        state.columns[i].show = !!columns.includes(state.columns[i].dataIndex ?? state.columns[i].slotName)
        emit('update:columns', state.columns)
    }
}

onBeforeMount(() => {
    state.columns = props.columns
})

watch(props, (old, newProps) => {
    // console.log(old,newProps)
    state.columns = newProps.columns
})
</script>

<style scoped>
.checkbox-group .draggable-label {
    padding: 0 20px 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #ffffff;
}
.checkbox-group .draggable-label .icon-drag-drop-line {
    margin-right: 5px;
    margin-left: 5px;
    cursor: move;
}
</style>
