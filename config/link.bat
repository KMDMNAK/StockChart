REM 命名は一文字
REM echo %~dp0
REM for文章でsourceをコピーする。

set CONSTANTS.TS_PATH=%CD%\constants.ts
set CONSTANTS.TS_TARGET=%CD%\src %CD%\client\src 
echo %CONSTANTS.TS_TARGET%


for %%p in (%CONSTANTS.TS_TARGET%) do (
   XCOPY /y %CONSTANTS.TS_PATH% %%p
)


set TYPE_DIRECTORY_PATH=%CD%\@types
set TYPE_DIRECTORY_TARGET=%CD%\src\@types %CD%\server\src\@types %CD%\client\src\@types

for %%p in (%TYPE_DIRECTORY_TARGET%) do (
   XCOPY /y %TYPE_DIRECTORY_PATH% %%p
)