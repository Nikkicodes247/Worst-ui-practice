// datepicker.js – Charkha & Bureaucracy Date Picker for Swaraj Dates™

window.Picker = (function() {
    let selected = { y: 1947, m: 8, d: 15 }; // Default: 15 August 1947 (m is 1-12)
    let charkhaRotation = 0;
    let charkhaSpins = 0;
    let mountRoot = null;
    let selectionAttempts = 0;
    let expiryTime = 24;
    let expiryInterval = null;

    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function daysInMonth(year, month) {
        // month is 1-12
        const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return days[month - 1];
    }

    function isValidDate(y, m, d) {
        if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
        if (y < 1857 || y > 2100) return false;
        if (m < 1 || m > 12) return false;
        const maxD = daysInMonth(y, m);
        if (d < 1 || d > maxD) return false;
        return true;
    }

    function notifyDateSelected() {
        if (mountRoot) {
            const event = new CustomEvent("date:selected", {
                detail: { y: selected.y, m: selected.m, d: selected.d },
                bubbles: true
            });
            mountRoot.dispatchEvent(event);
        }
        checkEasterEggs();
        trackSelections();
    }

    function trackSelections() {
        selectionAttempts++;
        const likeCountEl = document.getElementById("like-count-text");
        if (likeCountEl) {
            if (selectionAttempts <= 2) {
                likeCountEl.textContent = `${3 - selectionAttempts} likes left today. Refills at the next freedom movement.`;
            } else {
                likeCountEl.textContent = window.Copy.picker.likeLimitExhausted;
                if (window.Chaos) window.Chaos.recordFailure();
            }
        }
    }

    function checkEasterEggs() {
        const feedbackEl = document.getElementById("date-easter-egg-banner");
        if (!feedbackEl) return;

        let msg = "";
        const { y, m, d } = selected;

        if (d === 15 && m === 8 && y === 1947) {
            msg = "🇮🇳 " + window.Copy.easterEggs.august15;
        } else if (d === 26 && m === 1) {
            msg = "📜 " + window.Copy.easterEggs.january26;
        } else if (d === 6 && m === 4 && y === 1930) {
            msg = "🧂 " + window.Copy.easterEggs.april6;
        } else if (d === 2 && m === 10) {
            msg = "🕊️ " + window.Copy.easterEggs.october2;
        } else if (d === 12 && m === 3 && y === 1930) {
            msg = "🚶 " + window.Copy.easterEggs.march12;
        } else if (d === 30 && m === 1) {
            // Strictly respectful, no joke
            msg = "🕯️ " + window.Copy.easterEggs.january30;
        }

        if (msg) {
            feedbackEl.textContent = msg;
            feedbackEl.classList.remove("hidden");
        } else {
            feedbackEl.textContent = "";
            feedbackEl.classList.add("hidden");
        }
    }

    function setSelected(y, m, d, silent = false) {
        y = parseInt(y, 10);
        m = parseInt(m, 10);
        d = parseInt(d, 10);

        if (!isValidDate(y, m, d)) {
            if (!silent && window.Chaos) {
                window.Chaos.showToast("⚠️ " + window.Copy.picker.invalidDateMsg);
                window.Chaos.recordFailure();
            }
            return false;
        }

        selected = { y, m, d };
        syncUI();
        if (!silent) {
            notifyDateSelected();
        }
        return true;
    }

    function getSelected() {
        return { ...selected };
    }

    function getCharkhaSpins() {
        return charkhaSpins;
    }

    function syncUI() {
        // Sync display label
        const displayEl = document.getElementById("selected-date-display");
        const profileTitle = document.getElementById("dating-profile-title");
        const formatted = `${String(selected.d).padStart(2, "0")} ${MONTHS[selected.m - 1]} ${selected.y}`;
        if (displayEl) {
            displayEl.textContent = formatted;
        }
        if (profileTitle) {
            profileTitle.textContent = `${formatted}, Age ${Math.max(1, 2026 - selected.y)}`;
        }

        // Sync Year Slider & Label
        const yearSlider = document.getElementById("year-slider");
        const yearLabel = document.getElementById("year-val-label");
        if (yearSlider) yearSlider.value = selected.y;
        if (yearLabel) yearLabel.textContent = selected.y;

        // Sync Charkha indicator
        const charkhaMonthLabel = document.getElementById("charkha-current-month");
        if (charkhaMonthLabel) {
            charkhaMonthLabel.textContent = MONTHS[selected.m - 1];
        }

        // Sync Month Dropdown fallback
        const monthSelect = document.getElementById("month-fallback-select");
        if (monthSelect) monthSelect.value = selected.m;

        // Sync Calendar Grid
        renderCalendarGrid();

        // Sync Dandi Milestone Text
        updateDandiMilestone();
    }

    function renderCalendarGrid() {
        const gridBody = document.getElementById("calendar-grid-body");
        const monthYearHeader = document.getElementById("grid-month-year");
        if (!gridBody) return;

        gridBody.innerHTML = "";
        if (monthYearHeader) {
            monthYearHeader.textContent = `${MONTHS[selected.m - 1]} ${selected.y}`;
        }

        const firstDayIndex = new Date(selected.y, selected.m - 1, 1).getDay();
        const totalDays = daysInMonth(selected.y, selected.m);

        let tr = document.createElement("tr");
        for (let i = 0; i < firstDayIndex; i++) {
            const td = document.createElement("td");
            td.className = "empty-day";
            tr.appendChild(td);
        }

        for (let day = 1; day <= totalDays; day++) {
            if (tr.children.length === 7) {
                gridBody.appendChild(tr);
                tr = document.createElement("tr");
            }

            const td = document.createElement("td");
            td.className = "calendar-day-cell";
            td.textContent = day;
            td.tabIndex = 0;
            td.setAttribute("role", "button");
            td.setAttribute("aria-label", `${day} ${MONTHS[selected.m - 1]} ${selected.y}`);

            if (day === selected.d) {
                td.classList.add("selected-day");
            }

            td.addEventListener("click", () => {
                setSelected(selected.y, selected.m, day);
            });

            td.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(selected.y, selected.m, day);
                } else if (e.key === "ArrowRight") {
                    if (day < totalDays) setSelected(selected.y, selected.m, day + 1);
                } else if (e.key === "ArrowLeft") {
                    if (day > 1) setSelected(selected.y, selected.m, day - 1);
                }
            });

            tr.appendChild(td);
        }

        while (tr.children.length < 7) {
            const td = document.createElement("td");
            td.className = "empty-day";
            tr.appendChild(td);
        }
        gridBody.appendChild(tr);
    }

    function updateDandiMilestone() {
        const milestoneEl = document.getElementById("dandi-milestone-text");
        if (!milestoneEl) return;

        const { y, m, d } = selected;
        if (y === 1930 && m === 3 && d === 12) {
            milestoneEl.textContent = "📍 12 March 1930: 'The march has begun.'";
            milestoneEl.className = "milestone-active";
        } else if (y === 1930 && m === 4 && d === 6) {
            milestoneEl.textContent = "📍 6 April 1930: 'The salt law has been challenged.'";
            milestoneEl.className = "milestone-active";
        } else if (y === 1947 && m === 8 && d === 15) {
            milestoneEl.textContent = "🌟 15 August 1947: 'TRYST WITH DESTINY™ CONFIRMED.'";
            milestoneEl.className = "milestone-active special";
        } else {
            milestoneEl.textContent = `Pace: Day ${d} of ${MONTHS[m - 1]}, Year ${y}. (Keep marching!)`;
            milestoneEl.className = "milestone-normal";
        }
    }

    // Dandi March Day Selector: Advances by exactly 1 day
    function advanceDandiDay() {
        let nextD = selected.d + 1;
        let nextM = selected.m;
        let nextY = selected.y;

        const maxD = daysInMonth(nextY, nextM);
        if (nextD > maxD) {
            nextD = 1;
            nextM += 1;
            if (nextM > 12) {
                nextM = 1;
                nextY += 1;
            }
        }

        setSelected(nextY, nextM, nextD);
    }

    // Charkha Interactive Wheel
    function spinCharkha(forceMonth = null) {
        charkhaSpins++;
        const wheelSvg = document.getElementById("charkha-wheel-svg");
        const countEl = document.getElementById("charkha-spin-counter");

        // Calculate spin
        let targetMonth = forceMonth;
        if (targetMonth === null) {
            targetMonth = Math.floor(Math.random() * 12) + 1;
        }

        // Add 3-5 full rotations + angle to land on targetMonth
        const monthAngle = ((targetMonth - 1) * 30);
        charkhaRotation += 720 + Math.floor(Math.random() * 360) + monthAngle;

        if (wheelSvg) {
            wheelSvg.style.transition = "transform 1.8s cubic-bezier(0.2, 0.8, 0.3, 1)";
            wheelSvg.style.transform = `rotate(${charkhaRotation}deg)`;
        }

        setTimeout(() => {
            const maxDays = daysInMonth(selected.y, targetMonth);
            const clampedDay = Math.min(selected.d, maxDays);
            setSelected(selected.y, targetMonth, clampedDay);

            if (countEl) {
                countEl.textContent = window.Copy.picker.charkhaCounter.replace("{count}", charkhaSpins);
            }
        }, 1800);
    }

    // Expiry timer
    function startExpiryTimer() {
        expiryTime = 24;
        const timerEl = document.getElementById("expiry-countdown");
        if (expiryInterval) clearInterval(expiryInterval);

        expiryInterval = setInterval(() => {
            expiryTime--;
            if (timerEl) {
                timerEl.textContent = `${expiryTime}s`;
            }
            if (expiryTime <= 0) {
                clearInterval(expiryInterval);
                if (window.Chaos) {
                    window.Chaos.showToast("⏰ " + window.Copy.picker.expiryWarning, 5000);
                }
            }
        }, 1000);
    }

    function renewCharter() {
        startExpiryTimer();
        if (window.Chaos) {
            window.Chaos.showToast("📜 Charter renewed for another 24 seconds of chronological grace!");
        }
    }

    // Mount and initialize the picker inside element
    function mount(element) {
        mountRoot = element;
        if (!mountRoot) return;

        mountRoot.innerHTML = `
            <div class="picker-container">
                <div class="dating-badge-strip">
                    <span class="badge-tag">🔥 99.4% BUREAUCRATIC COMPATIBILITY</span>
                    <span class="badge-expiry">⏳ Expires in <strong id="expiry-countdown">24s</strong></span>
                    <button type="button" id="renew-charter-btn" class="mini-btn">${window.Copy.picker.expiryRenewBtn}</button>
                </div>

                <!-- Tinder/Hinge Dating Match Card -->
                <div class="dating-profile-card">
                    <div class="profile-header-strip">
                        <span class="verified-pill">✓ VERIFIED BY VICEROY</span>
                        <span class="compatibility-pill">🔥 99.8% PATRIOTIC MATCH</span>
                    </div>
                    <div class="profile-body-row">
                        <div class="profile-avatar">🇮🇳</div>
                        <div class="profile-details">
                            <h2 id="dating-profile-title" class="profile-name">15 August 1947, Age 79</h2>
                            <p class="profile-location">📍 New Delhi, Independent India • 390 km away</p>
                            <p class="profile-bio">"Passionate about non-violent civil disobedience, handspun khadi, and breaking colonial salt laws. Seeking a partner with extreme patience for tripartite committee deliberations."</p>
                        </div>
                    </div>
                    <div class="dating-swipe-controls">
                        <button type="button" id="swipe-left-btn" class="swipe-btn swipe-left" title="Pass / Next Date">❌ Swipe Left (Next Date)</button>
                        <button type="button" id="swipe-superlike-btn" class="swipe-btn swipe-super" title="Super Like">⭐ Super Like</button>
                        <button type="button" id="swipe-right-btn" class="swipe-btn swipe-right" title="It's a Match! Confirm Date">💚 Swipe Right (It's a Match!)</button>
                    </div>
                </div>

                <div class="selected-hero-box">
                    <span class="hero-label">YOUR APPOINTED DATE</span>
                    <div id="selected-date-display" class="hero-date">15 August 1947</div>
                    <div id="date-easter-egg-banner" class="easter-egg-tag hidden"></div>
                    <div id="like-count-text" class="like-counter">${window.Copy.picker.likeLimitMsg}</div>
                </div>

                <!-- Charkha Wheel Section -->
                <div class="charkha-section">
                    <div class="section-title">
                        <span class="stamp-icon">⚙️</span>
                        <h3>THE CHARKHA MONTH SELECTOR</h3>
                    </div>
                    <p class="section-desc">${window.Copy.picker.charkhaPrompt}</p>

                    <div class="charkha-stage">
                        <div class="charkha-pointer">▼</div>
                        <div class="charkha-wrapper" id="charkha-click-zone" role="button" tabindex="0" title="Click to spin the Charkha">
                            <!-- SVG Charkha Wheel -->
                            <svg id="charkha-wheel-svg" class="charkha-svg" viewBox="0 0 300 300">
                                <circle cx="150" cy="150" r="140" class="charkha-rim" />
                                <circle cx="150" cy="150" r="130" class="charkha-inner-rim" />
                                <!-- 12 Spokes and Month Labels -->
                                <g id="charkha-spokes">
                                    ${MONTHS.map((m, idx) => {
                                        const angle = idx * 30;
                                        const rad = (angle * Math.PI) / 180;
                                        const x2 = 150 + 130 * Math.sin(rad);
                                        const y2 = 150 - 130 * Math.cos(rad);
                                        const tx = 150 + 105 * Math.sin(rad);
                                        const ty = 150 - 105 * Math.cos(rad);
                                        return `
                                            <line x1="150" y1="150" x2="${x2}" y2="${y2}" class="charkha-spoke" />
                                            <text x="${tx}" y="${ty}" class="charkha-month-text" transform="rotate(${angle}, ${tx}, ${ty})">${m.substring(0, 3)}</text>
                                        `;
                                    }).join("")}
                                </g>
                                <!-- Central Hub and Spindle -->
                                <circle cx="150" cy="150" r="28" class="charkha-hub" />
                                <circle cx="150" cy="150" r="12" class="charkha-axle" />
                                <line x1="150" y1="150" x2="190" y2="130" class="charkha-crank" />
                                <circle cx="190" cy="130" r="6" class="charkha-crank-handle" />
                            </svg>
                        </div>
                    </div>

                    <div class="charkha-controls">
                        <button type="button" id="charkha-spin-btn" class="bureau-btn spin-btn">🌀 SPIN SACRED CHARKHA</button>
                        <div class="month-nav-row">
                            <button type="button" id="charkha-prev-month" class="bureau-btn mini-btn">← Prev Month</button>
                            <span id="charkha-current-month" class="month-indicator">August</span>
                            <button type="button" id="charkha-next-month" class="bureau-btn mini-btn">Next Month →</button>
                        </div>
                        <div id="charkha-spin-counter" class="sub-notice">Spun 0 times. A weaver would have finished by now.</div>
                    </div>

                    <div class="fallback-row">
                        <label for="month-fallback-select">${window.Copy.picker.charkhaFallback}</label>
                        <select id="month-fallback-select" class="bureau-select">
                            ${MONTHS.map((m, idx) => `<option value="${idx + 1}">${idx + 1} - ${m}</option>`).join("")}
                        </select>
                    </div>
                </div>

                <!-- Year Slider Section -->
                <div class="year-section">
                    <div class="section-title">
                        <span class="stamp-icon">⏳</span>
                        <h3>CHRONOLOGICAL YEAR REGULATOR</h3>
                    </div>
                    <p class="section-desc">${window.Copy.picker.yearPrompt}</p>
                    <div class="year-slider-row">
                        <span class="year-limit">1857</span>
                        <input type="range" id="year-slider" min="1857" max="2100" value="1947" step="1" class="bureau-slider" />
                        <span class="year-limit">2100</span>
                    </div>
                    <div class="year-display-badge">Year: <strong id="year-val-label">1947</strong></div>
                </div>

                <!-- Dandi March Day Selector Section -->
                <div class="dandi-section">
                    <div class="section-title">
                        <span class="stamp-icon">🚶</span>
                        <h3>DANDI MARCH DAY SELECTOR</h3>
                    </div>
                    <p class="section-desc">${window.Copy.picker.dandiPrompt}</p>
                    <button type="button" id="dandi-march-btn" class="dandi-giant-btn">${window.Copy.picker.dandiBtn}</button>
                    <div id="dandi-milestone-text" class="milestone-text">Pace: 390 km of paperwork ahead.</div>
                </div>

                <!-- Calendar Grid Section -->
                <div class="grid-section">
                    <div class="section-title">
                        <span class="stamp-icon">📅</span>
                        <h3>OFFICIAL CALENDAR RATIFICATION GRID</h3>
                    </div>
                    <div class="grid-header-nav">
                        <button type="button" id="grid-prev-btn" class="mini-btn">◀ Previous</button>
                        <span id="grid-month-year" class="grid-title">August 1947</span>
                        <button type="button" id="grid-next-btn" class="mini-btn">Next ▶</button>
                    </div>
                    <table class="bureau-calendar-table">
                        <thead>
                            <tr>
                                ${window.Copy.picker.weekdays.map(w => `<th>${w}</th>`).join("")}
                            </tr>
                        </thead>
                        <tbody id="calendar-grid-body"></tbody>
                    </table>
                </div>

                <!-- Manual Date Entry (Sarcastic Bureaucracy) -->
                <div class="manual-entry-section">
                    <label for="manual-date-input">${window.Copy.picker.manualInputPrompt}</label>
                    <div class="manual-input-row">
                        <input type="text" id="manual-date-input" placeholder="YYYY-MM-DD" class="bureau-input" />
                        <button type="button" id="manual-date-submit" class="bureau-btn mini-btn">Apply By Force</button>
                    </div>
                </div>

                <!-- Dating Parody Prompt (Hinge-Style) -->
                <div class="dating-prompt-card">
                    <label for="hinge-answer-input"><strong>💬 Hinge Prompt:</strong> ${window.Copy.picker.hingePrompt}</label>
                    <input type="text" id="hinge-answer-input" placeholder="${window.Copy.picker.hingePlaceholder}" class="bureau-input" />
                    <small id="hinge-feedback" class="prompt-hint">Requirements: Must contain at least 3 patriotic or romantic words.</small>
                </div>

                <!-- Dating Action Buttons -->
                <div class="dating-actions-row">
                    <button type="button" id="super-like-btn" class="bureau-btn super-like-btn">${window.Copy.picker.superLikeBtn}</button>
                    <button type="button" id="proceed-roundtable-btn" class="bureau-btn primary-btn">PROCEED TO ROUND TABLE CONFERENCE →</button>
                </div>
            </div>
        `;

        // Wire event listeners
        bindEvents();
        syncUI();
        startExpiryTimer();
    }

    function bindEvents() {
        // Charkha wheel click and spin button
        const wheelZone = document.getElementById("charkha-click-zone");
        const spinBtn = document.getElementById("charkha-spin-btn");
        if (wheelZone) {
            wheelZone.addEventListener("click", () => spinCharkha());
            wheelZone.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    spinCharkha();
                }
            });
        }
        if (spinBtn) spinBtn.addEventListener("click", () => spinCharkha());

        // Month previous/next
        const prevMonthBtn = document.getElementById("charkha-prev-month");
        const nextMonthBtn = document.getElementById("charkha-next-month");
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener("click", () => {
                let m = selected.m - 1;
                let y = selected.y;
                if (m < 1) { m = 12; y--; }
                const maxD = daysInMonth(y, m);
                setSelected(y, m, Math.min(selected.d, maxD));
            });
        }
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener("click", () => {
                let m = selected.m + 1;
                let y = selected.y;
                if (m > 12) { m = 1; y++; }
                const maxD = daysInMonth(y, m);
                setSelected(y, m, Math.min(selected.d, maxD));
            });
        }

        // Fallback dropdown
        const monthSelect = document.getElementById("month-fallback-select");
        if (monthSelect) {
            monthSelect.addEventListener("change", (e) => {
                const targetM = parseInt(e.target.value, 10);
                const maxD = daysInMonth(selected.y, targetM);
                setSelected(selected.y, targetM, Math.min(selected.d, maxD));
            });
        }

        // Year Slider
        const yearSlider = document.getElementById("year-slider");
        if (yearSlider) {
            yearSlider.addEventListener("input", (e) => {
                const targetY = parseInt(e.target.value, 10);
                const maxD = daysInMonth(targetY, selected.m);
                setSelected(targetY, selected.m, Math.min(selected.d, maxD));
            });
        }

        // Dandi March Day Button
        const dandiBtn = document.getElementById("dandi-march-btn");
        if (dandiBtn) {
            dandiBtn.addEventListener("click", advanceDandiDay);
        }

        // Calendar Grid Prev/Next
        const gridPrev = document.getElementById("grid-prev-btn");
        const gridNext = document.getElementById("grid-next-btn");
        if (gridPrev) {
            gridPrev.addEventListener("click", () => {
                let m = selected.m - 1;
                let y = selected.y;
                if (m < 1) { m = 12; y--; }
                const maxD = daysInMonth(y, m);
                setSelected(y, m, Math.min(selected.d, maxD));
            });
        }
        if (gridNext) {
            gridNext.addEventListener("click", () => {
                let m = selected.m + 1;
                let y = selected.y;
                if (m > 12) { m = 1; y++; }
                const maxD = daysInMonth(y, m);
                setSelected(y, m, Math.min(selected.d, maxD));
            });
        }

        // Manual date input
        const manualBtn = document.getElementById("manual-date-submit");
        const manualInput = document.getElementById("manual-date-input");
        if (manualBtn && manualInput) {
            manualBtn.addEventListener("click", () => {
                const parts = manualInput.value.trim().split(/[-/.]/);
                if (parts.length === 3) {
                    const y = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10);
                    const d = parseInt(parts[2], 10);
                    if (setSelected(y, m, d)) {
                        if (window.Chaos) {
                            window.Chaos.showToast("🧐 " + window.Copy.picker.manualInputSarcasm, 4500);
                        }
                    }
                } else {
                    if (window.Chaos) {
                        window.Chaos.showToast("⚠️ " + window.Copy.picker.invalidDateMsg);
                        window.Chaos.recordFailure();
                    }
                }
            });
        }

        // Dating Swipe Controls
        const swipeLeft = document.getElementById("swipe-left-btn");
        const swipeRight = document.getElementById("swipe-right-btn");
        const swipeSuper = document.getElementById("swipe-superlike-btn");

        if (swipeLeft) {
            swipeLeft.addEventListener("click", () => {
                advanceDandiDay();
                if (window.Chaos) {
                    window.Chaos.showToast("💨 Passed on date! Summoning next chronological candidate...", 2000);
                }
            });
        }

        if (swipeRight) {
            swipeRight.addEventListener("click", () => {
                if (window.Chaos) {
                    window.Chaos.showToast("💚 IT'S A MATCH! Submitting file to the Round Table...", 2500);
                }
                if (window.Flow) {
                    window.Flow.setStage(4);
                }
            });
        }

        if (swipeSuper) {
            swipeSuper.addEventListener("click", () => {
                if (window.Chaos) {
                    window.Chaos.showToast("⭐ Super Like delivered with a ceremonial pinch of salt!", 3000);
                }
            });
        }

        // Super Like Button
        const superLikeBtn = document.getElementById("super-like-btn");
        if (superLikeBtn) {
            superLikeBtn.addEventListener("click", () => {
                if (window.Chaos) {
                    window.Chaos.showToast("⭐ Super Like submitted! The Viceroy has scheduled a tax assessment.");
                }
            });
        }

        // Renew Charter
        const renewBtn = document.getElementById("renew-charter-btn");
        if (renewBtn) {
            renewBtn.addEventListener("click", renewCharter);
        }
    }

    return {
        mount,
        getSelected,
        setSelected,
        getCharkhaSpins
    };
})();
