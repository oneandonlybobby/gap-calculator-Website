
setInterval(() => {
 myButton.textContent = `Score: ${score}`;
 myUpgradeButton.textContent = `Upgrade +1x cost: ${cost}`;
 myUpgradeButton2x.textContent = `Upgrade +2x cost: ${$2xCost}`;
 autoClickerButton.textContent = `Auto Clicker (cost: ${$autoClickerCost})`;
 upgradeValue.textContent = `Upgrade: ${upgrade}x `; 
sps.textContent = `SPS: ${autoClicker}    `;
}, 100);