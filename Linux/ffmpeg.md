1. 将`mp4`文件转`DASH`并输出`480p`和`360p`两种格式
```bash
ffmpeg -hide_banner -y -threads 0 -i <MP4_FILE> \
# split将视频画面分成两个相同的流，[s0][s1]表示将输出的两个流命名为s0和s1
-filter_complex 'split=2[s0][s1];[s0]scale=480:-2[480s];[s1]scale=360:-2[360s]' \
-map '[480s]' -map '[360s]' -c:v libx264 -preset ultrafast \
-map a -c:a aac \
-sc_threshold 0 -b_strategy 0 \
-init_seg_name 'stream_$RepresentationID$_part_0.$ext$' -media_seg_name 'stream_$RepresentationID$_part_$Number$.$ext$' \
-adaptation_sets "id=0,streams=v id=1,streams=a"
# -g, group of pictures = 两个I‑frame间的距离
# https://stackoverflow.com/questions/67674772/ffmpeg-dash-ll-creates-audio-and-video-chunks-at-different-rates-player-is-conf
# 需要设为frameRate * segmentDuration，保证输出的视频和音频数量一致
-g 125 -seg_duration 5 \
-use_timeline 0 -use_template 1 \
-f dash <MPD_FILE>
```
2. 获取视频的帧率
```bash
ffprobe -v quiet -select_streams v -show_entries stream=r_frame_rate guide.mp4 <FILE>
```
