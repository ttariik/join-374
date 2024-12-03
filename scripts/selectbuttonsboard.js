function selectbutton_1() {
  document.getElementById("button1").classList.toggle("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");
  const urgentImg = document.getElementById("urgentImg");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";
  selectbutton_1_1();
}

function selectbutton_1_1() {
  const urgentText = document.getElementById("urgent");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";
  if (document.getElementById("button1").classList.contains("lightred")) {
    selectedPriority = "Urgent";
    document.getElementById("button1").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}

function selectbutton_2() {
  document.querySelector("#button1").classList.remove("lightred");
  document.querySelector("#button2").classList.toggle("lightorange");
  document.querySelector("#button3").classList.remove("lightgreen");
  const mediumImg = document.getElementById("mediumImg");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";
  const mediumText = document.getElementById("medium");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("low").style.color = "black";
  if (document.getElementById("button2").classList.contains("lightorange")) {
    selectedPriority = "Medium";
    document.getElementById("button2").classList.add("selected");
  } else {
    document.getElementById("button2").classList.toggle("selected");
    selectedPriority = "";
  }
}

function selectbutton_3() {
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.toggle("lightgreen");
  const lowImg = document.getElementById("lowImg");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";
  const lowText = document.getElementById("low");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
  if (document.getElementById("button3").classList.contains("lightgreen")) {
    selectedPriority = "Low";
    document.getElementById("button3").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}
