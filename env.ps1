# source ecmascript powershell functions
. D:\@db-developer\powershell\jsshell\ecma.ps1

function clean {
  Clean-NPM
}

function install {
  Install-NPM
}

function outdated {
  grunt check_outdated
}

function push {
  git push -u gitlab master
}

Restrict-ScriptingEnvironments -MinNodeVersion 20 -MinPythonVersion 3
Set-ScriptingEnvironments -NodeVersion 20
Report-ScriptingEnvironments
