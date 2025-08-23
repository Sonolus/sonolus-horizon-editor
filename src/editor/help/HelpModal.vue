<script setup lang="ts">
import { i18n } from '../../i18n'
import BaseModal from '../../modals/BaseModal.vue'
import HelpSection from './HelpSection.vue'
</script>

<template>
    <BaseModal :title="i18n.help.modal.title">
        <HelpSection :title="i18n.help.modal.touchscreen.title">
            <li>{{ i18n.help.modal.touchscreen.tap }}</li>
            <li>{{ i18n.help.modal.touchscreen.drag }}</li>
            <li>{{ i18n.help.modal.touchscreen.scroll }}</li>
            <li>{{ i18n.help.modal.touchscreen.zoomY }}</li>
            <li>{{ i18n.help.modal.touchscreen.zoomX }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.mouse.title">
            <li>{{ i18n.help.modal.mouse.tapPrimary }}</li>
            <li>{{ i18n.help.modal.mouse.dragPrimary }}</li>
            <li>{{ i18n.help.modal.mouse.tapSecondary }}</li>
            <li>{{ i18n.help.modal.mouse.dragSecondary }}</li>
            <li>{{ i18n.help.modal.mouse.scroll }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.keyboard.title">
            <li>{{ i18n.help.modal.keyboard.single }}</li>
            <li>{{ i18n.help.modal.keyboard.multiple }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.selectTool.title">
            <li>{{ i18n.help.modal.selectTool.select }}</li>
            <li>{{ i18n.help.modal.selectTool.toggle }}</li>
            <li>{{ i18n.help.modal.selectTool.deselect }}</li>
            <li>{{ i18n.help.modal.selectTool.move }}</li>
            <li>{{ i18n.help.modal.selectTool.selectMultiple }}</li>
            <li>{{ i18n.help.modal.selectTool.selectAdd }}</li>
            <li>{{ i18n.help.modal.selectTool.ctrl }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.eraserTool.title">
            <li>{{ i18n.help.modal.eraserTool.erase }}</li>
            <li>{{ i18n.help.modal.eraserTool.deselect }}</li>
            <li>{{ i18n.help.modal.eraserTool.eraseMultiple }}</li>
            <li>{{ i18n.help.modal.eraserTool.ctrl }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.brushTool.title">
            <li>{{ i18n.help.modal.brushTool.brush }}</li>
            <li>{{ i18n.help.modal.brushTool.deselect }}</li>
            <li>{{ i18n.help.modal.brushTool.brushMultiple }}</li>
            <li>{{ i18n.help.modal.brushTool.ctrl }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.pasteTool.title">
            <li>{{ i18n.help.modal.pasteTool.paste }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.tapNoteTool.title">
            <li>{{ i18n.help.modal.tapNoteTool.edit }}</li>
            <li>{{ i18n.help.modal.tapNoteTool.add }}</li>
            <li>{{ i18n.help.modal.tapNoteTool.move }}</li>
            <li>{{ i18n.help.modal.tapNoteTool.properties }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.singleHoldNoteTool.title">
            <li>{{ i18n.help.modal.singleHoldNoteTool.edit }}</li>
            <li>{{ i18n.help.modal.singleHoldNoteTool.add }}</li>
            <li>{{ i18n.help.modal.singleHoldNoteTool.connect }}</li>
            <li>{{ i18n.help.modal.singleHoldNoteTool.move }}</li>
            <li>{{ i18n.help.modal.singleHoldNoteTool.properties }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.doubleHoldNoteTool.title">
            <li>{{ i18n.help.modal.doubleHoldNoteTool.edit }}</li>
            <li>{{ i18n.help.modal.doubleHoldNoteTool.add }}</li>
            <li>{{ i18n.help.modal.doubleHoldNoteTool.connect }}</li>
            <li>{{ i18n.help.modal.doubleHoldNoteTool.move }}</li>
            <li>{{ i18n.help.modal.doubleHoldNoteTool.properties }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.rotateEventTool.title">
            <li>{{ i18n.help.modal.rotateEventTool.edit }}</li>
            <li>{{ i18n.help.modal.rotateEventTool.add }}</li>
            <li>{{ i18n.help.modal.rotateEventTool.move }}</li>
            <li>{{ i18n.help.modal.rotateEventTool.properties }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.shiftEventTool.title">
            <li>{{ i18n.help.modal.shiftEventTool.edit }}</li>
            <li>{{ i18n.help.modal.shiftEventTool.add }}</li>
            <li>{{ i18n.help.modal.shiftEventTool.move }}</li>
            <li>{{ i18n.help.modal.shiftEventTool.properties }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.zoomEventTool.title">
            <li>{{ i18n.help.modal.zoomEventTool.edit }}</li>
            <li>{{ i18n.help.modal.zoomEventTool.add }}</li>
            <li>{{ i18n.help.modal.zoomEventTool.move }}</li>
            <li>{{ i18n.help.modal.zoomEventTool.properties }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.bpmTool.title">
            <li>{{ i18n.help.modal.bpmTool.edit }}</li>
            <li>{{ i18n.help.modal.bpmTool.add }}</li>
            <li>{{ i18n.help.modal.bpmTool.move }}</li>
        </HelpSection>

        <HelpSection :title="i18n.help.modal.timeScaleTool.title">
            <li>{{ i18n.help.modal.timeScaleTool.edit }}</li>
            <li>{{ i18n.help.modal.timeScaleTool.add }}</li>
            <li>{{ i18n.help.modal.timeScaleTool.move }}</li>
        </HelpSection>
    </BaseModal>
</template>
