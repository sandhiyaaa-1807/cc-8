let appliances = [];
let usageChart = null;

function addAppliance() {
    let name = document.getElementById("appliance").value.trim();
    let power = Number(document.getElementById("power").value);
    let hours = Number(document.getElementById("hours").value);

    if (!name || power <= 0 || hours <= 0 || hours > 24) {
        alert("Please enter valid appliance details!");
        return;
    }

    appliances.push({
        name: name,
        power: power,
        hours: hours
    });

    displayAppliances();

    document.getElementById("appliance").value = "";
    document.getElementById("power").value = "";
    document.getElementById("hours").value = "";
}

function displayAppliances() {
    let list = document.getElementById("applianceList");
    list.innerHTML = "";

    appliances.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "appliance-item";

        let label = document.createElement("span");
        label.textContent =
            item.name + " - " +
            item.power + "W - " +
            item.hours + " hours/day ";

        let button = document.createElement("button");
        button.textContent = "Delete";
        button.onclick = () => deleteAppliance(index);

        div.append(label, button);
        list.appendChild(div);
    });
}

function deleteAppliance(index) {
    appliances.splice(index, 1);
    displayAppliances();
}

function predictUsage() {
    if (appliances.length === 0) {
        alert("Please add at least one appliance!");
        return;
    }

    let dailyUsage = 0;

    appliances.forEach(item => {
        dailyUsage += (item.power * item.hours) / 1000;
    });

    let monthlyUsage = dailyUsage * 30;

    // Demo tariff only: ₹6 per kWh
    let electricityBill = monthlyUsage * 6;

    document.getElementById("dailyUsage").innerText =
        "Daily Usage: " + dailyUsage.toFixed(2) + " kWh";

    document.getElementById("monthlyUsage").innerText =
        "Monthly Usage: " + monthlyUsage.toFixed(2) + " kWh";

    document.getElementById("bill").innerText =
        "Estimated Bill: ₹" + electricityBill.toFixed(2);

    showChart(dailyUsage, monthlyUsage);
    showTips(monthlyUsage);
}

function showChart(daily, monthly) {
    let ctx = document.getElementById("usageChart");

    if (usageChart) {
        usageChart.destroy();
    }

    usageChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Daily Usage", "Monthly Usage"],
            datasets: [{
                label: "Electricity Usage (kWh)",
                data: [daily, monthly],
                backgroundColor: ["#00c6ff", "#0072ff"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showTips(monthlyUsage) {
    let tips = "";

    if (monthlyUsage > 300) {
        tips = "⚠️ High electricity usage! Reduce AC usage and switch to energy-efficient appliances.";
    } else if (monthlyUsage > 150) {
        tips = "💡 Moderate usage. Turn off unused lights and fans.";
    } else {
        tips = "✅ Good! Your estimated electricity consumption is relatively low.";
    }

    document.getElementById("tips").innerText = tips;
}