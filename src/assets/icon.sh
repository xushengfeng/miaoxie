size=(16 32 48 64 128 256 512 1024)

echo Making bitmaps from your svg...

for i in ${size[@]}; do
  inkscape --export-type="png" --export-filename="../../src-tauri/icons/${i}x$i.png" -w $i -h $i icon.svg
done 
convert -density 256x256 -background transparent icon.svg -define icon:auto-resize=256,48,32,16 -colors 256 ../../src-tauri/icons/icon.ico
