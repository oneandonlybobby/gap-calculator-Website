body = document.body;
let score = 0;
let upgrade = 1;
let cost = 10;
let $2xCost = 20;
let $autoClickerCost = 50;
let autoClicker = 0;

body.innerHTML = '<button id="autoClickerButton">Auto Clicker (cost: 50)</button>' 
body.innerHTML = `<button id="myUpgradeButton2x">Upgrade +2x cost: 20</button>` + body.innerHTML;
body.innerHTML =  `<button id="myUpgradeButton">Upgrade +1x cost: ${cost}</button>`+ body.innerHTML;
body.innerHTML = `<button id="myButton">Click Me</button>` + body.innerHTML;
body.innerHTML = `<text id="upgradeValue">Upgrade: ${upgrade}x </text>` + body.innerHTML;
body.innerHTML = `<text id="sps">SPS: ${autoClicker}    </text>` + body.innerHTML;

function buyUpgrade() {
    score -= cost;
    upgrade += 1;
    cost += 5;
    $2xCost += 10;
}

upgradeValue = document.getElementById('upgradeValue')
autoClickerButton = document.getElementById('autoClickerButton')
myUpgradeButton2x = document.getElementById('myUpgradeButton2x')
myUpgradeButton = document.getElementById('myUpgradeButton')
myButton = document.getElementById('myButton')
myButton.addEventListener('click', () => {
    score += upgrade;
    myButton.textContent = `Score: ${score}`;
});

document.getElementById("myUpgradeButton").addEventListener("click", function() {
    if (score >= cost) {
        buyUpgrade();
    }
})




