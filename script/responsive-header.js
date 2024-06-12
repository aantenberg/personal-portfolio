function expandNav() {
  var x = document.getElementById("nav");
  const oldName = x.className;
  if (oldName.includes("responsive")) {
    x.className = oldName.replace("responsive", "")
  } else {
    x.className = oldName + " responsive"
  }
}