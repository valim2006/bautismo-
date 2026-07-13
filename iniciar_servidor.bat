@echo off
title Servidor de Invitacion Bautismo - Leon
echo ==========================================================
echo    Iniciando servidor local para la invitacion interactiva
echo ==========================================================
echo.
echo Abriendo tu navegador en http://localhost:8000 ...
start http://localhost:8000
echo.
echo Deja esta ventana abierta mientras pruebas la invitacion.
echo Para cerrarla, presiona Ctrl + C o cierra la ventana.
echo ==========================================================
echo.
python -m http.server 8000
