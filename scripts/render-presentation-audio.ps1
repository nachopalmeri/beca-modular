param(
  [Parameter(Mandatory=$true)][string]$ManifestPath,
  [Parameter(Mandatory=$true)][string]$OutputDirectory
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
[void][System.IO.Directory]::CreateDirectory($OutputDirectory)
$manifest = Get-Content -Raw -Encoding UTF8 $ManifestPath | ConvertFrom-Json
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $synth.SelectVoice('Microsoft Sabina Desktop')
  $synth.Rate = -1
  $synth.Volume = 96
  $synth.SetOutputToNull()
  foreach ($video in $manifest.videos) {
    $videoDirectory = Join-Path $OutputDirectory $video.id
    [void][System.IO.Directory]::CreateDirectory($videoDirectory)
    for ($index = 0; $index -lt $video.beats.Count; $index++) {
      $output = Join-Path $videoDirectory ('beat-{0:D2}.wav' -f $index)
      $synth.SetOutputToWaveFile($output, [System.Speech.AudioFormat.SpeechAudioFormatInfo]::new(48000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono))
      $synth.Speak($video.beats[$index].narration)
      $synth.SetOutputToNull()
    }
  }
} finally {
  $synth.Dispose()
}
Write-Output "Created Spanish narration WAVs in $OutputDirectory"
