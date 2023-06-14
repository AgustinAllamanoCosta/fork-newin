export const execCallback = (error, stdout, stderr) => {
  if (error) {
    console.log(`neWin error: ${error.message}`)
  } else if (stderr) {
    console.log(`neWin stderr: ${stderr}`)
  } else if (stdout) {
    console.log(`neWin stdout: ${stdout}`)
  }
}
