@echo off
REM ----------------------------------------
REM compress.bat – comprime .html, .css, .js en .gz
REM usando PowerShell (no se necesita gzip.exe)
REM ----------------------------------------

echo.
echo =====================================
echo   Compactando archivos a GZIP (.gz)…
echo =====================================
echo.

REM Borra viejos .gz (opcional)
del /q *.html.gz *.css.gz *.js.gz >nul 2>&1

for %%F in (*.html *.css *.js) do (
  if exist "%%F" (
    echo Comprimiendo %%F → %%F.gz
    powershell -NoProfile -Command ^
      "$in = '%%~fF';" ^
      "$out = \"$in.gz\";" ^
      "$bytes = [IO.File]::ReadAllBytes($in);" ^
      "$fs = [IO.File]::Create($out);" ^
      "$gz = New-Object IO.Compression.GzipStream($fs,[IO.Compression.CompressionLevel]::Optimal);" ^
      "$gz.Write($bytes,0,$bytes.Length); $gz.Close(); $fs.Close();"
  )
)

echo.
echo =====================================
echo   Archivos .gz generados:
echo =====================================
dir /b *.gz
echo.
pause
