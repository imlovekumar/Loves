document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DATABASE
    ===================================================== */

    const stationList =
        stationsData[0] || [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const toggle =
        document.getElementById("brdStnToggle");

    const boardingInput =
        document.getElementById("brdStn");

    const boardingDisplay =
        document.getElementById("brdStnDisplay");

    const sourceInput =
        document.getElementById("source");

    const sourceDisplay =
        document.getElementById("fromDisplay");


    if (
        !toggle ||
        !boardingInput ||
        !boardingDisplay ||
        !sourceInput ||
        !sourceDisplay
    ) {

        console.error(
            "Boarding autocomplete: required elements not found."
        );

        return;
    }


    /* =====================================================
       STATE
    ===================================================== */

    let currentTrainRoute = [];

    let currentResults = [];

    let currentIndex = -1;


    /* =====================================================
       FIND STATION
    ===================================================== */

    function findStation(value) {

        if (!value) return null;

        const search =
            String(value)
                .trim()
                .toUpperCase();


        return stationList.find(station => {

            const code =
                String(station.code || "")
                    .trim()
                    .toUpperCase();

            const name =
                String(station.name || "")
                    .trim()
                    .toUpperCase();


            return (
                code === search ||
                name === search
            );

        }) || null;

    }


    /* =====================================================
       LOAD CURRENT TRAIN ROUTE
    ===================================================== */

    function loadCurrentTrainRoute() {

        const trainNumberInput =
            document.getElementById("trainNumber");


        if (!trainNumberInput) {

            currentTrainRoute = [];

            return;

        }


        const trainNumber =
            trainNumberInput.value.trim();


        if (
            !trainNumber ||
            !trainRoutes[trainNumber]
        ) {

            currentTrainRoute = [];

            return;

        }


        const route =
            trainRoutes[trainNumber];


        if (
            !route ||
            !Array.isArray(route.stations)
        ) {

            currentTrainRoute = [];

            return;

        }


        currentTrainRoute =
            [...route.stations].sort(
                (a, b) =>
                    Number(a.seq) -
                    Number(b.seq)
            );

    }


    /* =====================================================
       CHECK STATION IN TRAIN ROUTE
    ===================================================== */

    function isStationInRoute(station) {

        if (
            !station ||
            !currentTrainRoute.length
        ) {

            return false;

        }


        const code =
            String(station.code || "")
                .trim()
                .toUpperCase();


        return currentTrainRoute.some(
            routeStation =>
                String(routeStation.code || "")
                    .trim()
                    .toUpperCase() === code
        );

    }


    /* =====================================================
       GET TRAIN NUMBER
    ===================================================== */

    function getTrainNumber() {

        const trainInput =
            document.getElementById(
                "trainNumber"
            );


        return trainInput
            ? trainInput.value.trim()
            : "";

    }


    /* =====================================================
       UPDATE BOARDING DISPLAY
    ===================================================== */

    function updateBoardingDisplay(
        station,
        warning = false
    ) {

        if (!station) {

            boardingDisplay.textContent = "";

            boardingDisplay.classList.remove(
                "station-valid"
            );

            return;

        }


        boardingDisplay.innerHTML = "";


        const nameSpan =
            document.createElement("span");


        nameSpan.textContent =
            station.name;


        boardingDisplay.appendChild(
            nameSpan
        );


        if (warning) {

            const warningSpan =
                document.createElement("span");


            warningSpan.className =
                "station-display-warning";


            warningSpan.textContent =
                " ⚠";


            warningSpan.title =
                "Not available in selected train";


            boardingDisplay.appendChild(
                warningSpan
            );

        }


        boardingDisplay.classList.add(
            "station-valid"
        );

    }


    /* =====================================================
       CLEAR BOARDING
    ===================================================== */

    function clearBoarding() {

        boardingInput.value = "";

        boardingDisplay.innerHTML = "";

        boardingDisplay.classList.remove(
            "station-valid"
        );

        currentResults = [];

        currentIndex = -1;

        hideSuggestions();

    }


    /* =====================================================
       COPY FROM → BOARDING
       ===================================================== */

    function copyFromToBoarding() {

        boardingInput.value =
            sourceInput.value;


        /*
         * Copy display including warning icon
         */

        boardingDisplay.innerHTML =
            sourceDisplay.innerHTML;


        if (
            sourceDisplay.textContent.trim()
        ) {

            boardingDisplay.classList.add(
                "station-valid"
            );

        } else {

            boardingDisplay.classList.remove(
                "station-valid"
            );

        }

    }


    /* =====================================================
       SET BOARDING STATION
       ===================================================== */

    function setBoardingStation(station) {

        if (!station) {

            clearBoarding();

            return;

        }


        boardingInput.value =
            station.code;


        const unavailable =
            getTrainNumber() &&
            currentTrainRoute.length &&
            !isStationInRoute(station);


        updateBoardingDisplay(
            station,
            unavailable
        );

    }


    /* =====================================================
       SUGGESTION BOX
    ===================================================== */

    const suggestionBox =
        document.createElement("div");


    suggestionBox.id =
        "boardingSuggestions";


    suggestionBox.className =
        "station-suggestions";


    boardingInput.parentElement.style.position =
        "relative";


    boardingInput.parentElement.appendChild(
        suggestionBox
    );


    /* =====================================================
       HIDE
    ===================================================== */

    function hideSuggestions() {

        suggestionBox.style.display =
            "none";

        suggestionBox.innerHTML = "";

        currentResults = [];

        currentIndex = -1;

    }


    /* =====================================================
       HIGHLIGHT
    ===================================================== */

    function updateHighlight() {

        const items =
            suggestionBox.querySelectorAll(
                ".station-suggestion"
            );


        items.forEach(
            (item, index) => {

                item.classList.toggle(
                    "station-highlight",
                    index === currentIndex
                );

            }
        );


        if (
            currentIndex >= 0 &&
            items[currentIndex]
        ) {

            items[currentIndex].scrollIntoView({
                block: "nearest"
            });

        }

    }


    /* =====================================================
       CREATE SUGGESTION
    ===================================================== */

    function createSuggestion(
        station,
        unavailable = false
    ) {

        const item =
            document.createElement("div");


        item.className =
            "station-suggestion";


        let warning = "";


        if (unavailable) {

            warning = `
                <span class="station-warning">
                    ⚠ NOT AVAILABLE IN
                    ${getTrainNumber()}
                </span>
            `;

        }


        item.innerHTML = `
            <span class="station-code">
                ${station.code}
            </span>

            <span class="station-name">
                ${station.name}
            </span>

            ${warning}
        `;


        item.addEventListener(
            "mousedown",
            function (event) {

                event.preventDefault();

                setBoardingStation(
                    station
                );

                hideSuggestions();

            }
        );


        suggestionBox.appendChild(
            item
        );

    }


    /* =====================================================
       SHOW TRAIN ROUTE
    ===================================================== */

    function showTrainRoute() {

        loadCurrentTrainRoute();


        suggestionBox.innerHTML = "";

        currentResults = [];

        currentIndex = -1;


        if (!currentTrainRoute.length) {

            hideSuggestions();

            return;

        }


        currentTrainRoute.forEach(
            routeStation => {

                const station = {

                    code:
                        routeStation.code,

                    name:
                        routeStation.name

                };


                currentResults.push(
                    station
                );


                createSuggestion(
                    station,
                    false
                );

            }
        );


        if (!currentResults.length) {

            hideSuggestions();

            return;

        }


        suggestionBox.style.display =
            "block";


        updateHighlight();

    }


    /* =====================================================
       SEARCH STATIONS
    ===================================================== */

    function searchStations(value) {

        loadCurrentTrainRoute();


        suggestionBox.innerHTML = "";

        currentResults = [];

        currentIndex = -1;


        const search =
            String(value || "")
                .trim()
                .toUpperCase();


        if (!search) {

            showTrainRoute();

            return;

        }


        /* =================================================
           ROUTE RESULTS
           ================================================= */

        const routeResults =
            currentTrainRoute.filter(
                station => {

                    const code =
                        String(station.code || "")
                            .trim()
                            .toUpperCase();


                    const name =
                        String(station.name || "")
                            .trim()
                            .toUpperCase();


                    return (
                        code.includes(search) ||
                        name.includes(search)
                    );

                }
            );


        /* =================================================
           MASTER DATABASE RESULTS
           ================================================= */

        let masterResults =
            stationList.filter(
                station => {

                    const code =
                        String(station.code || "")
                            .trim()
                            .toUpperCase();


                    const name =
                        String(station.name || "")
                            .trim()
                            .toUpperCase();


                    return (
                        code.includes(search) ||
                        name.includes(search)
                    );

                }
            );


        /* =================================================
           EXACT CODE FIRST
           ================================================= */

        masterResults.sort(
            (a, b) => {

                const aCode =
                    String(a.code || "")
                        .trim()
                        .toUpperCase();


                const bCode =
                    String(b.code || "")
                        .trim()
                        .toUpperCase();


                const aExact =
                    aCode === search;

                const bExact =
                    bCode === search;


                if (
                    aExact &&
                    !bExact
                ) {
                    return -1;
                }


                if (
                    !aExact &&
                    bExact
                ) {
                    return 1;
                }


                return 0;

            }
        );


        const addedCodes =
            new Set();


        /* =================================================
           ROUTE RESULTS FIRST
           ================================================= */

        routeResults.forEach(
            routeStation => {

                const code =
                    String(routeStation.code || "")
                        .trim()
                        .toUpperCase();


                if (
                    !code ||
                    addedCodes.has(code)
                ) {
                    return;
                }


                addedCodes.add(code);


                const station = {

                    code:
                        routeStation.code,

                    name:
                        routeStation.name

                };


                currentResults.push(
                    station
                );


                createSuggestion(
                    station,
                    false
                );

            }
        );


        /* =================================================
           MASTER RESULTS

           Stations outside route get warning
           ================================================= */

        masterResults.forEach(
            station => {

                const code =
                    String(station.code || "")
                        .trim()
                        .toUpperCase();


                if (
                    !code ||
                    addedCodes.has(code)
                ) {
                    return;
                }


                addedCodes.add(code);


                currentResults.push(
                    station
                );


                /*
                 * Since it wasn't already added from
                 * routeResults, it is unavailable.
                 */

                createSuggestion(
                    station,
                    true
                );

            }
        );


        /* =================================================
           LIMIT
           ================================================= */

        const maxResults = 20;


        if (
            currentResults.length >
            maxResults
        ) {

            currentResults =
                currentResults.slice(
                    0,
                    maxResults
                );


            const items =
                suggestionBox.querySelectorAll(
                    ".station-suggestion"
                );


            items.forEach(
                (item, index) => {

                    if (
                        index >= maxResults
                    ) {

                        item.remove();

                    }

                }
            );

        }


        if (!currentResults.length) {

            hideSuggestions();

            return;

        }


        suggestionBox.style.display =
            "block";


        updateHighlight();

    }


    /* =====================================================
       BOARDING INPUT
    ===================================================== */

    boardingInput.addEventListener(
        "input",
        function () {

            /*
             * Only letters
             */

            this.value =
                this.value
                    .replace(
                        /[^A-Za-z]/g,
                        ""
                    )
                    .toUpperCase();


            const value =
                this.value.trim();


            const station =
                findStation(value);


            if (station) {

                const unavailable =
                    getTrainNumber() &&
                    currentTrainRoute.length &&
                    !isStationInRoute(
                        station
                    );


                updateBoardingDisplay(
                    station,
                    unavailable
                );

            } else {

                updateBoardingDisplay(
                    null
                );

            }


            searchStations(
                value
            );

        }
    );


    /* =====================================================
       FOCUS
    ===================================================== */

    boardingInput.addEventListener(
        "focus",
        function () {

            /*
             * If empty → show complete route.
             */

            if (!this.value.trim()) {

                showTrainRoute();

            } else {

                searchStations(
                    this.value
                );

            }

        }
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    boardingInput.addEventListener(
        "keydown",
        function (event) {

            if (!currentResults.length) {
                return;
            }


            if (
                event.key === "ArrowDown"
            ) {

                event.preventDefault();

                currentIndex++;


                if (
                    currentIndex >=
                    currentResults.length
                ) {

                    currentIndex = 0;

                }


                updateHighlight();

            }


            else if (
                event.key === "ArrowUp"
            ) {

                event.preventDefault();

                currentIndex--;


                if (
                    currentIndex < 0
                ) {

                    currentIndex =
                        currentResults.length - 1;

                }


                updateHighlight();

            }


            else if (
                event.key === "Enter"
            ) {

                if (
                    currentIndex >= 0 &&
                    currentResults[
                        currentIndex
                    ]
                ) {

                    event.preventDefault();


                    setBoardingStation(
                        currentResults[
                            currentIndex
                        ]
                    );


                    hideSuggestions();

                }

            }


            else if (
                event.key === "Tab"
            ) {

                if (
                    currentIndex >= 0 &&
                    currentResults[
                        currentIndex
                    ]
                ) {

                    setBoardingStation(
                        currentResults[
                            currentIndex
                        ]
                    );

                }


                hideSuggestions();

            }

        }
    );


    /* =====================================================
       TOGGLE
    ===================================================== */

    toggle.addEventListener(
        "change",
        function () {

            /* =========================================
               ON
               ========================================= */

            if (this.checked) {

                /*
                 * Clear Boarding first
                 */

                clearBoarding();


                /*
                 * Load train route
                 */

                loadCurrentTrainRoute();


                /*
                 * Show route
                 */

                showTrainRoute();

            }


            /* =========================================
               OFF
               ========================================= */

            else {

                /*
                 * Copy Source immediately
                 */

                copyFromToBoarding();


                hideSuggestions();

            }

        }
    );


    /* =====================================================
       SOURCE SYNC WHILE BOARDING IS OFF
       ===================================================== */

    sourceInput.addEventListener(
        "input",
        function () {

            /*
             * When Boarding is OFF,
             * it follows Source.
             */

            if (!toggle.checked) {

                copyFromToBoarding();

            }

        }
    );


    /* =====================================================
       TRAIN NUMBER CHANGE
       ===================================================== */

    const trainNumber =
        document.getElementById(
            "trainNumber"
        );


    if (trainNumber) {

        trainNumber.addEventListener(
            "input",
            function () {

                loadCurrentTrainRoute();


                /*
                 * Boarding ON:
                 * clear independent value.
                 */

                if (toggle.checked) {

                    clearBoarding();

                }


                /*
                 * Boarding OFF:
                 * continue following Source.
                 */

                else {

                    copyFromToBoarding();

                }

            }
        );

    }


    /* =====================================================
       CLICK OUTSIDE
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !boardingInput.contains(
                    event.target
                ) &&
                !suggestionBox.contains(
                    event.target
                )
            ) {

                hideSuggestions();

            }

        }
    );


    console.log(
        "Boarding autocomplete loaded."
    );

});