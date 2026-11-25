(() => {
  // --- 1. DATA & CONFIGURATION ---
  const GRADE_POINTS = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const WEIGHT_BONUS = {
    'Regular': 0.0,
    'Honors': 0.5,
    'AP/IB': 1.0
  };

  // Application State
  let state = {
    isWeighted: false,
    prevGpa: '',
    prevCredits: '',
    courses: [
      { id: 1, name: 'AP Calculus AB', credits: 4, grade: 'A', level: 'AP/IB' },
      { id: 2, name: 'Honors English III', credits: 3, grade: 'B+', level: 'Honors' },
      { id: 3, name: 'World History', credits: 3, grade: 'A-', level: 'Regular' }
    ]
  };

  let nextId = 4;

  // --- 2. INJECT CSS STYLES ---
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      body { background: #f1f5f9; color: #1e293b; padding: 24px 16px; display: flex; justify-content: center; }
      #gpa-app { width: 100%; max-width: 820px; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); padding: 28px; }
      .header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 22px; }
      .header h1 { font-size: 1.5rem; color: #0f172a; }
      .toggle-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 8px 14px; border-radius: 999px; border: 1px solid #cbd5e1; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
      .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; margin-bottom: 24px; }
      .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; }
      .stat-card.primary { background: #eff6ff; border-color: #bfdbfe; }
      .stat-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; }
      .stat-value { font-size: 1.9rem; font-weight: 800; color: #0f172a; margin-top: 4px; }
      .stat-card.primary .stat-value { color: #2563eb; }
      .section-title { font-size: 0.95rem; font-weight: 700; color: #334155; margin-bottom: 10px; }
      .prev-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
      .course-row { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1.2fr auto; gap: 10px; margin-bottom: 10px; align-items: center; }
      @media (max-width: 640px) {
        .course-row { grid-template-columns: 1fr 1fr; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .course-row input[type="text"] { grid-column: span 2; }
      }
      input, select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background: #fff; color: #1e293b; }
      input:focus, select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
      .btn { padding: 10px 16px; border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: 0.15s; }
      .btn-add { background: #2563eb; color: #fff; }
      .btn-add:hover { background: #1d4ed8; }
      .btn-reset { background: #f1f5f9; color: #475569; }
      .btn-reset:hover { background: #e2e8f0; }
      .btn-del { background: #fee2e2; color: #dc2626; padding: 10px 12px; }
      .btn-del:hover { background: #fecaca; }
      .actions { display: flex; gap: 10px; margin-top: 14px; }
    `;
    document.head.appendChild(style);
  }

  // --- 3. BACKEND CALCULATION ENGINE ---
  function calculateStats() {
    let semesterPoints = 0;
    let semesterCredits = 0;

    state.courses.forEach(course => {
      const credits = parseFloat(course.credits);
      if (!isNaN(credits) && credits > 0 && GRADE_POINTS.hasOwnProperty(course.grade)) {
        let base = GRADE_POINTS[course.grade];
        // Add weight bonus only if weighted mode is on and the student passed (grade > F)
        if (state.isWeighted && base > 0) {
          base += WEIGHT_BONUS[course.level] || 0;
        }
        semesterPoints += base * credits;
        semesterCredits += credits;
      }
    });

    const semesterGpa = semesterCredits > 0 ? (semesterPoints / semesterCredits) : 0;

    // Cumulative Calculation
    const prevGpa = parseFloat(state.prevGpa);
    const prevCredits = parseFloat(state.prevCredits);
    let cumulativeGpa = semesterGpa;

    if (!isNaN(prevGpa) && !isNaN(prevCredits) && prevCredits > 0) {
      const totalPoints = semesterPoints + (prevGpa * prevCredits);
      const totalCredits = semesterCredits + prevCredits;
      cumulativeGpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    }

    return {
      semesterGpa: semesterGpa.toFixed(2),
      cumulativeGpa: cumulativeGpa.toFixed(2),
      totalCredits: semesterCredits.toFixed(1),
      qualityPoints: semesterPoints.toFixed(2)
    };
  }

  // --- 4. DOM RENDERER ---
  function createEl(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'className') el.className = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else {
        el.setAttribute(key, val);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    });
    return el;
  }

  function updateDashboardUI() {
    const stats = calculateStats();
    document.getElementById('val-sem-gpa').textContent = stats.semesterGpa;
    document.getElementById('val-cum-gpa').textContent = stats.cumulativeGpa;
    document.getElementById('val-credits').textContent = stats.totalCredits;
    document.getElementById('val-points').textContent = stats.qualityPoints;
  }

  function renderCourses() {
    const listContainer = document.getElementById('course-list');
    listContainer.innerHTML = '';

    state.courses.forEach(course => {
      const nameInput = createEl('input', {
        type: 'text',
        placeholder: 'Course Name (e.g. Biology)',
        value: course.name,
        onInput: (e) => { course.name = e.target.value; }
      });

      const creditsInput = createEl('input', {
        type: 'number',
        step: '0.5',
        min: '0',
        placeholder: 'Credits',
        value: course.credits,
        onInput: (e) => {
          course.credits = e.target.value;
          updateDashboardUI();
        }
      });

      const gradeSelect = createEl('select', {
        onChange: (e) => {
          course.grade = e.target.value;
          updateDashboardUI();
        }
      }, Object.keys(GRADE_POINTS).map(g => {
        const opt = createEl('option', { value: g, textContent: g });
        if (course.grade === g) opt.selected = true;
        return opt;
      }));

      const levelSelect = createEl('select', {
        onChange: (e) => {
          course.level = e.target.value;
          updateDashboardUI();
        }
      }, Object.keys(WEIGHT_BONUS).map(lvl => {
        const opt = createEl('option', { value: lvl, textContent: lvl });
        if (course.level === lvl) opt.selected = true;
        return opt;
      }));

      const delBtn = createEl('button', {
        className: 'btn btn-del',
        textContent: '✕',
        title: 'Remove Course',
        onClick: () => {
          state.courses = state.courses.filter(c => c.id !== course.id);
          renderCourses();
          updateDashboardUI();
        }
      });

      const row = createEl('div', { className: 'course-row' }, [
        nameInput, creditsInput, gradeSelect, levelSelect, delBtn
      ]);
      listContainer.appendChild(row);
    });
  }

  function initApp() {
    injectStyles();

    const app = createEl('div', { id: 'gpa-app' });

    // Header & Weighted Toggle
    const weightCheckbox = createEl('input', {
      type: 'checkbox',
      style: 'width: auto; cursor: pointer;',
      onChange: (e) => {
        state.isWeighted = e.target.checked;
        updateDashboardUI();
      }
    });

    const header = createEl('div', { className: 'header' }, [
      createEl('h1', { textContent: 'GPA Calculator' }),
      createEl('label', { className: 'toggle-wrap' }, [
        weightCheckbox,
        'Weighted Scale (5.0)'
      ])
    ]);

    // Stats Dashboard
    const dashboard = createEl('div', { className: 'dashboard' }, [
      createEl('div', { className: 'stat-card primary' }, [
        createEl('div', { className: 'stat-label', textContent: 'Semester GPA' }),
        createEl('div', { className: 'stat-value', id: 'val-sem-gpa', textContent: '0.00' })
      ]),
      createEl('div', { className: 'stat-card' }, [
        createEl('div', { className: 'stat-label', textContent: 'Cumulative GPA' }),
        createEl('div', { className: 'stat-value', id: 'val-cum-gpa', textContent: '0.00' })
      ]),
      createEl('div', { className: 'stat-card' }, [
        createEl('div', { className: 'stat-label', textContent: 'Total Credits' }),
        createEl('div', { className: 'stat-value', id: 'val-credits', textContent: '0.0' })
      ]),
      createEl('div', { className: 'stat-card' }, [
        createEl('div', { className: 'stat-label', textContent: 'Quality Points' }),
        createEl('div', { className: 'stat-value', id: 'val-points', textContent: '0.00' })
      ])
    ]);

    // Previous Cumulative Inputs
    const prevSection = createEl('div', {}, [
      createEl('div', { className: 'section-title', textContent: 'Prior Academic Standing (Optional)' }),
      createEl('div', { className: 'prev-grid' }, [
        createEl('input', {
          type: 'number',
          step: '0.01',
          min: '0',
          max: '5',
          placeholder: 'Previous Cumulative GPA',
          onInput: (e) => {
            state.prevGpa = e.target.value;
            updateDashboardUI();
          }
        }),
        createEl('input', {
          type: 'number',
          step: '0.5',
          min: '0',
          placeholder: 'Previous Credits Earned',
          onInput: (e) => {
            state.prevCredits = e.target.value;
            updateDashboardUI();
          }
        })
      ])
    ]);

    // Course List & Action Buttons
    const courseList = createEl('div', { id: 'course-list' });
    const actions = createEl('div', { className: 'actions' }, [
      createEl('button', {
        className: 'btn btn-add',
        textContent: '+ Add Course',
        onClick: () => {
          state.courses.push({ id: nextId++, name: '', credits: 3, grade: 'A', level: 'Regular' });
          renderCourses();
          updateDashboardUI();
        }
      }),
      createEl('button', {
        className: 'btn btn-reset',
        textContent: 'Clear All',
        onClick: () => {
          state.courses = [{ id: nextId++, name: '', credits: 3, grade: 'A', level: 'Regular' }];
          state.prevGpa = '';
          state.prevCredits = '';
          app.querySelectorAll('.prev-grid input').forEach(inp => inp.value = '');
          renderCourses();
          updateDashboardUI();
        }
      })
    ]);

    app.append(
      header,
      dashboard,
      prevSection,
      createEl('div', { className: 'section-title', textContent: 'Current Courses' }),
      courseList,
      actions
    );

    document.body.appendChild(app);
    renderCourses();
    updateDashboardUI();
  }

  // Run automatically when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();