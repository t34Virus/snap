const { exec } = require('child_process');

exec('C:\\Users\\TROJAN\\Projects\\work\\ComfyUI_windows_portable_nvidia_cu121_or_cpu\\ComfyUI_windows_portable\\run_nvidia_gpu.bat', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing batch file: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});