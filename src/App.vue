<script setup>
import { ref } from "vue";
import { RealizeRecorder } from "./hooks/recorder.js";
import axios from "axios";
const recorderInstance = ref(new RealizeRecorder());
// console.log(recorderInstance.value.recorder.getWAV());
const url = ref("");
const text = ref("");
async function translateBaidu() {
  const res = await recorderInstance.value.translateBaidu()
  text.value = res.result[0]
}
</script>

<template>
  <div>
    <div>
      <button @click="recorderInstance.startRecord">开始录音</button>
      <button @click="recorderInstance.pauseRecord">暂停</button>
      <button @click="recorderInstance.resumeRecord">恢复</button>
      <button @click="recorderInstance.endRecord">录音停止</button>
    </div>
    <ul>
      <li>
        <label>录音时长: </label>
        <span>{{ recorderInstance.duration }}</span>
      </li>
      <li>
        <label>录音大小: </label>
        <span>{{ recorderInstance.fileSize }}</span>
      </li>
      <li>
        <label>音量大小: </label>
        <span>{{ recorderInstance.vol }}</span>
      </li>
    </ul>
    <div>
      <button @click="recorderInstance.playRecord">播放录音</button>
      <button @click="recorderInstance.pausePlay">暂停播放</button>
      <button @click="recorderInstance.resumePlay">恢复播放</button>
      <button @click="recorderInstance.stopPlay">停止播放</button>
    </div>
    <br />
    <div>
      <button @click="recorderInstance.downloadPCM">下载PCM</button>
      <button @click="recorderInstance.downloadWAV">下载WAV</button>
      <button @click="recorderInstance.download">下载MP3</button>
    </div>
    <br />
    <div>
      <button @click="translateBaidu">百度云转文字</button>
      <div>
        转换后文字：{{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
