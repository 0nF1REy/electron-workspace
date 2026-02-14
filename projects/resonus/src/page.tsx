import React from "react";
import { ReactComponent as FolderIcon } from "../assets/folder.svg";
import { ReactComponent as PlayIcon } from "../assets/play.svg";
import { ReactComponent as PauseIcon } from "../assets/pause.svg";
import { ReactComponent as StopIcon } from "../assets/stop.svg";

import { TDirStructure } from "./shared/types";
import { join_path, os_sep, sort_dir } from "./shared/functions";

const Home: React.FC = React.memo(() => {
  const main_cont_ref = React.useRef<HTMLDivElement | null>(null);
  const progress_cont_ref = React.useRef<HTMLDivElement | null>(null);
  const visualizer_ref = React.useRef<HTMLDivElement | null>(null);
  const audio_element_ref = React.useRef<HTMLAudioElement | null>(null);
  const [dir, set_dir] = React.useState<TDirStructure[]>([]);
  const [isPlaying, set_IsPlaying] = React.useState<boolean>(false);
  const [audio_duration, set_audio_duration] = React.useState<string>("00:00");
  const [audio_time, set_audio_time] = React.useState<string>("00:00");
  const [current_audio, set_current_audio] = React.useState<string>("");
  const [current_path, set_current_path] = React.useState<string>("");

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      console.log("e target", e.currentTarget, e.target);
      if (!(e.target as HTMLElement).classList.contains("resize")) {
        main_cont_ref.current.onmousemove = null;
        main_cont_ref.current.onmouseup = null;
        return;
      }

      main_cont_ref.current.onmousemove = (e) => handleMouseMove(e);
      main_cont_ref.current.onmouseup = (e) => handleMouseUp(e);
    },
    [main_cont_ref.current]
  );

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      console.log("e", e);
      e.stopPropagation();
      document.documentElement.style.setProperty(
        "--sidebar-width",
        e.clientX + "px"
      );
    },
    [main_cont_ref.current]
  );

  const handleMouseUp = React.useCallback(
    (e: MouseEvent) => {
      console.log("e", e);
      e.stopPropagation();
      main_cont_ref.current.onmousemove = null;
      main_cont_ref.current.onmouseup = null;
    },
    [main_cont_ref.current]
  );

  const handleListDir = React.useCallback(async (path?: string) => {
    const dir_content = await window.electron.get_dir(path);
    console.log("dir_content", dir_content);
    set_current_path(
      dir_content.length == 0 ? path : dir_content[0].parentPath
    );
    set_dir(dir_content.sort(sort_dir));
  }, []);

  const handleGetFile = React.useCallback(
    async (path: string) => {
      const file_content = await window.electron.get_file(path);
      console.log("file_content", file_content);
      const file = new File([new Uint8Array(file_content)], "audio-file", {
        type: "audio/mp3",
      });
      const fr = new FileReader();
      fr.onload = async (e) => {
        // e.target.result
        if (audio_element_ref.current != null)
          audio_element_ref.current?.pause();
        audio_element_ref.current = new Audio(e.target.result as string);
        await audio_element_ref.current.play();
        set_IsPlaying(true);

        const path_parts = path.split(os_sep());
        set_current_audio(path_parts[path_parts.length - 1]);

        audio_element_ref.current.ontimeupdate = () => {
          if (!audio_element_ref.current) return;
          const current_time = audio_element_ref.current.currentTime;
          const secs =
            current_time % 60 < 10
              ? "0" + Math.floor(current_time % 60)
              : Math.floor(current_time % 60);
          const mins =
            current_time / 60 < 10
              ? "0" + Math.floor(current_time / 60)
              : Math.floor(current_time / 60);
          set_audio_time(mins + ":" + secs);
          if (progress_cont_ref.current) {
            progress_cont_ref.current.style.width =
              (audio_element_ref.current.currentTime /
                audio_element_ref.current.duration) *
                100 +
              "%";
          }
        };

        const duration = audio_element_ref.current.duration;

        const secs =
          duration % 60 < 10
            ? "0" + Math.floor(duration % 60)
            : Math.floor(duration % 60);
        const mins =
          duration / 60 < 10
            ? "0" + Math.floor(duration / 60)
            : Math.floor(duration / 60);
        set_audio_duration(mins + ":" + secs);

        const audio_context = new AudioContext();
        const analyzer = audio_context.createAnalyser();

        const audio_source = audio_context.createMediaElementSource(
          audio_element_ref.current
        );
        audio_source.connect(analyzer);
        audio_source.connect(audio_context.destination);

        const frequencyData = new Uint8Array(analyzer.frequencyBinCount);

        const update_source = () => {
          if (!visualizer_ref.current) return;
          analyzer.getByteFrequencyData(frequencyData);
          visualizer_ref.current.innerHTML = "";
          for (let index = 0; index < frequencyData.length; index++) {
            const freq = (frequencyData[index] / 255) * 100 + 1;
            const bar = document.createElement("div");
            bar.className = "bar";
            bar.style.height = freq + "%";
            visualizer_ref.current.appendChild(bar);
          }

          requestAnimationFrame(update_source);
        };
        update_source();
      };
      fr.readAsDataURL(file);
    },
    [progress_cont_ref, visualizer_ref]
  );

  const handle_play_pause = React.useCallback((state: boolean) => {
    if (!audio_element_ref.current) return;

    state
      ? audio_element_ref.current.play()
      : audio_element_ref.current.pause();
    set_IsPlaying(state);
  }, []);

  const handle_stop = React.useCallback(() => {
    if (!audio_element_ref.current) return;

    audio_element_ref.current.pause();
    audio_element_ref.current.currentTime = 0;
    set_IsPlaying(false);
  }, []);

  const handle_seek = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.stopPropagation();
      if (audio_element_ref.current == null) return;

      const seeker_cont_rect = e.currentTarget.getBoundingClientRect();
      const distance = e.clientX - seeker_cont_rect.x;
      const perc_moved = distance / seeker_cont_rect.width;
      const audio_el_duration_perc =
        perc_moved * audio_element_ref.current.duration;
      audio_element_ref.current.currentTime = audio_el_duration_perc;
    },
    []
  );

  const handle_content_menu = React.useCallback(() => {
    window.electron.open_context_menu(
      current_path,
      (dir_content: TDirStructure[]) => {
        console.log("callback works", dir_content);
        set_current_path(
          dir_content.length == 0 ? current_path : dir_content[0].parentPath
        );
        set_dir(dir_content.sort(sort_dir));
      }
    );
  }, [current_path]);

  React.useLayoutEffect(() => {
    handleListDir();
  }, []);

  return (
    <>
      <div className="header">Resonus</div>
      <div ref={main_cont_ref} className="main" onMouseDown={handleMouseDown}>
        <div
          className="sidebar"
          onAuxClick={handle_content_menu}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="resize"></div>
          <div className="pagination">
            {current_path.split(os_sep()).map((p, i) => (
              <span
                key={i}
                className="path"
                onClick={() =>
                  handleListDir(
                    current_path
                      .split(os_sep())
                      .slice(0, i + 1)
                      .join(os_sep())
                  )
                }
              >
                {p + os_sep()}
              </span>
            ))}
          </div>
          <div className="directory-list">
            {dir.map((d) => (
              <div
                key={d.name}
                onClick={() =>
                  d.isDir
                    ? handleListDir(join_path([d.parentPath, d.name]))
                    : handleGetFile(join_path([d.parentPath, d.name]))
                }
                className={d.isDir ? "list-item directory" : "list-item"}
              >
                {d.isDir && <FolderIcon width={20} height={20} />}
                <span
                  className={current_audio == d.name ? "current-playing" : ""}
                >
                  {d.name}
                </span>
              </div>
            ))}

            {dir.length == 0 && (
              <div className={"list-item"}>
                <span>
                  <em>Este diretório está vazio</em>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="content">
          <div className="wrapper">
            <div className="visualizer" ref={visualizer_ref}></div>
            <div className="current-audio" onClick={handle_seek}>
              {current_audio}
            </div>
            <div className="progress" onClick={handle_seek}>
              <div ref={progress_cont_ref} className="inner"></div>
            </div>
            <div className="controls">
              <span>
                <span>{audio_time}</span>
                <span> - {audio_duration}</span>
              </span>
              {isPlaying ? (
                <PauseIcon
                  className={!current_audio ? "disabled" : ""}
                  onClick={() => handle_play_pause(false)}
                  width={20}
                  height={20}
                />
              ) : (
                <PlayIcon
                  className={!current_audio ? "disabled" : ""}
                  onClick={() => handle_play_pause(true)}
                  width={20}
                  height={20}
                />
              )}
              <StopIcon
                className={!current_audio ? "disabled" : ""}
                onClick={handle_stop}
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Home;
