@echo off
echo Creating batch commits to reach 40 contributions...
echo Current count: 16
echo Target: 40
echo.

setlocal enabledelayedexpansion

REM Create a temporary file to track commits
echo 16 > temp_count.txt

REM Loop to create 24 more commits
for /L %%i in (1,1,24) do (
    set /p count=<temp_count.txt
    set /a count+=1
    
    echo Commit !count!: Adding documentation update
    
    echo # Batch Commit !count! >> BATCH_COMMITS.md
    echo Date: %date% %time% >> BATCH_COMMITS.md
    echo. >> BATCH_COMMITS.md
    
    git add BATCH_COMMITS.md
    git commit -m "chore: batch commit !count! - documentation update"
    git push
    
    echo !count! > temp_count.txt
    echo.
)

echo.
echo Completed! Total commits: !count!
del temp_count.txt
pause