import Recorder from "js-audio-recorder";
import lamejs from "lamejstmp"; // lamejstmp 替代 lamejs 解决引入问题： https://github.com/zhuker/lamejs/issues/91#issuecomment-1146587589
import Player from "js-audio-recorder/src/player/player";
const baiduConfig = {
  client_id: 'IyCRBhk5HHDyiyB4hykIjUSH',
  client_secret: 'WEchmCgbezosAZBiTVjhNaRIHFaE1EER'
}
export class RealizeRecorder {
  recorder = null;
  // 采样位数
  sampleBit = 16;
  // 采样率
  sampleRate = 16000;
  // 声道数
  numChannel = 1;
  // 边录边转、播
  compiling = false;
  // 定时器
  playTimer;
  // 是否正在录音
  isRecording = false;
  // 录音时长
  duration = 0;
  // 录音大小
  fileSize = 0;
  // 当前录音音量百分比(%)
  vol = 0;
  constructor() {}
  // 初始化
  initRecorder() {
    const config = this.getOption();
    this.recorder = new Recorder(config);
  }
  // 销毁
  destroyRecord() {
    this.clearPlay();
    if (!this.recorder) return;
    this.recorder.destroy().then(() => {
      this.recorder = null;
    });
  }
  getOption() {
    return {
      sampleBits: this.sampleBit,
      sampleRate: this.sampleRate,
      numChannels: this.numChannel,
      compiling: this.compiling,
    };
  }
  // 重置配置
  resetOption() {
    this.sampleBit = 16;
    this.sampleRate = 16000;
    this.numChannel = 1;
    this.compiling = false;
  }
  // 切换采样率
  changeSampleRate(sampleRate) {
    this.sampleRate = sampleRate;
  }
  // 切换采样位数
  changeSampleBit() {
    this.sampleBit = sampleBit;
  }
  // 开始录音
  startRecord() {
    if (!this.recorder) {
      this.initRecorder();
    } else {
      this.recorder.stop();
    }
    // TODO:使用127.0.0.1或localhost尝试，因为getUserMedia在高版本的chrome下需要使用https。
    // 授权麦克风
    Recorder.getPermission().then(
      () => {
        this.recorder.start().then(
          () => {
            console.log("开始录音");
          },
          (error) => {
            console.log(`异常了,${error.name}:${error.message}`);
          }
        );
      },
      (error) => {
        alert("暂无麦克风权限，请打开后再次尝试");
        console.log(`${error.name} : ${error.message}`);
      }
    );

    this.recorder.onprogress = (params) => {
      this.duration = params.duration.toFixed(5);
      this.fileSize = params.fileSize;
      this.vol = params.vol.toFixed(2);

      // 边录边转、播
      if (this.compiling) {
        console.log("音频总数据：", params.data);
      }
    };

    this.recorder.onplay = () => {
      console.log("%c回调监听，开始播放音频", "color: #2196f3");
    };
    this.recorder.onpauseplay = () => {
      console.log("%c回调监听，暂停播放音频", "color: #2196f3");
    };
    this.recorder.onresumeplay = () => {
      console.log("%c回调监听，恢复播放音频", "color: #2196f3");
    };
    this.recorder.onstopplay = () => {
      console.log("%c回调监听，停止播放音频", "color: #2196f3");
    };
    this.recorder.onplayend = () => {
      console.log("%c回调监听，音频已经完成播放", "color: #2196f3");
    };

    if (this.compiling) {
      this.playTimer = setInterval(() => {
        if (!recorder) {
          return;
        }

        let newData = recorder.getNextData();
        if (!newData.length) {
          return;
        }
        let byteLength = newData[0].byteLength;
        let buffer = new ArrayBuffer(newData.length * byteLength);
        let dataView = new DataView(buffer);

        // 数据合并
        for (let i = 0, iLen = newData.length; i < iLen; ++i) {
          for (let j = 0, jLen = newData[i].byteLength; j < jLen; ++j) {
            dataView.setInt8(i * byteLength + j, newData[i].getInt8(j));
          }
        }

        // 将录音数据转成WAV格式，并播放
        let a = encodeWAV(
          dataView,
          config.sampleRate,
          config.sampleRate,
          config.numChannels,
          config.sampleBits
        );
        let blob = new Blob([a], { type: "audio/wav" });

        blob.arrayBuffer().then((arraybuffer) => {
          Player.play(arraybuffer);
        });
      }, 3000);
    }
  }
  // 暂停录音
  pauseRecord() {
    console.log("暂停录音");
    if (!this.recorder) return;
    this.recorder.pause();
  }
  // 恢复录音
  resumeRecord() {
    console.log("恢复录音");
    if (!this.recorder) return;
    this.recorder.resume();
  }
  // 结束录音
  endRecord() {
    console.log("结束录音");
    if (!this.recorder) return;
    this.recorder.stop();
  }
  // 播放录音
  playRecord() {
    console.log("播放录音");
    if (!this.recorder) return;
    this.recorder.play();
  }
  // 暂停播放
  pausePlay() {
    console.log("暂停播放");
    if (!this.recorder) return;
    this.recorder.pausePlay();
  }
  // 恢复播放
  resumePlay() {
    console.log("恢复播放");
    if (!this.recorder) return;
    this.recorder.resumePlay();
  }
  // 停止播放
  stopPlay() {
    console.log("停止播放");
    if (!this.recorder) return;
    this.recorder.stopPlay();
  }
  clearPlay() {
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }
  // 下载PCM
  downloadPCM() {
    if (!this.recorder) return;
    this.recorder.downloadPCM();
  }
  // 下载WAV
  downloadWAV() {
    if (!this.recorder) return;
    console.log(this.recorder.getWAV());
    this.recorder.downloadWAV();
  }
  // 下载
  download(name) {
    if (!this.recorder) return;
    const mp3Blob = this.convertToMp3(this.recorder.getWAV());
    this.recorder.download(mp3Blob, name || "recorder", "mp3");
  }
  // TODO: 16位的采样位数支持mp3
  convertToMp3(wavDataView) {
    if (!this.recorder) return;
    // debugger
    // 获取wav头信息
    const wav = lamejs.WavHeader.readHeader(wavDataView); // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
    const { channels, sampleRate } = wav;
    console.log("wav", wav);
    const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);

    // 获取左右通道数据
    const result = this.recorder.getChannelData();
    const buffer = [];

    const leftData =
      result.left &&
      new Int16Array(result.left.buffer, 0, result.left.byteLength / 2);
    const rightData =
      result.right &&
      new Int16Array(result.right.buffer, 0, result.right.byteLength / 2);
    const remaining = leftData.length + (rightData ? rightData.length : 0);

    const maxSamples = 1152;
    for (let i = 0; i < remaining; i += maxSamples) {
      const left = leftData.subarray(i, i + maxSamples);
      let right = null;
      let mp3buf = null;

      if (channels === 2) {
        right = rightData.subarray(i, i + maxSamples);
        mp3buf = mp3enc.encodeBuffer(left, right);
      } else {
        mp3buf = mp3enc.encodeBuffer(left);
      }

      if (mp3buf.length > 0) {
        buffer.push(mp3buf);
      }
    }

    const enc = mp3enc.flush();

    if (enc.length > 0) {
      buffer.push(enc);
    }

    return new Blob(buffer, { type: "audio/mp3" });
  }
  // 语音识别文字-阿里云
  translateAli() {}
  // 语音识别文字-百度云
  async translateBaidu() {
    return new Promise((res, rej) => {
      const mp3Blob = this.recorder.getWAVBlob();
      blobToBase64(mp3Blob, (base64Data) => {
        // 授权
        fetch("/api/voice/oauth", {
          method: "get",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          }
        })
          .then((res) => res.json())
          .then((authRes) => {
            if (authRes.code === 200) {
              const speech = base64Data.replace("data:audio/wav;base64,", "");
              const data = {
                format: "pcm",
                rate: 16000,
                channel: 1,
                token: authRes.data.access_token,
                cuid: "baidu_workshop",
                len: mp3Blob.size,
                speech: speech,
              };
              // 语音转文字
              fetch("/baidu/server_api", {
                method: "post",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((res) => res.json())
                .then((result) => {
                  res(result);
                })
                .catch((error) => {
                  rej(error);
                });
            }
          })
          .catch((error) => {
            rej(error);
          });
      });
    });
  }
}

// blob转base64
function blobToBase64(blob, callback) {
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    callback(e.target.result);
  };
  fileReader.readAsDataURL(blob);
}
