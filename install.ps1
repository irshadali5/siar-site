# ==============================================================================
# SIAR PowerShell Fast Bootstrapper & Installer
# Official Endpoint: https://siar.irshad.org.in/install.ps1
# Repository: https://pkg.siar.irshad.org.in/
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  SIAR: Survivable Identity & Autonomous Routing" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$arch = [System.Environment]::GetEnvironmentVariable("PROCESSOR_ARCHITECTURE")
if ($arch -ne "AMD64" -and $arch -ne "ARM64") {
    Write-Error "Unsupported Windows architecture: $arch"
    exit 1
}

$version = "v0.1.0"
$baseUrl = "https://pkg.siar.irshad.org.in/releases"
$fileName = "siar-cli-$version-x86_64-pc-windows-msvc.zip"
$downloadUrl = "$baseUrl/$fileName"

$installDir = "$env:LOCALAPPDATA\Programs\Siar"
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

$tempZip = [System.IO.Path]::GetTempFileName() + ".zip"

Write-Host "[-] Downloading SIAR for Windows..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing

Write-Host "[-] Extracting archive to $installDir..." -ForegroundColor Yellow
Expand-Archive -Path $tempZip -DestinationPath $installDir -Force
Remove-Item -Path $tempZip -Force

$userPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($userPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$installDir", [EnvironmentVariableTarget]::User)
    Write-Host "[✓] Added SIAR to User PATH environment variable." -ForegroundColor Green
}

Write-Host "[✓] SIAR CLI successfully installed!" -ForegroundColor Green
Write-Host "Open a new PowerShell terminal and run 'siar-cli --help'." -ForegroundColor Cyan
