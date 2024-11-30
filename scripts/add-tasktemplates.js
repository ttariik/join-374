function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
      <div class="subbox1 subs${subtasks.length}" id="subboxinput_${subtasks.length}"  data-index="${subtasks.length}" >
        <div class="subbox_11">
        <div id="dot">•</div>
        <div id="sub${subtasks.length}" onclick="editsubtask(${subtasks.length})">${subtaskinput1}</div>
        </div>
        <div class="subbox_22">
        <button type="button" id="editsub${subtasks.length}" onclick="editsubtask(${subtasks.length})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${subtasks.length}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${subtasks.length}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
      </div>
    `;
}

function subtaskdesign(index) {
  return /*html*/ `
      <input id="inputsub${index}" class="editinput" type="text" placeholder="Edit subtask" />
      <div class="subbox_22">
        <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${index}" type="button" class="buttondesign0"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${index}" type="button" class="buttondesign1"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
    `;
}
