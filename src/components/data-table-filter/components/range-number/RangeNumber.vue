<template>
    <a-input-group>
        <a-input-number v-model="state.value[0]" placeholder="最小值" :default-value="defaultValue?.[0]" @change="watchInput" />-
        <a-input-number v-model="state.value[1]" placeholder="最大值" :default-value="defaultValue?.[1]" @change="watchInput" />
    </a-input-group>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, PropType, reactive, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Array as PropType<number[]>,
        default() {
            return ['', '']
        },
    },
    defaultValue: {
        type: Array as PropType<number[]>,
        default() {
            return ['', '']
        },
    },
})

const emit = defineEmits(['update:modelValue'])

const state = reactive({
    value: reactive<number[] | undefined[]>([undefined, undefined]),
})

watch(props, (old, newProps) => {
    // console.log(old,newProps)
    state.value = newProps.modelValue
})

const watchInput = () => {
    emit('update:modelValue', state.value)
    // console.log(state.value)
}

onBeforeMount(() => {
    state.value[0] = props.defaultValue[0] ?? ''
    state.value[1] = props.defaultValue[2] ?? ''
})
</script>

<style scoped></style>
