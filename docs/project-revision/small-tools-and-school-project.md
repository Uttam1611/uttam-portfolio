# Small tools and the school project

Repos: `School-project`, `ncu-calendar-sync`, `Image-uploader-file-renamer`. **School-project** is a Class 12 Computer Science Tkinter application (login windows for admin, student and teacher; `school.db`; Excel files), uploaded to GitHub on 2025-06-02. It is **not proven** to be the Class 11 school project with the educator paper mentioned in your journey; confirm before connecting them. `Image-uploader-file-renamer` has one commit from another contributor.

## 1. Project overview

A school management desktop app (Tkinter + SQLite), a university-timetable-to-calendar sync script (`ncu_sync.py`, 467 lines) and an object-oriented image uploader and renamer.

## 2. Problem statement

Manage students, teachers and results at school; avoid typing a timetable into a calendar by hand; rename uploaded images consistently.

## 3. Why the project was built

Class 12 CS project; personal convenience tool; Python OOP practice. [CONFIRM dates and motives.]

## 4. System architecture

School-project: one window module per role (`Ad_lgn_win.py`, `stud_lgn_win.py`, `teach_lgn_win.py`) with `main.py` entry, `school.db`, spreadsheets. ncu-calendar-sync: one script. Uploader: `main.py` + `img_upload_oop.py`.

## 5. End-to-end execution flow

School-project: run `main.py` -> choose a role -> log in -> operate on `school.db`. [CONFIRM from the code.]

## 6. Technologies and why they were selected

Tkinter, SQLite, openpyxl/pandas for spreadsheets [CONFIRM]; a calendar API in ncu-calendar-sync [CONFIRM which].

## 7. Important source files

`School-project/main.py`, `admin.py`, `teacher.py`, `studentbtn.py`, `getresult.py`; `ncu-calendar-sync/ncu_sync.py`; `Image-uploader-file-renamer/img_upload_oop.py`.

## 8. Main functions and modules

[CONFIRM] Read each file once and note the main classes.

## 9. Data flow

School-project: user input -> SQL -> database -> windows/printing.

## 10. Model choices and reasoning (where applicable)

Not applicable.

## 11. Database design (where applicable)

School-project: `school.db` SQLite. [CONFIRM table layout by opening the database.]

## 12. APIs and contracts (where applicable)

Not applicable.

## 13. Important implementation decisions

[CONFIRM]

## 14. Challenges and debugging

[CONFIRM]

## 15. What was actually implemented

Working small applications.

## 16. What was only planned

Nothing documented.

## 17. Current limitations

Hard-coded credentials risk in a school login app [CONFIRM]; no tests; GUI tied to database calls.

## 18. What should be improved

Hash passwords; separate GUI from data access; add tests; document setup.

## 19. Interview questions

- How does the school app authenticate users?
- Why SQLite?
- How does ncu_sync handle changes to a timetable?
- What does the uploader's OOP design look like?
- Which of these is yours alone?

## 20. Suggested answers based on the actual code

Describe each honestly as a small practice or utility project. Use the school app to show early fundamentals, only after you have confirmed it is the project you mean. [CONFIRM]
