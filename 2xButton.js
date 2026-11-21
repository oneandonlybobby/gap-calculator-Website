document.getElementById("myUpgradeButton2x").addEventListener("click", function() {
    if (score >= $2xCost) {
        score -= $2xCost;
        upgrade += 2;
        $2xCost += 10;
        cost += 5;
    }
})