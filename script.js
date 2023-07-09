// Garbage items and their corresponding bins
const garbageItems = [
    { name: "carrot", bin: "food-bin" },
    { name: "can", bin: "recycle-bin" },
    { name: "plastic bottle", bin: "recycle-bin" },
    { name: "newspaper", bin: "recycle-bin" },
    { name: "plastic bag", bin: "recycle-bin" }
  ];
  
  // Variables to store the score and number of correct moves
  let score = 0;
  let correctMoves = 0;
  
  // Function to check if all garbage items are correctly sorted
  function checkGameOver() {
    if (correctMoves === garbageItems.length) {
      alert("Game Over. Your final score is " + score);
    }
  }
  
  // Function to handle dragging the garbage items
  function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
  }
  
  // Function to handle dropping the garbage items
  function drop(event) {
    event.preventDefault();
    const garbageId = event.dataTransfer.getData("text");
    const garbage = document.getElementById(garbageId);
    const binId = event.target.id;
    const bin = document.getElementById(binId);
  
    const garbageItem = garbageItems.find(item => item.name === garbageId);
    if (garbageItem && binId === garbageItem.bin) {
      bin.appendChild(garbage);
      score++;
      correctMoves++;
      document.getElementById("score").textContent = "Score: " + score;
    }
  
    checkGameOver();
  }
  
  // Function to handle allowing dropping on the trash bins
  function allowDrop(event) {
    event.preventDefault();
  }
  
  // Add event listeners to the trash bins
  const bins = document.querySelectorAll(".trash-bin");
  bins.forEach(bin => {
    bin.addEventListener("drop", drop);
    bin.addEventListener("dragover", allowDrop);
  });
  
  // Add event listeners to the garbage items
  const garbageItemsElements = document.querySelectorAll(".garbage");
  garbageItemsElements.forEach(item => {
    item.addEventListener("dragstart", drag);
  });
  