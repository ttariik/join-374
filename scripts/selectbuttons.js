function selectbutton_11_1() {
  document.getElementById("button11").classList.toggle("lightred");
  document.getElementById("button22").classList.remove("lightorange");
  document.getElementById("button33").classList.remove("lightgreen");
  const urgentImg = document.getElementById("urgentImg11");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";
  const urgentText = document.getElementById("urgent11");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
  document.getElementById("mediumImg22").src = "/img/Medium.png";
  document.getElementById("lowImg33").src = "/img/Low.png";
  document.getElementById("medium22").style.color = "black";
  document.getElementById("low33").style.color = "black";
}

function selectbutton_11_2() {
  if (document.getElementById("button11").classList.contains("lightred")) {
    selectedPriority = "Urgent";
    document.getElementById("button11").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}

function selectbutton_11(task) {
  if (task.category === "Technical Task") {
    selectbutton_11_1();
    selectbutton_11_2();
  } else {
    selectbutton_11_3();
  }
}

function selectbutton_11_3() {
  document.getElementById("button1-1").classList.toggle("lightred");
  document.getElementById("button2-2").classList.remove("lightorange");
  document.getElementById("button3-3").classList.remove("lightgreen");
  const urgentImg = document.getElementById("urgentImg1-1");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";
  const urgentText = document.getElementById("urgent1-1");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
  document.getElementById("mediumImg2-2").src = "/img/Medium.png";
  document.getElementById("lowImg3-3").src = "/img/Low.png";
  document.getElementById("medium2-2").style.color = "black";
  document.getElementById("low3-3").style.color = "black";
}

function selectbutton_11_4() {
  if (document.getElementById("button1-1").classList.contains("lightred")) {
    selectedPriority = "Urgent";
    document.getElementById("button1-1").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}

function selectbutton_22_1() {
  document.querySelector("#button11").classList.remove("lightred");
  document.querySelector("#button22").classList.toggle("lightorange");
  document.querySelector("#button33").classList.remove("lightgreen");
  const mediumImg = document.getElementById("mediumImg22");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";
  const mediumText = document.getElementById("medium22");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg11").src = "/img/Urgent.png";
  document.getElementById("lowImg33").src = "/img/Low.png";
  document.getElementById("urgent11").style.color = "black";
  document.getElementById("low33").style.color = "black";
}

function selectbutton_22_2() {
  if (document.getElementById("button22").classList.contains("lightorange")) {
    selectedPriority = "Medium";
    document.getElementById("button22").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}

function selectbutton_22(task) {
  if (task.category === "Technical Task") {
    selectbutton_22_1();
    selectbutton_22_2();
  } else {
    selectbutton_22_3();
    selectbutton_22_4();
  }

  function selectbutton_22_3() {
    document.querySelector("#button1-1").classList.remove("lightred");
    document.querySelector("#button2-2").classList.toggle("lightorange");
    document.querySelector("#button3-3").classList.remove("lightgreen");
    const mediumImg = document.getElementById("mediumImg2-2");
    mediumImg.src = mediumImg.src.includes("Medium.png")
      ? "/img/medium-white.png"
      : "/img/Medium.png";
    const mediumText = document.getElementById("medium2-2");
    mediumText.style.color =
      mediumText.style.color === "white" ? "black" : "white";
    document.getElementById("urgentImg1-1").src = "/img/Urgent.png";
    document.getElementById("lowImg3-3").src = "/img/Low.png";
    document.getElementById("urgent1-1").style.color = "black";
    document.getElementById("low3-3").style.color = "black";
  }

  function selectbutton_22_4() {
    if (
      document.getElementById("button2-2").classList.contains("lightorange")
    ) {
      selectedPriority = "Medium";
      document.getElementById("button2-2").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  }
}

function selectbutton_33_1() {
  document.getElementById("button11").classList.remove("lightred");
  document.getElementById("button22").classList.remove("lightorange");
  document.getElementById("button33").classList.toggle("lightgreen");
  const lowImg = document.getElementById("lowImg33");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";
  const lowText = document.getElementById("low33");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg11").src = "/img/Urgent.png";
  document.getElementById("mediumImg22").src = "/img/Medium.png";
  document.getElementById("urgent11").style.color = "black";
  document.getElementById("medium22").style.color = "black";
}

function selectbutton_33_2() {
  if (document.getElementById("button33").classList.contains("lightgreen")) {
    selectedPriority = "Low";
    document.getElementById("button33").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}

function selectbutton_33(task) {
  if (task.category === "Technical Task") {
    selectbutton_33_1();
    selectbutton_33_2();
  } else {
    selectbutton_33_3();
    selectbutton_33_4();
  }
}

function selectbutton_33_3() {
  document.getElementById("button1-1").classList.remove("lightred");
  document.getElementById("button2-2").classList.remove("lightorange");
  document.getElementById("button3-3").classList.toggle("lightgreen");
  const lowImg = document.getElementById("lowImg3-3");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";
  const lowText = document.getElementById("low3-3");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg1-1").src = "/img/Urgent.png";
  document.getElementById("mediumImg2-2").src = "/img/Medium.png";
  document.getElementById("urgent1-1").style.color = "black";
  document.getElementById("medium2-2").style.color = "black";
}

function selectbutton_33_4() {
  if (document.getElementById("button3-3").classList.contains("lightgreen")) {
    selectedPriority = "Low";
    document.getElementById("button3-3").classList.toggle("selected");
  } else {
    selectedPriority = "";
  }
}
