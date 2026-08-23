document.addEventListener("DOMContentLoaded", function() {

    /* =====================================================
       DATABASES
    ===================================================== */

    const stationList = stationsData[0] || [];

    /*const trainList =
        (trainsData[0] && trainsData[0].trains) ?
        trainsData[0].trains : [];*/

    const trainList =
    Object.entries(trainRoutes || {}).map(
        ([number, route]) => ({
            number: number,
            name: route.name || ""
        })
    );

    /*
       trainRoutes comes from train_routes.js

       Example:

       const trainRoutes = {
           "10103": {
               name: "Mandovi Express",
               stations: [...]
           }
       };
    */


    /* =====================================================
       CURRENT TRAIN / ROUTE
    ===================================================== */

    let currentTrainNumber = "";

    let currentTrainRoute = [];

    let selectedFromStation = null;


    /* =====================================================
       GET TRAIN ROUTE
    ===================================================== */

    function loadTrainRoute(trainNumber) {

        currentTrainNumber =
            String(trainNumber || "").trim();

        currentTrainRoute = [];

        selectedFromStation = null;


        if (!currentTrainNumber) {
            return;
        }


        const route =
            trainRoutes[currentTrainNumber];


        if (!route || !Array.isArray(route.stations)) {

            console.log(
                "Route not found for train:",
                currentTrainNumber
            );

            return;
        }


        currentTrainRoute = [...route.stations].sort(
            (a, b) =>
            Number(a.seq) - Number(b.seq)
        );


        console.log(
            "Route loaded:",
            currentTrainNumber,
            currentTrainRoute.length,
            "stations"
        );

    }


    /* =====================================================
       FIND TRAIN
    ===================================================== */

    function findTrain(value) {

        if (!value) return null;


        const search =
            String(value)
            .trim()
            .toUpperCase();


        return trainList.find(train => {

            const number =
                String(train.number || "")
                .trim()
                .toUpperCase();


            const name =
                String(train.name || "")
                .trim()
                .toUpperCase();


            return (
                number === search ||
                name === search
            );

        }) || null;

    }


    /* =====================================================
       FIND STATION IN MASTER DATABASE
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
       FIND STATION IN CURRENT TRAIN ROUTE
    ===================================================== */

    function findRouteStation(value) {

        if (!value || !currentTrainRoute.length) {
            return null;
        }


        const search =
            String(value)
            .trim()
            .toUpperCase();


        return currentTrainRoute.find(station => {

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
       IS STATION AVAILABLE IN TRAIN ROUTE?
    ===================================================== */

    function isStationInRoute(station) {

        if (!station || !currentTrainRoute.length) {
            return false;
        }


        const code =
            String(station.code || "")
            .trim()
            .toUpperCase();


        return currentTrainRoute.some(routeStation => {

            return (
                String(routeStation.code || "")
                .trim()
                .toUpperCase() === code
            );

        });

    }


    /* =====================================================
       GET ROUTE STATION SEQUENCE
    ===================================================== */

    function getRouteSequence(station) {

        if (!station) return null;


        const code =
            String(station.code || "")
            .trim()
            .toUpperCase();


        const routeStation =
            currentTrainRoute.find(item => {

                return (
                    String(item.code || "")
                    .trim()
                    .toUpperCase() === code
                );

            });


        return routeStation ?
            Number(routeStation.seq) :
            null;

    }


    /* =====================================================
       SET TRAIN DISPLAY
    ===================================================== */

    function updateTrainDisplay(train) {

        const display =
            document.getElementById("trainDisplay");


        if (!display) return;


        if (train) {

            display.textContent =
                train.name;

            display.classList.add(
                "station-valid"
            );

        } else {

            display.textContent = "";

            display.classList.remove(
                "station-valid"
            );

        }

    }


    /* =====================================================
       TRAIN AUTOCOMPLETE
    ===================================================== */

    function setupTrainAutocomplete() {

        const input =
            document.getElementById("trainNumber");

        const display =
            document.getElementById("trainDisplay");


        if (!input || !display) {

            console.error(
                "Train autocomplete: trainNumber or trainDisplay not found."
            );

            return;

        }


        const suggestionBox =
            document.createElement("div");


        suggestionBox.id =
            "trainSuggestions";


        suggestionBox.className =
            "station-suggestions";


        input.parentElement.style.position =
            "relative";


        input.parentElement.appendChild(
            suggestionBox
        );


        let currentResults = [];

        let currentIndex = -1;


        /* =============================================
           HIDE
        ============================================= */

        function hideSuggestions() {

            suggestionBox.style.display =
                "none";

            suggestionBox.innerHTML = "";

            currentResults = [];

            currentIndex = -1;

        }


        /* =============================================
           SELECT TRAIN
        ============================================= */

        function selectTrain(train) {

            if (!train) return;


            input.value =
                train.number;


            updateTrainDisplay(train);
			updateClassIndicators();
			updateClassIndicator();


            /*
             * Load route immediately
             */

            loadTrainRoute(
                train.number
            );

            


            hideSuggestions();


            /*
             * Refresh From / To autocomplete
             */

            const source =
                document.getElementById("source");

            const destination =
                document.getElementById("destination");


            if (source && source.value.trim()) {

                source.dispatchEvent(
                    new Event("input", {
                        bubbles: true
                    })
                );

            }


            if (destination && destination.value.trim()) {

                destination.dispatchEvent(
                    new Event("input", {
                        bubbles: true
                    })
                );

            }

        }


        /* =============================================
           HIGHLIGHT
        ============================================= */

        function updateHighlight() {

            const items =
                suggestionBox.querySelectorAll(
                    ".station-suggestion"
                );


            items.forEach((item, index) => {

                item.classList.toggle(
                    "station-highlight",
                    index === currentIndex
                );

            });


            if (
                currentIndex >= 0 &&
                items[currentIndex]
            ) {

                items[currentIndex].scrollIntoView({
                    block: "nearest"
                });

            }

        }


        /* =============================================
           SEARCH TRAINS
        ============================================= */

        function searchTrains(value) {

            suggestionBox.innerHTML = "";

            currentResults = [];

            currentIndex = -1;


            const search =
                String(value || "")
                .trim()
                .toUpperCase();


            if (!search) {

                hideSuggestions();

                return;

            }


            let results =
                trainList.filter(train => {

                    const number =
                        String(train.number || "")
                        .toUpperCase();


                    const name =
                        String(train.name || "")
                        .toUpperCase();


                    return (
                        number.includes(search) ||
                        name.includes(search)
                    );

                });


            /*
             * Exact train number first
             */

            results.sort((a, b) => {

                const aExact =
                    String(a.number)
                    .toUpperCase() === search;

                const bExact =
                    String(b.number)
                    .toUpperCase() === search;


                if (aExact && !bExact) return -1;

                if (!aExact && bExact) return 1;

                return 0;

            });


            results =
                results.slice(0, 20);


            currentResults =
                results;


            if (!results.length) {

                hideSuggestions();

                return;

            }


            /* =========================================
               CREATE RESULTS
            ========================================= */

            results.forEach(train => {

                const item =
                    document.createElement("div");


                item.className =
                    "station-suggestion";


                item.innerHTML = `
                    <span class="station-code">
                        ${train.number}
                    </span>

                    <span class="station-name">
                        ${train.name}
                    </span>
                `;


                /*
                 * Mouse + touch
                 */

                item.addEventListener(
                    "mousedown",
                    function(event) {

                        event.preventDefault();

                        selectTrain(train);

                    }
                );


                suggestionBox.appendChild(
                    item
                );

            });


            suggestionBox.style.display =
                "block";


            updateHighlight();

        }

        /* =============================================
   RESET FROM / TO
   ============================================= */

function resetFromTo() {

    const sourceInput =
        document.getElementById("source");

    const sourceDisplay =
        document.getElementById("fromDisplay");

    const sourceSync =
        document.getElementById("brdStn");

    const destinationInput =
        document.getElementById("destination");

    const destinationDisplay =
        document.getElementById("toDisplay");

    const destinationSync =
        document.getElementById("destStn");


    /* FROM */

    if (sourceInput) {
        sourceInput.value = "";
    }

    if (sourceDisplay) {
        sourceDisplay.textContent = "";
        sourceDisplay.classList.remove("station-valid");
    }

    if (sourceSync) {
        sourceSync.value = "";
    }


    /* TO */

    if (destinationInput) {
        destinationInput.value = "";
    }

    if (destinationDisplay) {
        destinationDisplay.textContent = "";
        destinationDisplay.classList.remove("station-valid");
    }

    if (destinationSync) {
        destinationSync.value = "";
    }


    /* Clear remembered From station */

    selectedFromStation = null;

}


        /* =============================================
           INPUT
        ============================================= */

        input.addEventListener(
    "input",
    function () {

        /*
         * Keep numbers only
         */

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 5);


        /*
         * ANY CHANGE IN TRAIN NUMBER
         * RESETS FROM AND TO
         */

        resetFromTo();


        const value =
            this.value.trim();


        /*
         * If exactly 5 digits
         */

        if (value.length === 5) {

            const train =
                findTrain(value);


            if (train) {

                updateTrainDisplay(train);

                loadTrainRoute(
                    train.number
                );

            }

            else {

                updateTrainDisplay(null);

                currentTrainNumber = "";

                currentTrainRoute = [];

                selectedFromStation = null;

            }

        }

        else {

            updateTrainDisplay(null);

            currentTrainNumber = "";

            currentTrainRoute = [];

            selectedFromStation = null;

        }


        searchTrains(
            this.value
        );

    }
);
        /* =============================================
           FOCUS
        ============================================= */

        input.addEventListener(
            "focus",
            function() {

                if (this.value.trim()) {

                    searchTrains(
                        this.value
                    );

                }

            }
        );


        /* =============================================
           KEYBOARD
        ============================================= */

        input.addEventListener(
            "keydown",
            function(event) {

                if (!currentResults.length) {
                    return;
                }


                /* ==============================
                   DOWN
                ============================== */

                if (event.key === "ArrowDown") {

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


                /* ==============================
                   UP
                ============================== */
                else if (
                    event.key === "ArrowUp"
                ) {

                    event.preventDefault();


                    currentIndex--;

                    if (currentIndex < 0) {

                        currentIndex =
                            currentResults.length - 1;

                    }


                    updateHighlight();

                }


                /* ==============================
                   ENTER
                ============================== */
                else if (
                    event.key === "Enter"
                ) {

                    if (
                        currentIndex >= 0 &&
                        currentResults[currentIndex]
                    ) {

                        event.preventDefault();

                        selectTrain(
                            currentResults[
                                currentIndex
                            ]
                        );

                    }

                }


                /* ==============================
                   TAB
                ============================== */
                else if (
                    event.key === "Tab"
                ) {

                    if (
                        currentIndex >= 0 &&
                        currentResults[currentIndex]
                    ) {

                        selectTrain(
                            currentResults[
                                currentIndex
                            ]
                        );

                    } else {

                        hideSuggestions();

                    }

                }

            }
        );


        /* =============================================
           CLICK OUTSIDE
        ============================================= */

        document.addEventListener(
            "click",
            function(event) {

                if (
                    !input.contains(event.target) &&
                    !suggestionBox.contains(event.target)
                ) {

                    hideSuggestions();

                }

            }
        );

    }


    /* =====================================================
       STATION AUTOCOMPLETE
    ===================================================== */

    function setupStationAutocomplete(
        inputId,
        displayId,
        syncId,
        suggestionId,
        type
    ) {

        const input =
            document.getElementById(inputId);

        const display =
            document.getElementById(displayId);

        const syncInput =
            document.getElementById(syncId);


        if (!input || !display) {

            console.error(
                `Autocomplete: ${inputId} or ${displayId} not found.`
            );

            return;

        }


        const suggestionBox =
            document.createElement("div");


        suggestionBox.id =
            suggestionId;


        suggestionBox.className =
            "station-suggestions";


        input.parentElement.style.position =
            "relative";


        input.parentElement.appendChild(
            suggestionBox
        );


        let currentResults = [];

        let currentIndex = -1;

        let selectedStationWarning = "";


        /* =============================================
           HIDE
        ============================================= */

        function hideSuggestions() {

            suggestionBox.style.display =
                "none";

            suggestionBox.innerHTML = "";

            currentResults = [];

            currentIndex = -1;

        }


        /* =============================================
           UPDATE DISPLAY
        ============================================= */

        function updateDisplay() {

            const value =
                input.value.trim();


            if (!value) {

                display.textContent = "";

                display.classList.remove(
                    "station-valid"
                );

                return;

            }


            const station =
                findStation(value);


            if (!station) {

                display.textContent = "";

                display.classList.remove(
                    "station-valid"
                );

                return;

            }


            /*
             * If this is FROM and user typed
             * exact station code/name
             */

            if (type === "from") {

                if (
                    isStationInRoute(station)
                ) {

                    selectedFromStation =
                        station;

                } else {

                    selectedFromStation =
                        null;

                }

            }


            /*
             * =========================================
             * CHECK WARNING
             * =========================================
             */

            let warning = "";


            /*
             * Not available in train
             */

            if (
                currentTrainNumber &&
                currentTrainRoute.length &&
                !isStationInRoute(station)
            ) {

                warning = "not-available";

            }


            /*
             * TO before FROM
             */

            if (
                type === "to" &&
                selectedFromStation &&
                isStationInRoute(station)
            ) {

                const fromSeq =
                    getRouteSequence(
                        selectedFromStation
                    );


                const toSeq =
                    getRouteSequence(
                        station
                    );


                if (
                    fromSeq !== null &&
                    toSeq !== null &&
                    toSeq < fromSeq
                ) {

                    warning = "before-from";

                }

            }


            /*
             * =========================================
             * DISPLAY
             * =========================================
             */

            display.innerHTML = "";


            const nameSpan =
                document.createElement("span");

            nameSpan.textContent =
                station.name;


            display.appendChild(
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
                    warning === "before-from" ?
                    "Before your From station" :
                    "Not available in selected train";


                display.appendChild(
                    warningSpan
                );

            }


            display.classList.add(
                "station-valid"
            );

        }
        /* =============================================
           SELECT STATION
        ============================================= */

        function selectStation(station) {

            if (!station) return;


            input.value =
                station.code;


            if (syncInput) {

                syncInput.value =
                    station.code;

            }


            /*
             * =========================================
             * CHECK WARNING STATUS
             * =========================================
             */

            let warning = "";


            /*
             * Station not available in selected train
             */

            if (
                currentTrainNumber &&
                currentTrainRoute.length &&
                !isStationInRoute(station)
            ) {

                warning = "not-available";

            }


            /*
             * TO station is before FROM station
             */

            if (
                type === "to" &&
                selectedFromStation &&
                isStationInRoute(station)
            ) {

                const fromSeq =
                    getRouteSequence(
                        selectedFromStation
                    );


                const toSeq =
                    getRouteSequence(
                        station
                    );


                if (
                    fromSeq !== null &&
                    toSeq !== null &&
                    toSeq < fromSeq
                ) {

                    warning = "before-from";

                }

            }


            /*
             * =========================================
             * DISPLAY STATION NAME + WARNING ICON
             * =========================================
             */

            display.innerHTML = "";


            const nameSpan =
                document.createElement("span");

            nameSpan.textContent =
                station.name;


            display.appendChild(
                nameSpan
            );


            if (warning) {

                const warningSpan =
                    document.createElement("span");

                warningSpan.className =
                    "station-display-warning";

                warningSpan.textContent = "⚠";


                warningSpan.title =
                    warning === "before-from" ?
                    "Before your From station" :
                    "Not available in selected train";


                display.appendChild(
                    warningSpan
                );

            }


            display.classList.add(
                "station-valid"
            );


            /*
             * =========================================
             * REMEMBER FROM STATION
             * =========================================
             */

            if (type === "from") {

                selectedFromStation =
                    station;


                /*
                 * Refresh TO suggestions
                 */

                const toInput =
                    document.getElementById(
                        "destination"
                    );


                if (
                    toInput &&
                    toInput.value.trim()
                ) {

                    toInput.dispatchEvent(
                        new Event("input", {
                            bubbles: true
                        })
                    );

                }

            }


            hideSuggestions();

        }

        /* =============================================
           KEYBOARD HIGHLIGHT
        ============================================= */

        function updateHighlight() {

            const items =
                suggestionBox.querySelectorAll(
                    ".station-suggestion"
                );


            items.forEach((item, index) => {

                item.classList.toggle(
                    "station-highlight",
                    index === currentIndex
                );

            });


            if (
                currentIndex >= 0 &&
                items[currentIndex]
            ) {

                items[currentIndex].scrollIntoView({
                    block: "nearest"
                });

            }

        }


        /* =============================================
           CREATE STATION RESULT
        ============================================= */

        function createStationItem(
            station,
            unavailable = false,
            beforeFrom = false
        ) {

            const item =
                document.createElement("div");

            item.className =
                "station-suggestion";


            /*
             * Route warning
             */

            let warning = "";


            if (beforeFrom) {

                warning = `
            <span class="station-warning station-before-warning">
                ⚠ BEFORE YOUR FROM
            </span>
        `;

            } else if (unavailable) {

                warning = `
            <span class="station-warning">
                ⚠ NOT AVAILABLE IN
                ${currentTrainNumber}
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


            /*
             * Select even if unavailable
             */

            item.addEventListener(
                "mousedown",
                function(event) {

                    event.preventDefault();

                    selectStation(
                        station
                    );

                }
            );


            suggestionBox.appendChild(
                item
            );


            return item;

        }


        /* =============================================
           SEARCH STATIONS
        ============================================= */

        function searchStations(value) {

            suggestionBox.innerHTML = "";

            currentResults = [];

            currentIndex = -1;


            const search =
                String(value || "")
                .trim()
                .toUpperCase();


            if (!search) {

                hideSuggestions();

                return;

            }


            /*
             * ==========================================
             * MASTER DATABASE RESULTS
             * ==========================================
             */

            let masterResults =
                stationList.filter(station => {

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

                });


            /*
             * ==========================================
             * EXACT CODE FIRST
             * ==========================================
             */

            masterResults.sort((a, b) => {

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


                if (aExact && !bExact) {
                    return -1;
                }


                if (!aExact && bExact) {
                    return 1;
                }


                return 0;

            });


            /*
             * ==========================================
             * ROUTE-AWARE RESULTS
             * ==========================================
             */

            let routeResults = [];

            let unavailableResults = [];


            /*
             * If train selected
             */

            if (
                currentTrainNumber &&
                currentTrainRoute.length
            ) {

                /*
                 * Find matching stations
                 * from current route
                 */
                routeResults =
                    currentTrainRoute.filter(
                        routeStation => {

                            const code =
                                String(
                                    routeStation.code || ""
                                )
                                .trim()
                                .toUpperCase();

                            const name =
                                String(
                                    routeStation.name || ""
                                )
                                .trim()
                                .toUpperCase();


                            /*
                             * For TO:
                             *
                             * Do NOT remove stations before From.
                             *
                             * We want to show them with
                             * "BEFORE YOUR FROM STATION" warning.
                             */

                            return (
                                code.includes(search) ||
                                name.includes(search)
                            );

                        }
                    );


                /*
                 * ======================================
                 * Find master stations that are NOT
                 * in route
                 * ======================================
                 */

                unavailableResults =
                    masterResults.filter(
                        station => {

                            return !isStationInRoute(
                                station
                            );

                        }
                    );

            } else {

                /*
                 * No train selected:
                 * normal station autocomplete
                 */

                routeResults = [];

                unavailableResults =
                    masterResults;

            }


            /*
             * ==========================================
             * REMOVE DUPLICATES
             * ==========================================
             */

            const addedCodes =
                new Set();


            /*
             * ==========================================
             * ROUTE RESULTS FIRST
             * ==========================================
             */
            routeResults.forEach(routeStation => {

                const code =
                    String(
                        routeStation.code || ""
                    )
                    .trim()
                    .toUpperCase();


                if (!code) return;


                if (addedCodes.has(code)) {
                    return;
                }


                addedCodes.add(code);


                /*
                 * Convert route station to same
                 * structure as stationList
                 */

                const station = {

                    code: routeStation.code,

                    name: routeStation.name

                };


                /*
                 * Check if this station is before
                 * the selected From station.
                 */

                let beforeFrom = false;


                if (
                    type === "to" &&
                    selectedFromStation
                ) {

                    const fromSeq =
                        getRouteSequence(
                            selectedFromStation
                        );


                    const stationSeq =
                        Number(routeStation.seq);


                    if (
                        fromSeq !== null &&
                        stationSeq < fromSeq
                    ) {

                        beforeFrom = true;

                    }

                }


                currentResults.push(
                    station
                );


                createStationItem(
                    station,
                    false,
                    beforeFrom
                );

            });


            /*
             * ==========================================
             * UNAVAILABLE RESULTS
             * ==========================================
             *
             * Only show unavailable results when
             * a train is selected.
             *
             */

            if (
                currentTrainNumber &&
                currentTrainRoute.length
            ) {

                unavailableResults.forEach(station => {

                    const code =
                        String(
                            station.code || ""
                        )
                        .trim()
                        .toUpperCase();


                    if (!code) return;


                    if (addedCodes.has(code)) {
                        return;
                    }


                    addedCodes.add(code);


                    currentResults.push(
                        station
                    );


                    createStationItem(
                        station,
                        true
                    );

                });

            }


            /*
             * ==========================================
             * LIMIT RESULTS
             * ==========================================
             */

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

                /*
                 * Rebuild visible list
                 */

                const items =
                    suggestionBox.querySelectorAll(
                        ".station-suggestion"
                    );


                items.forEach((item, index) => {

                    if (
                        index >= maxResults
                    ) {

                        item.remove();

                    }

                });

            }


            if (!currentResults.length) {

                hideSuggestions();

                return;

            }


            suggestionBox.style.display =
                "block";


            updateHighlight();

        }


        /* =============================================
           INPUT EVENT
        ============================================= */

        input.addEventListener(
            "input",
            function() {

                /*
                 * Letters only
                 */

                this.value =
                    this.value
                    .replace(
                        /[^A-Za-z]/g,
                        ""
                    )
                    .toUpperCase();


                /*
                 * Sync hidden/input
                 */

                if (syncInput) {

                    syncInput.value =
                        this.value;

                }


                /*
                 * Update station display
                 */

                updateDisplay();


                /*
                 * IMPORTANT:
                 *
                 * If this is FROM and the user simply
                 * types an exact station code/name,
                 * remember that station as From.
                 */

                if (type === "from") {

                    const typedStation =
                        findStation(this.value);


                    if (
                        typedStation &&
                        isStationInRoute(typedStation)
                    ) {

                        selectedFromStation =
                            typedStation;

                    } else {

                        selectedFromStation =
                            null;

                    }

                }


                /*
                 * Search
                 */

                searchStations(
                    this.value
                );

            }
        );

        /* =============================================
           SHOW ROUTE STATIONS ON FOCUS
           ============================================= */

        function showRouteStations() {

            suggestionBox.innerHTML = "";

            currentResults = [];

            currentIndex = -1;


            /*
             * No train selected
             */

            if (
                !currentTrainNumber ||
                !currentTrainRoute.length
            ) {

                hideSuggestions();

                return;

            }


            let routeStations = [];


            /*
             * =========================================
             * FROM
             * =========================================
             *
             * Show all stations of train
             */

            if (type === "from") {

                routeStations = [...currentTrainRoute];

            }


            /*
             * =========================================
             * TO
             * =========================================
             *
             * Show only stations AFTER FROM
             */
            else if (type === "to") {

                if (selectedFromStation) {

                    const fromSeq =
                        getRouteSequence(
                            selectedFromStation
                        );


                    if (fromSeq !== null) {

                        routeStations =
                            currentTrainRoute.filter(
                                station =>
                                Number(station.seq) >
                                fromSeq
                            );

                    }

                } else {

                    /*
                     * No FROM selected yet.
                     * Show complete route.
                     */

                    routeStations = [...currentTrainRoute];

                }

            }


            /*
             * =========================================
             * CREATE SUGGESTIONS
             * =========================================
             */

            routeStations.forEach(
                routeStation => {

                    const station = {

                        code: routeStation.code,

                        name: routeStation.name

                    };


                    currentResults.push(
                        station
                    );


                    createStationItem(
                        station,
                        false
                    );

                }
            );


            /*
             * Nothing to show
             */

            if (!currentResults.length) {

                hideSuggestions();

                return;

            }


            suggestionBox.style.display =
                "block";


            updateHighlight();

        }
        /* =============================================
           FOCUS
        ============================================= */

        input.addEventListener(
            "focus",
            function() {

                const value =
                    this.value.trim();


                /*
                 * If user already typed something,
                 * use normal search
                 */

                if (value) {

                    searchStations(value);

                    return;

                }


                /*
                 * Empty FROM input
                 * Show complete train route
                 */

                if (
                    type === "from" &&
                    currentTrainNumber &&
                    currentTrainRoute.length
                ) {

                    showRouteStations();

                    return;

                }


                /*
                 * Empty TO input
                 * Show stations after FROM
                 */

                if (
                    type === "to" &&
                    currentTrainNumber &&
                    currentTrainRoute.length
                ) {

                    showRouteStations();

                    return;

                }

            }
        );


        /* =============================================
           KEYBOARD
        ============================================= */

        input.addEventListener(
            "keydown",
            function(event) {

                if (!currentResults.length) {
                    return;
                }


                /* ======================================
                   DOWN
                ====================================== */

                if (event.key === "ArrowDown") {

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


                /* ======================================
                   UP
                ====================================== */
                else if (
                    event.key === "ArrowUp"
                ) {

                    event.preventDefault();


                    currentIndex--;


                    if (currentIndex < 0) {

                        currentIndex =
                            currentResults.length - 1;

                    }


                    updateHighlight();

                }


                /* ======================================
                   ENTER
                ====================================== */
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


                        selectStation(
                            currentResults[
                                currentIndex
                            ]
                        );

                    }

                }


                /* ======================================
                   TAB
                ====================================== */
                else if (
                    event.key === "Tab"
                ) {

                    if (
                        currentIndex >= 0 &&
                        currentIndex <
                        currentResults.length
                    ) {

                        selectStation(
                            currentResults[
                                currentIndex
                            ]
                        );

                    } else {

                        hideSuggestions();

                    }

                    currentIndex = -1;

                }

            }
        );


        /* =============================================
           CLICK OUTSIDE
        ============================================= */

        document.addEventListener(
            "click",
            function(event) {

                if (
                    !input.contains(event.target) &&
                    !suggestionBox.contains(event.target)
                ) {

                    hideSuggestions();

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE TRAIN
    ===================================================== */

    setupTrainAutocomplete();


    /* =====================================================
       INITIALIZE FROM
    ===================================================== */

    setupStationAutocomplete(
        "source",
        "fromDisplay",
        "brdStn",
        "sourceSuggestions",
        "from"
    );


    /* =====================================================
       INITIALIZE TO
    ===================================================== */

    setupStationAutocomplete(
        "destination",
        "toDisplay",
        "destStn",
        "destinationSuggestions",
        "to"
    );


    /* =====================================================
       LOG
    ===================================================== */

    console.log(
        "Route-aware autocomplete loaded."
    );

    console.log(
        "Trains:",
        trainList.length
    );

    console.log(
        "Stations:",
        stationList.length
    );

});