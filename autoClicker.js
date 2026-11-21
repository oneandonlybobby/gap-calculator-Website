document.getElementById("autoClickerButton").addEventListener("click", function() {
    if (score >= $autoClickerCost) {
        score -= $autoClickerCost;
        autoClicker += 1;
        $autoClickerCost += 15;
    }
})

setInterval(() => {
  score += autoClicker;
    myButton.textContent = `Score: ${score}`;
}, 1000);
