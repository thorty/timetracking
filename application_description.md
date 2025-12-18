# Timetracing App

## introduction

a simple lightweight webapp for the dayly work.

## features

- organize projects and its tasks (crud)
- promodoro timeboxing to focus on work. 
- promodoro time slots is configureble (default 25 min focuswork / 5 pause)
- tracking time consumed for tasks and projects. 
- dashboard for presenting stats
- clear and simple responsive design 
- shows minimalistic motivatation phrases on timetracking page

## design

its a 3 page app:
1. task selection and promodoro timeboxing
2. project and task orchestration 
3. dashboard for statistics (consumed time for projects / finished task,...)

design prototypein in foilder: ./Design_prototype

## technical stack
- backend: 
    - persistant storage: sqllite
    - python fastapi 
- frontend:
    - react 

the fullstach app runs in one single docker container. 
