# First terminal
Start-Process -FilePath "powershell.exe" -ArgumentList "-File Launch_backend.ps1"

# Second terminal
Start-Process -FilePath "powershell.exe" -ArgumentList "-File Launch_frontend.ps1"

# Close PS window
Stop-Process -Id $PID
