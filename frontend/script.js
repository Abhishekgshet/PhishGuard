// ===============================
// BACKEND URL
// ===============================

const API_URL =
    "https://phishguard-api-ebt8.onrender.com";


// ===============================
// DASHBOARD ELEMENTS
// ===============================

const totalScans =
    document.getElementById("totalScans");

const lowRisk =
    document.getElementById("lowRisk");

const suspicious =
    document.getElementById("suspicious");

const highRisk =
    document.getElementById("highRisk");

const refreshDashboardBtn =
    document.getElementById("refreshDashboardBtn");


// ===============================
// SEARCH ELEMENTS
// ===============================

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const searchBtn =
    document.getElementById("searchBtn");


// ===============================
// ANALYZER ELEMENTS
// ===============================

const urlInput =
    document.getElementById("urlInput");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const result =
    document.getElementById("result");

const error =
    document.getElementById("error");

const status =
    document.getElementById("status");

const score =
    document.getElementById("score");

const analyzedUrl =
    document.getElementById("analyzedUrl");

const warningList =
    document.getElementById("warningList");

const riskBar =
    document.getElementById("riskBar");


// ===============================
// HISTORY ELEMENTS
// ===============================

const historyList =
    document.getElementById("historyList");

const refreshBtn =
    document.getElementById("refreshBtn");


// ===============================
// BUTTON EVENTS
// ===============================

analyzeBtn.addEventListener(
    "click",
    analyzeUrl
);

refreshBtn.addEventListener(
    "click",
    loadHistory
);

searchBtn.addEventListener(
    "click",
    searchHistory
);

refreshDashboardBtn.addEventListener(
    "click",
    refreshDashboard
);


// ===============================
// ANALYZE URL
// ===============================

async function analyzeUrl() {

    const url = urlInput.value.trim();

    error.textContent = "";

    if (url === "") {

        error.textContent =
            "Please enter a URL.";

        return;
    }

    analyzeBtn.textContent =
        "Analyzing...";

    analyzeBtn.disabled = true;

    try {

        const response = await fetch(
            `${API_URL}/analyze`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "ANALYSIS RESPONSE:",
            data
        );


        // ===============================
        // SHOW RESULT
        // ===============================

        result.classList.remove("hidden");


        // ===============================
        // URL
        // ===============================

        analyzedUrl.textContent =
            data.url;


        // ===============================
        // SCORE
        // ===============================

        const riskScore =
            data.analysis.risk_score;

        score.textContent =
            riskScore;


        // ===============================
        // RISK BAR
        // ===============================

        riskBar.style.width =
            riskScore + "%";


        // ===============================
        // STATUS
        // ===============================

        status.textContent =
            data.analysis.status;


        status.className = "";


        if (
            data.analysis.status === "Low Risk"
        ) {

            status.classList.add(
                "low-risk"
            );

        }

        else if (
            data.analysis.status === "Suspicious"
        ) {

            status.classList.add(
                "suspicious"
            );

        }

        else if (
            data.analysis.status === "High Risk"
        ) {

            status.classList.add(
                "high-risk"
            );
        }


        // ===============================
        // WARNINGS
        // ===============================

        warningList.innerHTML = "";


        if (
            data.analysis.warnings.length === 0
        ) {

            const li =
                document.createElement("li");


            li.textContent =
                "No suspicious indicators detected.";


            warningList.appendChild(li);

        }

        else {

            for (
                let warning of data.analysis.warnings
            ) {

                const li =
                    document.createElement("li");


                li.textContent =
                    "⚠ " + warning;


                warningList.appendChild(li);
            }
        }


        // ===============================
        // UPDATE HISTORY
        // ===============================

        await loadHistory();


        // ===============================
        // UPDATE DASHBOARD
        // ===============================

        await loadStats();


        console.log(
            "RESULT CLASS:",
            result.className
        );

    }


    catch (err) {

        console.log(
            "ANALYZE ERROR:",
            err
        );


        error.textContent =
            "Unable to connect to the server.";

    }


    finally {

        analyzeBtn.textContent =
            "Analyze URL";

        analyzeBtn.disabled = false;
    }
}


// ===============================
// LOAD HISTORY
// ===============================

async function loadHistory() {

    try {

        const response =
            await fetch(
                `${API_URL}/history`
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        const data =
            await response.json();


        historyList.innerHTML = "";


        if (
            data.scans.length === 0
        ) {

            historyList.innerHTML =
                '<div class="history-empty">No scans yet.</div>';

            return;
        }


        for (
            let scan of data.scans
        ) {

            const row =
                document.createElement("div");


            row.className =
                "history-row";


            row.innerHTML = `

                <div class="history-url">
                    ${scan.url}
                </div>

                <div>
                    ${scan.risk_score}/100
                </div>

                <div>
                    ${scan.status}
                </div>

                <div>
                    ${scan.warnings}
                </div>

                <button
                    type="button"
                    onclick="deleteScan(${scan.id})"
                >
                    Delete
                </button>

            `;


            historyList.appendChild(row);
        }

    }

    catch (err) {

        console.log(
            "Unable to load history.",
            err
        );


        historyList.innerHTML =
            '<div class="history-empty">Unable to load history.</div>';
    }
}


// ===============================
// LOAD STATISTICS
// ===============================

async function loadStats() {

    try {

        const response =
            await fetch(
                `${API_URL}/stats`
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "Stats:",
            data
        );


        totalScans.textContent =
            data.total;


        lowRisk.textContent =
            data.low_risk;


        suspicious.textContent =
            data.suspicious;


        highRisk.textContent =
            data.high_risk;

    }

    catch (err) {

        console.log(
            "Unable to load statistics.",
            err
        );
    }
}


// ===============================
// SEARCH HISTORY
// ===============================

async function searchHistory() {

    const search =
        searchInput.value.trim();


    const selectedStatus =
        statusFilter.value;


    try {

        const response =
            await fetch(
                `${API_URL}/search?search=${encodeURIComponent(search)}&status=${encodeURIComponent(selectedStatus)}`
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        const data =
            await response.json();


        historyList.innerHTML = "";


        if (
            data.scans.length === 0
        ) {

            historyList.innerHTML =
                '<div class="history-empty">No matching scans.</div>';

            return;
        }


        for (
            let scan of data.scans
        ) {

            const row =
                document.createElement("div");


            row.className =
                "history-row";


            row.innerHTML = `

                <div class="history-url">
                    ${scan.url}
                </div>

                <div>
                    ${scan.risk_score}/100
                </div>

                <div>
                    ${scan.status}
                </div>

                <div>
                    ${scan.warnings}
                </div>

                <button
                    type="button"
                    onclick="deleteScan(${scan.id})"
                >
                    Delete
                </button>

            `;


            historyList.appendChild(row);
        }

    }

    catch (err) {

        console.log(
            "Unable to search history.",
            err
        );


        historyList.innerHTML =
            '<div class="history-empty">Unable to search history.</div>';
    }
}


// ===============================
// DELETE SCAN
// ===============================

async function deleteScan(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/scans/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        const data =
            await response.json();


        alert(data.message);


        await loadHistory();

        await loadStats();

    }

    catch (err) {

        console.log(
            "Unable to delete scan.",
            err
        );
    }
}


// ===============================
// REFRESH DASHBOARD
// ===============================

async function refreshDashboard() {

    console.log(
        "Refreshing dashboard..."
    );


    // This only refreshes data.
    // It does NOT hide the analysis result.

    await loadHistory();

    await loadStats();
}


// ===============================
// INITIAL LOAD
// ===============================

loadHistory();

loadStats();