// ==========================================
// CAMPUS TRACK
// System Monitoring Frontend
// ==========================================


// ==========================================
// CONFIGURATION
// ==========================================

const NUMBER_OF_TABLES = 24;
const SYSTEMS_PER_TABLE = 4;
const IDLE_TIME = 5 * 60 * 1000;


// ==========================================
// SYSTEM DATA
// ==========================================

const systems = [];


// ==========================================
// REGISTERED USERS
// ==========================================

const users = [];


// ==========================================
// CREATE CLUSTER 1 SYSTEMS
// ==========================================

for (let table = 1; table <= NUMBER_OF_TABLES; table++) {

    for (
        let systemNumber = 1;
        systemNumber <= SYSTEMS_PER_TABLE;
        systemNumber++
    ) {

        const systemId =
            `CL1-T${String(table).padStart(2, "0")}-PC${systemNumber}`;

        const ipAddress =
            `192.168.1.${(table - 1) * 4 + systemNumber}`;

        systems.push({

            id: systemId,

            name: `System ${systemNumber}`,

            table: table,

            cluster: 1,

            ip: ipAddress,

            mac: "00:00:00:00:00:00",

            operatingSystem: "Windows 11",

            processor: "Intel Core i5",

            ram: "8 GB",

            storage: "256 GB SSD",

            location: `Cluster 1 - Table ${table}`,

            status: "working",

            lastActivity: Date.now(),

            uptime: "5 days, 4 hours",

            user: "No active user"

        });

    }

}


// ==========================================
// GET SYSTEM ELEMENTS
// ==========================================

const systemsTableBody =
    document.getElementById("systemsTableBody");

const tableFilter =
    document.getElementById("tableFilter");

const selectedSystem =
    document.getElementById("selectedSystem");


// ==========================================
// GET USER MANAGEMENT ELEMENTS
// ==========================================

const userForm =
    document.getElementById("userForm");

const usersTableBody =
    document.getElementById("usersTableBody");

const fullNameInput =
    document.getElementById("fullName");

const studentIdInput =
    document.getElementById("studentId");

const emailInput =
    document.getElementById("email");

const clusterSelect =
    document.getElementById("clusterSelect");

const userTable =
    document.getElementById("userTable");

const systemSelect =
    document.getElementById("systemSelect");

const userSearch =
    document.getElementById("userSearch");


// ==========================================
// SYSTEM STATUS LABEL
// ==========================================

function getStatusLabel(status) {

    if (status === "working") {
        return "Working";
    }

    if (status === "idle") {
        return "Idle";
    }

    return "Offline";
}


// ==========================================
// SYSTEM STATUS CSS CLASS
// ==========================================

function getStatusClass(status) {

    if (status === "working") {
        return "active";
    }

    if (status === "idle") {
        return "idle";
    }

    return "inactive";
}


// ==========================================
// LAST ACTIVITY
// ==========================================

function getLastActivity(timestamp) {

    const difference =
        Date.now() - timestamp;

    const seconds =
        Math.floor(difference / 1000);

    if (seconds < 60) {
        return "Just now";
    }

    const minutes =
        Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours =
        Math.floor(minutes / 60);

    return `${hours} hr ago`;
}


// ==========================================
// DISPLAY SYSTEMS
// ==========================================

function displaySystems() {

    if (!systemsTableBody) {
        return;
    }

    const selectedTable =
        tableFilter ? tableFilter.value : "all";

    systemsTableBody.innerHTML = "";

    const filteredSystems =
        selectedTable === "all"
            ? systems
            : systems.filter(
                system =>
                    system.table === Number(selectedTable)
            );

    filteredSystems.forEach(system => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                <strong>${system.id}</strong>
            </td>

            <td>
                Table ${system.table}
            </td>

            <td>
                ${system.ip}
            </td>

            <td>

                <span class="status ${getStatusClass(system.status)}">

                    <span></span>

                    ${getStatusLabel(system.status)}

                </span>

            </td>

            <td>
                ${getLastActivity(system.lastActivity)}
            </td>

            <td>
                ${system.uptime}
            </td>

            <td>

                <button
                    class="view-button"
                    onclick="showSystemDetails('${system.id}')"
                >
                    View
                </button>

            </td>

        `;

        systemsTableBody.appendChild(row);

    });

}


// ==========================================
// SHOW FULL SYSTEM DETAILS
// ==========================================

function showSystemDetails(systemId) {

    const system =
        systems.find(
            item => item.id === systemId
        );

    if (!system || !selectedSystem) {
        return;
    }

    selectedSystem.innerHTML = `

        <div class="card-heading">

            <div>

                <h3>
                    ${system.id}
                </h3>

                <p>
                    Full system information
                </p>

            </div>

            <span class="status ${getStatusClass(system.status)}">

                <span></span>

                ${getStatusLabel(system.status)}

            </span>

        </div>


        <div class="system-detail-grid">


            <div class="detail-item">

                <span>System ID</span>

                <strong>
                    ${system.id}
                </strong>

            </div>


            <div class="detail-item">

                <span>System Name</span>

                <strong>
                    ${system.name}
                </strong>

            </div>


            <div class="detail-item">

                <span>Cluster</span>

                <strong>
                    Cluster ${system.cluster}
                </strong>

            </div>


            <div class="detail-item">

                <span>Table</span>

                <strong>
                    Table ${system.table}
                </strong>

            </div>


            <div class="detail-item">

                <span>Location</span>

                <strong>
                    ${system.location}
                </strong>

            </div>


            <div class="detail-item">

                <span>IP Address</span>

                <strong>
                    ${system.ip}
                </strong>

            </div>


            <div class="detail-item">

                <span>MAC Address</span>

                <strong>
                    ${system.mac}
                </strong>

            </div>


            <div class="detail-item">

                <span>Operating System</span>

                <strong>
                    ${system.operatingSystem}
                </strong>

            </div>


            <div class="detail-item">

                <span>Processor</span>

                <strong>
                    ${system.processor}
                </strong>

            </div>


            <div class="detail-item">

                <span>RAM</span>

                <strong>
                    ${system.ram}
                </strong>

            </div>


            <div class="detail-item">

                <span>Storage</span>

                <strong>
                    ${system.storage}
                </strong>

            </div>


            <div class="detail-item">

                <span>Current User</span>

                <strong>
                    ${system.user}
                </strong>

            </div>


            <div class="detail-item">

                <span>Last Activity</span>

                <strong>
                    ${getLastActivity(system.lastActivity)}
                </strong>

            </div>


            <div class="detail-item">

                <span>Uptime</span>

                <strong>
                    ${system.uptime}
                </strong>

            </div>


        </div>

    `;

}


// ==========================================
// 5-MINUTE IDLE DETECTION
// ==========================================

function checkIdleSystems() {

    const currentTime =
        Date.now();

    systems.forEach(system => {

        if (
            system.status === "working" &&
            currentTime - system.lastActivity >= IDLE_TIME
        ) {

            system.status = "idle";

        }

    });

    displaySystems();

}


// Check every 10 seconds

setInterval(
    checkIdleSystems,
    10000
);


// ==========================================
// DEMO USER ACTIVITY
// ==========================================

document.addEventListener(
    "mousemove",
    function () {

        /*
            This is only a frontend demonstration.

            Later, the real monitoring system
            will receive activity from each
            individual computer.
        */

        const demoSystem =
            systems[0];

        if (!demoSystem) {
            return;
        }

        demoSystem.lastActivity =
            Date.now();

        demoSystem.status =
            "working";

        displaySystems();

    }
);


// ==========================================
// TABLE FILTER
// ==========================================

if (tableFilter) {

    tableFilter.addEventListener(
        "change",
        displaySystems
    );

}


// ==========================================
// REFRESH BUTTON
// ==========================================

const refreshButton =
    document.getElementById("refreshButton");

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            refreshButton.textContent =
                "↻ Refreshing...";

            setTimeout(
                function () {

                    refreshButton.textContent =
                        "↻ Refresh";

                    displaySystems();

                },
                1000
            );

        }
    );

}


// ==========================================
// USER MANAGEMENT
// ==========================================


// ==========================================
// CREATE TABLE OPTIONS
// ==========================================

function createTableOptions() {

    if (!userTable) {
        return;
    }

    userTable.innerHTML = `

        <option value="">
            Select table
        </option>

    `;

    const selectedCluster =
        clusterSelect ? clusterSelect.value : "";


    /*
        For now, only Cluster 1 has
        accurate system information.

        We will add the accurate numbers
        for Clusters 2, 3 and 4 later.
    */

    if (selectedCluster !== "1") {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Tables not configured yet";

        option.disabled = true;

        userTable.appendChild(option);

        return;
    }


    // Cluster 1 has 24 tables

    for (
        let table = 1;
        table <= NUMBER_OF_TABLES;
        table++
    ) {

        const option =
            document.createElement("option");

        option.value =
            table;

        option.textContent =
            `Table ${table}`;

        userTable.appendChild(option);

    }

}


// ==========================================
// LOAD SYSTEM OPTIONS
// ==========================================

function loadSystemOptions() {

    if (!systemSelect) {
        return;
    }

    systemSelect.innerHTML = `

        <option value="">
            Select system
        </option>

    `;

    const selectedCluster =
        clusterSelect ? clusterSelect.value : "";

    const selectedTable =
        userTable ? userTable.value : "";


    // No cluster selected

    if (!selectedCluster) {
        return;
    }


    // No table selected

    if (!selectedTable) {
        return;
    }


    /*
        Clusters 2, 3 and 4 are waiting
        for their accurate system numbers.
    */

    if (selectedCluster !== "1") {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Systems not configured yet";

        option.disabled = true;

        systemSelect.appendChild(option);

        return;
    }


    // ======================================
    // CLUSTER 1 SYSTEMS
    // ======================================

    const availableSystems =
        systems.filter(
            system =>
                system.cluster ===
                    Number(selectedCluster)

                &&

                system.table ===
                    Number(selectedTable)

                &&

                !users.some(
                    user =>
                        user.systemId === system.id
                )
        );


    // Add available systems

    availableSystems.forEach(system => {

        const option =
            document.createElement("option");

        option.value =
            system.id;

        option.textContent =
            `${system.id} - ${system.name}`;

        systemSelect.appendChild(option);

    });


    // No systems available

    if (availableSystems.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No available systems";

        option.disabled = true;

        systemSelect.appendChild(option);

    }

}


// ==========================================
// CLUSTER CHANGED
// ==========================================

if (clusterSelect) {

    clusterSelect.addEventListener(
        "change",
        function () {

            // Clear table

            if (userTable) {

                userTable.value = "";

            }


            // Clear system

            if (systemSelect) {

                systemSelect.innerHTML = `

                    <option value="">
                        Select system
                    </option>

                `;

            }


            // Create correct tables

            createTableOptions();

        }
    );

}


// ==========================================
// TABLE CHANGED
// ==========================================

if (userTable) {

    userTable.addEventListener(
        "change",
        function () {

            loadSystemOptions();

        }
    );

}


// ==========================================
// REGISTER USER
// ==========================================

if (userForm) {

    userForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                fullNameInput.value.trim();

            const studentId =
                studentIdInput.value.trim();

            const email =
                emailInput.value.trim();

            const cluster =
                clusterSelect.value;

            const table =
                userTable.value;

            const systemId =
                systemSelect.value;


            // ======================================
            // CHECK REQUIRED FIELDS
            // ======================================

            if (
                !fullName ||
                !studentId ||
                !email ||
                !cluster ||
                !table ||
                !systemId
            ) {

                alert(
                    "Please complete all fields."
                );

                return;

            }


            // ======================================
            // PREVENT DUPLICATE STUDENT ID
            // ======================================

            const existingUser =
                users.find(
                    user =>
                        user.studentId.toLowerCase() ===
                        studentId.toLowerCase()
                );


            if (existingUser) {

                alert(
                    "A user with this Student ID already exists."
                );

                return;

            }


            // ======================================
            // PREVENT DUPLICATE SYSTEM ASSIGNMENT
            // ======================================

            const systemAlreadyAssigned =
                users.some(
                    user =>
                        user.systemId === systemId
                );


            if (systemAlreadyAssigned) {

                alert(
                    "This system is already assigned to another user."
                );

                return;

            }


            // ======================================
            // FIND SYSTEM
            // ======================================

            const assignedSystem =
                systems.find(
                    system =>
                        system.id === systemId
                );


            if (!assignedSystem) {

                alert(
                    "System could not be found."
                );

                return;

            }


            // ======================================
            // CREATE USER
            // ======================================

            const newUser = {

                studentId: studentId,

                name: fullName,

                email: email,

                cluster: Number(cluster),

                table: Number(table),

                systemId: systemId,

                status: "Active"

            };


            // Add user to users array

            users.push(newUser);


            // Attach user to system

            assignedSystem.user =
                fullName;


            // Show updated users

            displayUsers();


            // Refresh system options

            loadSystemOptions();


            // Reset form

            userForm.reset();


            // Clear system dropdown

            if (systemSelect) {

                systemSelect.innerHTML = `

                    <option value="">
                        Select system
                    </option>

                `;

            }


            alert(
                `${fullName} has been registered successfully.`
            );

        }
    );

}


// ==========================================
// DISPLAY REGISTERED USERS
// ==========================================

function displayUsers() {

    if (!usersTableBody) {
        return;
    }


    usersTableBody.innerHTML = "";


    let filteredUsers =
        users;


    // ======================================
    // SEARCH USERS
    // ======================================

    if (userSearch) {

        const search =
            userSearch.value
                .toLowerCase()
                .trim();


        if (search) {

            filteredUsers =
                users.filter(
                    user =>
                        user.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        user.studentId
                            .toLowerCase()
                            .includes(search)

                        ||

                        user.email
                            .toLowerCase()
                            .includes(search)

                        ||

                        user.systemId
                            .toLowerCase()
                            .includes(search)
                );

        }

    }


    // ======================================
    // DISPLAY USERS
    // ======================================

    filteredUsers.forEach(user => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${user.studentId}
                </strong>
            </td>

            <td>
                ${user.name}
            </td>

            <td>
                ${user.email}
            </td>

            <td>
                Cluster ${user.cluster}
            </td>

            <td>
                Table ${user.table}
            </td>

            <td>
                ${user.systemId}
            </td>

            <td>

                <span class="status active">

                    <span></span>

                    ${user.status}

                </span>

            </td>

        `;


        usersTableBody.appendChild(row);

    });


    // ======================================
    // NO USERS
    // ======================================

    if (filteredUsers.length === 0) {

        usersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align: center; padding: 30px;"
                >
                    No registered users yet.
                </td>

            </tr>

        `;

    }

}


// ==========================================
// SEARCH USERS
// ==========================================

if (userSearch) {

    userSearch.addEventListener(
        "input",
        displayUsers
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

createTableOptions();

displaySystems();

displayUsers();