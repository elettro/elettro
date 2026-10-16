import json, pathlib, subprocess, urllib.request, urllib.parse, zipfile, concurrent.futures, tempfile, shutil
ROOT = pathlib.Path("clients/bobby")
OUT = ROOT / "media"
OUT.mkdir(parents=True, exist_ok=True)
items = json.loads((ROOT / "gallery.json").read_text())
folder = "https://www.dropbox.com/scl/fo/96horfan3ibtkjj2irh3c/ADut0zOTiAGQ0-_QPeck6Dc?rlkey=gu1kl81682x2gbp1wr3l6i1wr&dl=1"
work = pathlib.Path(tempfile.mkdtemp(prefix="bobby-media-"))
try:
    archive = work / "source.zip"
    print("Downloading publicly shared source folder", flush=True)
    urllib.request.urlretrieve(folder, archive)
    with zipfile.ZipFile(archive) as z:
        names = z.namelist()
        for item in items:
            if not item.get("sourcePath"): continue
            suffix = item["sourcePath"]
            matches = [n for n in names if n == suffix or n.endswith("/" + suffix)]
            if len(matches) != 1: raise RuntimeError("Missing or ambiguous source: " + suffix)
            target = work / (item["id"] + pathlib.Path(item["filename"]).suffix.lower())
            with z.open(matches[0]) as source, target.open("wb") as dest: shutil.copyfileobj(source, dest)
            item["_local"] = str(target)
    archive.unlink()
    for item in items:
        if item.get("_local"): continue
        url = item["sourceUrl"].replace("dl=0", "dl=1")
        target = work / (item["id"] + pathlib.Path(item["filename"]).suffix.lower())
        urllib.request.urlretrieve(url, target)
        item["_local"] = str(target)
    def render(item):
        ident = item["id"]
        source = item["_local"]
        ext = "mp3" if item["type"] == "audio" else "mp4"
        output = OUT / (ident + "." + ext)
        if item["type"] == "audio":
            cmd = ["ffmpeg","-v","error","-y","-i",source,"-vn","-c:a","libmp3lame","-b:a","192k",str(output)]
        else:
            cmd = ["ffmpeg","-v","error","-y","-i",source,"-map","0:v:0","-map","0:a?","-vf","scale=w='min(960,iw)':h='min(960,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2","-c:v","libx264","-preset","fast","-crf","24","-threads","2","-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-movflags","+faststart",str(output)]
        subprocess.run(cmd, check=True)
        if output.stat().st_size > 90_000_000: raise RuntimeError("Preview too large: " + ident)
        info = json.loads(subprocess.check_output(["ffprobe","-v","error","-show_format","-show_streams","-of","json",str(output)]))
        item["duration"] = round(float(info["format"]["duration"]), 1)
        item["src"] = "media/" + output.name
        if item["type"] == "video":
            video = next(s for s in info["streams"] if s["codec_type"] == "video")
            item["width"], item["height"] = video["width"], video["height"]
            poster = OUT / (ident + ".jpg")
            subprocess.run(["ffmpeg","-v","error","-y","-ss",str(min(1.0,item["duration"]/3)),"-i",source,"-frames:v","1","-vf","scale=640:-2","-q:v","3",str(poster)], check=True)
            item["poster"] = "media/" + poster.name
        del item["_local"]
        print("Rendered " + ident + " " + item["filename"], flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        list(executor.map(render, items))
    (ROOT / "gallery.json").write_text(json.dumps(items,ensure_ascii=False,indent=2)+"\n")
finally:
    shutil.rmtree(work)
